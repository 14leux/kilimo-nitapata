import { test } from "node:test";
import assert from "node:assert/strict";
import { FARMERS, DEPOTS, evaluate, blockingItem, findFarmer } from "../engine.js";
import { createStore, memoryClient } from "../lib/store.js";
import { loadSeason, loadFarmer, loadFarmers, loadFarmerByToken, collectionPoint, isMessageable } from "../lib/register.js";

const NOW = "2026-09-02T14:05:00.000Z";
async function seeded() { const s = createStore(memoryClient()); await s.seed("s1", { now: NOW }); return s; }

test("seed register: every farmer has a valid collection point, a lang, a unique token, and demo phones are flagged", () => {
  const tokens = new Set();
  for (const f of FARMERS) {
    assert.ok(DEPOTS.some((d) => d.id === f.collectionPointId), `${f.id} collection point`);
    assert.ok(["sw", "en"].includes(f.lang), `${f.id} lang`);
    assert.match(f.token, /^[a-z0-9]{12}$/, `${f.id} token shape`);
    assert.ok(!tokens.has(f.token), `${f.id} duplicate token`); tokens.add(f.token);
    if (f.phone) assert.match(f.phone, /^\+254\d{9}$/, `${f.id} phone E.164`);
    assert.equal(f.demo, true, `${f.id}: seed phones are placeholders until Q3 is answered`);
  }
});

test("fresh overlay reproduces the seed verdict exactly", async () => {
  const s = await seeded();
  const farmers = await loadFarmers(s, "s1");
  for (const f of farmers) {
    const seed = findFarmer(f.id);
    const d = collectionPoint(f);
    assert.deepEqual(evaluate(f, d).verdict, evaluate(seed, d).verdict, f.id);
    assert.ok(f.approvals.acChief && "signedBy" in f.approvals.acChief);
  }
});

test("an approval in the store changes the verdict through evaluate()", async () => {
  const s = await seeded();
  const season = { subsidyReleased: true };
  const before = await loadFarmer(s, "s1", findFarmer("F-3387"));
  assert.equal(blockingItem(evaluate(before, collectionPoint(before), season), collectionPoint(before)).key, "acChief");
  await s.putApproval("s1", "F-3387", "acChief", { signed: true, signedBy: "Chief Kamau" }, NOW);
  const after = await loadFarmer(s, "s1", findFarmer("F-3387"));
  assert.equal(after.acChief, true);
  assert.equal(after.approvals.acChief.signedBy, "Chief Kamau");
  assert.equal(evaluate(after, collectionPoint(after), season).verdict, "ok");
  assert.equal(findFarmer("F-3387").acChief, false, "seed must not be mutated");
});

test("dirty set: marked on approval, cleared when a snapshot is written", async () => {
  const s = await seeded();
  await s.putApproval("s1", "F-3387", "acChief", { signed: true, signedBy: "Chief Kamau" }, NOW);
  await s.markDirty("s1", "F-3387");
  assert.deepEqual(await s.listDirty("s1"), ["F-3387"]);
  await s.putStatus("s1", "F-3387", { verdict: "ok", computedAt: NOW });
  assert.deepEqual(await s.listDirty("s1"), []);
});

test("season and token lookups", async () => {
  const s = await seeded();
  assert.equal((await loadSeason(s)).id, "s1", "active season by default");
  assert.equal((await loadSeason(s, "nope")), null);
  const f = await loadFarmerByToken(s, "s1", "cheb1046nd03");
  assert.equal(f.id, "F-1046");
  assert.equal(await loadFarmerByToken(s, "s1", "bad"), null);
});

test("isMessageable: demo or missing phone is never messageable", () => {
  for (const f of FARMERS) assert.equal(isMessageable(f), false, f.id);
  assert.equal(isMessageable({ phone: "+254712345678", demo: false }), true);
  assert.equal(isMessageable({ phone: null, demo: false }), false);
});
