import { test } from "node:test";
import assert from "node:assert/strict";
import { FARMERS, SIGNATURE_KEYS, DEFAULT_PRICE_PER_BAG } from "../engine.js";
import { createStore, memoryClient, maskPhone, key } from "../lib/store.js";

const NOW = "2026-09-02T14:05:00.000Z";
const fresh = () => createStore(memoryClient());

test("seed writes a draft season, the active pointer, and one approval per farmer per signature", async () => {
  const s = fresh();
  const season = await s.seed("s1", { now: NOW });
  assert.equal(season.status, "draft");
  assert.equal(season.subsidyReleased, false);
  assert.equal(season.pricePerBag, DEFAULT_PRICE_PER_BAG);
  assert.equal(await s.getActiveSeasonId(), "s1");
  const ks = await s.client.keys("season:s1*");
  assert.equal(ks.length, 1 + FARMERS.length * SIGNATURE_KEYS.length);
  for (const f of FARMERS) for (const req of SIGNATURE_KEYS) {
    const a = await s.getApproval("s1", f.id, req);
    assert.equal(a.signed, Boolean(f[req]), `${f.id} ${req}`);
    assert.equal(a.signedBy, f[req] ? "register" : null);
  }
});

test("reset wipes the season prefix and reseeds; other seasons untouched", async () => {
  const s = fresh();
  await s.seed("s1", { now: NOW });
  await s.seed("s2", { now: NOW });
  await s.putApproval("s1", "F-3387", "acChief", { signed: true, signedBy: "Chief Kamau" }, NOW);
  await s.markDirty("s1", "F-3387");
  await s.reset("s1", { now: NOW });
  assert.equal((await s.getApproval("s1", "F-3387", "acChief")).signed, false);
  assert.deepEqual(await s.listDirty("s1"), []);
  assert.ok(await s.getSeason("s2"));
});

test("approvals keep history; unsigning clears signer and date", async () => {
  const s = fresh();
  await s.seed("s1", { now: NOW });
  const a = await s.putApproval("s1", "F-3387", "acChief", { signed: true, signedBy: "Chief Kamau" }, NOW);
  assert.equal(a.signed, true); assert.equal(a.signedBy, "Chief Kamau"); assert.equal(a.signedAt, NOW);
  const b = await s.putApproval("s1", "F-3387", "acChief", { signed: false }, "2026-09-02T15:00:00.000Z");
  assert.equal(b.signed, false); assert.equal(b.signedBy, null); assert.equal(b.signedAt, null);
  assert.equal(b.history.length, 3, "seed + sign + unsign");
});

test("snapshots are versioned and immutable; writing one clears dirty", async () => {
  const s = fresh();
  await s.seed("s1", { now: NOW });
  await s.markDirty("s1", "F-2291", "F-3387");
  assert.deepEqual((await s.listDirty("s1")).sort(), ["F-2291", "F-3387"]);
  const v1 = await s.putStatus("s1", "F-2291", { verdict: "warn", computedAt: NOW });
  const v2 = await s.putStatus("s1", "F-2291", { verdict: "ok", computedAt: NOW });
  assert.equal(v1.version, 1); assert.equal(v2.version, 2);
  assert.equal((await s.getStatus("s1", "F-2291")).verdict, "ok");
  assert.equal(JSON.parse(await s.client.get(key.statusVersion("s1", "F-2291", 1))).verdict, "warn", "old version kept");
  assert.deepEqual(await s.listDirty("s1"), ["F-3387"]);
});

test("message log masks the phone and orders by sequence", async () => {
  const s = fresh();
  await s.seed("s1", { now: NOW });
  await s.logMessage("s1", "F-2291", { channel: "whatsapp", to: "+254712345678", status: "sent", providerId: "SM1", at: NOW });
  await s.logMessage("s1", "F-2291", { channel: "sms", to: "+254712345678", status: "failed", error: "30018", at: NOW });
  const msgs = await s.messagesFor("s1", "F-2291");
  assert.equal(msgs.length, 2);
  assert.equal(msgs[0].channel, "whatsapp"); assert.equal(msgs[1].channel, "sms");
  for (const m of msgs) { assert.equal(m.to, "+…5678"); assert.equal(JSON.stringify(m).includes("254712345678"), false); }
});

test("maskPhone never leaks more than four digits", () => {
  assert.equal(maskPhone("+254712345678"), "+…5678");
  assert.equal(maskPhone("0712 345 678"), "+…5678");
  assert.equal(maskPhone(""), null);
  assert.equal(maskPhone(null), null);
  assert.equal(maskPhone("12"), "+…");
});
