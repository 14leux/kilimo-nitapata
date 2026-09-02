import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore, memoryClient } from "../lib/store.js";
import { createHandler as boardHandler } from "../api/board.js";
import { createHandler as seasonHandler } from "../api/season.js";
import { createHandler as approvalHandler } from "../api/approval.js";

const NOW = "2026-09-02T14:05:00.000Z";
const PASSCODE = "test-pass";
process.env.OFFICER_PASSCODE = PASSCODE;

async function seeded() { const s = createStore(memoryClient()); await s.seed("s1", { now: NOW }); return s; }

function req({ headers = {}, body } = {}) {
  return { headers: { "x-officer-passcode": PASSCODE, ...headers }, body };
}
function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    end(b) { this.body = b === undefined ? null : b; return this; }
  };
}

test("board: wrong passcode returns 401 with no body detail", async () => {
  const res = mockRes();
  await boardHandler(await seeded())(req({ headers: { "x-officer-passcode": "nope" } }), res);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body, null);
});

test("board: missing OFFICER_PASSCODE fails closed rather than open", async () => {
  const saved = process.env.OFFICER_PASSCODE;
  delete process.env.OFFICER_PASSCODE;
  const res = mockRes();
  await boardHandler(await seeded())(req(), res);
  assert.equal(res.statusCode, 401);
  process.env.OFFICER_PASSCODE = saved;
});

test("board: lists every farmer with a verdict, blocking item and delivery 'none' pre-release", async () => {
  const res = mockRes();
  await boardHandler(await seeded())(req(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.season.id, "s1");
  assert.ok(res.body.farmers.length > 0);
  for (const row of res.body.farmers) {
    assert.ok(["ok", "warn", "danger"].includes(row.verdict), row.id);
    assert.equal(row.delivery, "none");
  }
});

test("board: subsidy not yet released makes every farmer danger with the subsidy gate", async () => {
  const res = mockRes();
  await boardHandler(await seeded())(req(), res); // seed leaves subsidyReleased false
  for (const row of res.body.farmers) {
    assert.equal(row.verdict, "danger");
    assert.equal(row.blocking.key, "subsidy");
  }
});

test("season: open moves draft to open and logs it", async () => {
  const res = mockRes();
  await seasonHandler(await seeded())(req({ body: { action: "open" } }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.season.status, "open");
  assert.ok(res.body.season.openedAt);
  assert.ok(res.body.season.log.some((l) => l.what === "opened season"));
});

test("season: action 'release' is rejected here, points at /api/release", async () => {
  const res = mockRes();
  await seasonHandler(await seeded())(req({ body: { action: "release" } }), res);
  assert.equal(res.statusCode, 400);
});

test("season: subsidyReleased flip is logged and marks every farmer dirty", async () => {
  const s = await seeded();
  await seasonHandler(s)(req({ body: { action: "open" } }), mockRes());
  const res = mockRes();
  await seasonHandler(s)(req({ body: { action: "open", subsidyReleased: true } }), res);
  assert.equal(res.body.season.subsidyReleased, true);
  assert.ok(res.body.season.log.some((l) => l.what.includes("subsidyReleased")));
  const dirty = await s.listDirty("s1");
  assert.ok(dirty.length > 0);
});

test("season: pricePerBag change is logged and sourced to the officer", async () => {
  const s = await seeded();
  const res = mockRes();
  await seasonHandler(s)(req({ body: { action: "open", pricePerBag: 2700 } }), res);
  assert.equal(res.body.season.pricePerBag, 2700);
  assert.equal(res.body.season.priceSource, "officer");
});

test("approval: unknown reqKey is rejected", async () => {
  const res = mockRes();
  await approvalHandler(await seeded())(req({ body: { farmerId: "F-3387", reqKey: "bogus", signed: true } }), res);
  assert.equal(res.statusCode, 400);
});

test("approval: toggle signed then board shows the new verdict", async () => {
  const s = await seeded();
  await seasonHandler(s)(req({ body: { action: "open", subsidyReleased: true } }), mockRes());

  const before = mockRes();
  await boardHandler(s)(req(), before);
  const row = before.body.farmers.find((f) => f.id === "F-3387");
  assert.equal(row.blocking.key, "acChief");

  const approvalRes = mockRes();
  await approvalHandler(s)(
    req({ body: { farmerId: "F-3387", reqKey: "acChief", signed: true, signedBy: "Chief Kamau" } }),
    approvalRes
  );
  assert.equal(approvalRes.statusCode, 200);
  assert.equal(approvalRes.body.approval.signed, true);
  assert.equal(approvalRes.body.approval.signedBy, "Chief Kamau");

  const after = mockRes();
  await boardHandler(s)(req(), after);
  const row2 = after.body.farmers.find((f) => f.id === "F-3387");
  assert.notEqual(row2.blocking && row2.blocking.key, "acChief");
  assert.equal(row2.verdict, approvalRes.body.verdict);
});

test("approval: does not mark dirty before release, does once released", async () => {
  const s = await seeded();
  await seasonHandler(s)(req({ body: { action: "open" } }), mockRes());
  // Set subsidyReleased directly on the store, bypassing the season endpoint's
  // own "mark every farmer dirty" behaviour, so this test isolates approval's.
  const opened = await s.getSeason("s1");
  opened.subsidyReleased = true;
  await s.putSeason(opened);

  await approvalHandler(s)(req({ body: { farmerId: "F-3387", reqKey: "acChief", signed: true, signedBy: "x" } }), mockRes());
  assert.equal((await s.listDirty("s1")).length, 0);

  const season = await s.getSeason("s1");
  season.status = "released";
  await s.putSeason(season);

  await approvalHandler(s)(req({ body: { farmerId: "F-3387", reqKey: "subCounty", signed: true, signedBy: "y" } }), mockRes());
  assert.ok((await s.listDirty("s1")).includes("F-3387"));
});
