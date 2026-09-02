import { test } from "node:test";
import assert from "node:assert/strict";
import { FARMERS, DEPOTS, REQUIREMENTS, SOURCES, PRICES, evaluate, VERDICT_LABEL, blockingItem, clerkSummary, ussdText, USSD_BUDGET, SUBSIDY_GATE, buildSnapshot, DEFAULT_PRICE_PER_BAG, SIGNATURE_KEYS, releaseText, RELEASE_BUDGET } from "../engine.js";

const pairs = FARMERS.flatMap((f) => DEPOTS.map((d) => [f, d]));

test("every farmer x depot pair yields a well-formed, deterministic verdict", () => {
  assert.equal(pairs.length, FARMERS.length * DEPOTS.length);
  for (const [f, d] of pairs) {
    const a = evaluate(f, d);
    const b = evaluate(f, d);
    assert.deepEqual(a, b, `${f.id} x ${d.id} not deterministic`);
    assert.ok(a.verdict in VERDICT_LABEL, `${f.id} x ${d.id} unknown verdict ${a.verdict}`);
    assert.equal(a.checks.length, REQUIREMENTS.length);
    assert.ok(a.reason.text.length > 0);
  }
});

test("an unauthorised depot is always Not Served, whatever the farmer's record", () => {
  for (const d of DEPOTS.filter((x) => !x.authorized)) {
    for (const f of FARMERS) {
      const r = evaluate(f, d);
      assert.equal(r.verdict, "danger", `${f.id} x ${d.id}`);
      assert.equal(r.depotOK, false);
    }
  }
});

test("an unregistered farmer is Not Served at every authorised depot", () => {
  for (const f of FARMERS.filter((x) => !x.registered)) {
    for (const d of DEPOTS.filter((x) => x.authorized)) {
      assert.equal(evaluate(f, d).verdict, "danger", `${f.id} x ${d.id}`);
    }
  }
});

test("no gaps at an authorised depot means Served; any gap means Conditional", () => {
  for (const [f, d] of pairs) {
    if (!d.authorized || !f.registered) continue;
    const r = evaluate(f, d);
    assert.equal(r.verdict, r.gaps.length === 0 ? "ok" : "warn", `${f.id} x ${d.id}`);
  }
});

test("exhausting the bag allocation shows up as a gap", () => {
  const exhausted = FARMERS.find((f) => f.bagsUsed >= f.bagsAllocated && f.registered);
  const depot = DEPOTS.find((d) => d.authorized);
  const r = evaluate(exhausted, depot);
  assert.ok(r.gaps.some((g) => g.key === "withinLimit"));
});

test("every citation points at a source that exists", () => {
  const ids = new Set(SOURCES.map((s) => s.id));
  const cited = [
    ...REQUIREMENTS.flatMap((r) => r.src),
    ...PRICES.flatMap((p) => p.src),
    ...pairs.flatMap(([f, d]) => evaluate(f, d).reason.src)
  ];
  for (const id of cited) assert.ok(ids.has(id), `dangling citation [${id}]`);
});

test("blocking item: depot outranks farmer; otherwise first gap; null when served", () => {
  for (const [f, d] of pairs) {
    const r = evaluate(f, d);
    const b = blockingItem(r, d);
    if (!d.authorized) assert.equal(b.key, "depot", `${f.id} x ${d.id}`);
    else if (r.gaps.length) assert.equal(b.key, r.gaps[0].key, `${f.id} x ${d.id}`);
    else assert.equal(b, null, `${f.id} x ${d.id}`);
  }
});

test("clerk summary agrees with evaluate and resolves every citation", () => {
  for (const [f, d] of pairs) {
    const s = clerkSummary(f, d);
    const r = evaluate(f, d);
    assert.equal(s.verdict, r.verdict, `${f.id} x ${d.id}`);
    assert.equal(s.label, VERDICT_LABEL[r.verdict]);
    assert.ok(s.headline.length > 20 && s.headline.length < 260, `${f.id} x ${d.id} headline length ${s.headline.length}`);
    assert.equal(Boolean(s.blocking), r.verdict !== "ok", `${f.id} x ${d.id}`);
    assert.ok(s.sources.length > 0);
    for (const src of s.sources) assert.ok(src && src.id, `${f.id} x ${d.id} unresolved source`);
  }
});

test("house style: no em dashes anywhere in engine text", () => {
  const blob = JSON.stringify({ SOURCES, REQUIREMENTS, PRICES, FARMERS, DEPOTS })
    + pairs.map(([f, d]) => evaluate(f, d).reason.text + clerkSummary(f, d).headline).join("");
  assert.equal(blob.includes("—"), false, "em dash found in engine copy");
});

test("ussdText fits one feature-phone screen for every pair and agrees with evaluate", () => {
  for (const [f, d] of pairs) {
    const t = ussdText(f, d);
    const r = evaluate(f, d);
    assert.ok(t.length <= USSD_BUDGET, `${f.id} x ${d.id} is ${t.length} chars`);
    assert.ok(t.startsWith(VERDICT_LABEL[r.verdict].toUpperCase() + ":"), `${f.id} x ${d.id} wrong verdict word`);
    assert.ok(t.includes("Sample data"), `${f.id} x ${d.id} missing sample-data label`);
    assert.equal(t.includes("—"), false, `${f.id} x ${d.id} em dash`);
    assert.equal(/<[a-z]/i.test(t), false, `${f.id} x ${d.id} markup in USSD text`);
  }
});

test("UI strings: every English key has a Swahili twin, every engine key is translated, no em dashes", async () => {
  const S = await import("../strings.js");
  for (const k of Object.keys(S.STRINGS.en)) assert.ok(k in S.STRINGS.sw, `missing sw string: ${k}`);
  for (const k of Object.keys(S.STRINGS.sw)) assert.ok(k in S.STRINGS.en, `orphan sw string: ${k}`);
  for (const r of REQUIREMENTS) { assert.ok(S.REQ.en[r.key], r.key); assert.ok(S.REQ.sw[r.key], r.key); }
  assert.ok(S.REQ.en.depot && S.REQ.sw.depot);
  for (const v of Object.keys(VERDICT_LABEL)) { assert.ok(S.VERDICT.en[v]); assert.ok(S.VERDICT.sw[v]); }
  const blob = JSON.stringify(S.STRINGS) + JSON.stringify(S.REQ) + JSON.stringify(S.VERDICT);
  assert.equal(blob.includes("—"), false, "em dash in UI strings");
  for (const l of ["en", "sw"]) {
    S.setLang(l);
    for (const [f, d] of pairs) {
      const r = evaluate(f, d);
      const lines = S.tScript(r, f, d, blockingItem(r, d));
      assert.ok(lines.length >= 2 && lines.every((x) => x.sw && x.en), `${l} ${f.id} x ${d.id} script`);
      assert.ok(S.tReason(r, f, d).length > 10, `${l} ${f.id} x ${d.id} reason`);
    }
  }
});

test("subsidy gate: an unreleased season is Not Served for every pair, ranked above everything", () => {
  const closed = { subsidyReleased: false };
  for (const [f, d] of pairs) {
    const r = evaluate(f, d, closed);
    assert.equal(r.verdict, "danger", `${f.id} x ${d.id}`);
    assert.equal(r.subsidyOK, false);
    assert.equal(blockingItem(r, d).key, "subsidy", `${f.id} x ${d.id} blocking should be the gate`);
    assert.equal(r.checks.length, REQUIREMENTS.length, "ledger still computed behind the gate");
    const s = clerkSummary(f, d, closed);
    assert.equal(s.verdict, "danger");
    assert.equal(s.blocking.key, "subsidy");
    assert.ok(s.headline.includes("not been released"));
  }
});

test("gate order: subsidy, then depot, then registration, then the ledger", () => {
  const unauth = DEPOTS.find((d) => !d.authorized);
  const unreg = FARMERS.find((f) => !f.registered);
  const auth = DEPOTS.find((d) => d.authorized);
  const reg = FARMERS.find((f) => f.registered && f.acChief === false);
  assert.equal(blockingItem(evaluate(unreg, unauth, { subsidyReleased: false }), unauth).key, "subsidy");
  assert.equal(blockingItem(evaluate(unreg, unauth, { subsidyReleased: true }), unauth).key, "depot");
  assert.equal(blockingItem(evaluate(unreg, auth, { subsidyReleased: true }), auth).key, "registered");
  assert.equal(blockingItem(evaluate(reg, auth, { subsidyReleased: true }), auth).key, "acChief");
});

test("a released season, or no season, leaves every verdict exactly as the two-argument call", () => {
  for (const [f, d] of pairs) {
    const base = evaluate(f, d);
    const open = evaluate(f, d, { subsidyReleased: true });
    const none = evaluate(f, d, undefined);
    assert.equal(base.subsidyOK, true);
    assert.deepEqual(open, base, `${f.id} x ${d.id} released season changed the result`);
    assert.deepEqual(none, base, `${f.id} x ${d.id} undefined season changed the result`);
  }
  assert.equal(SUBSIDY_GATE.src.length, 0, "the gate is an officer fact, not a cited requirement");
});

test("snapshot: every pair yields the full shape, deterministic, every cost line sourced", () => {
  const NOW = "2026-09-02T14:05:00.000Z";
  const open = { id: "s1", subsidyReleased: true };
  for (const [f, d] of pairs) {
    const r = evaluate(f, d, open);
    const a = buildSnapshot(r, f, d, open, NOW);
    const b = buildSnapshot(r, f, d, open, NOW);
    assert.deepEqual(a, b, `${f.id} x ${d.id} not deterministic`);
    for (const k of ["farmerId", "depotId", "verdict", "reason", "blocking", "gaps", "approvals", "cost", "sources", "season", "computedAt"]) assert.ok(k in a, `${f.id} x ${d.id} missing ${k}`);
    assert.equal(a.verdict, r.verdict);
    assert.equal(a.approvals.length, SIGNATURE_KEYS.length);
    for (const ap of a.approvals) { assert.ok(ap.signer); assert.equal(typeof ap.signed, "boolean"); assert.ok(ap.src.length); }
    const c = a.cost;
    assert.equal(c.pricePerBag, DEFAULT_PRICE_PER_BAG);
    assert.equal(c.priceSource, "engine");
    assert.ok(c.priceSrc.length, "engine price must be cited");
    assert.equal(c.bagsRemaining, Math.max(0, f.bagsAllocated - f.bagsUsed));
    assert.equal(c.total, c.pricePerBag * c.bagsRemaining);
    assert.ok(c.subsidyNote.src.length && c.noOtherFee.src.length);
    const ids = new Set(SOURCES.map((s) => s.id));
    for (const id of a.sources) assert.ok(ids.has(id), `dangling source ${id}`);
    assert.equal(JSON.stringify(a).includes("—"), false);
  }
});

test("snapshot: officer season price overrides the engine price and is labelled, not cited", () => {
  const f = FARMERS[0], d = DEPOTS[0];
  const season = { id: "s1", subsidyReleased: true, pricePerBag: 2700 };
  const snap = buildSnapshot(evaluate(f, d, season), f, d, season, "2026-09-02T00:00:00.000Z");
  assert.equal(snap.cost.pricePerBag, 2700);
  assert.equal(snap.cost.priceSource, "officer");
  assert.equal(snap.cost.priceSrc.length, 0);
  assert.ok(snap.cost.priceNote.includes("sub-county"));
  assert.equal(snap.cost.total, 2700 * (f.bagsAllocated - f.bagsUsed));
});

test("snapshot: unreleased subsidy shows as the blocking item and season flag", () => {
  const f = FARMERS[0], d = DEPOTS[0];
  const season = { id: "s1", subsidyReleased: false };
  const snap = buildSnapshot(evaluate(f, d, season), f, d, season, "2026-09-02T00:00:00.000Z");
  assert.equal(snap.verdict, "danger");
  assert.equal(snap.blocking.key, "subsidy");
  assert.equal(snap.season.subsidyReleased, false);
});

test("release text: under the SMS budget for every farmer at their own county depot, both languages", async () => {
  const { REQ } = await import("../strings.js");
  const LINK = "https://kilimo.vercel.app/#status/k7Qx9Ab2Cd";
  assert.ok(LINK.length >= 40);
  const open = { id: "s1", subsidyReleased: true };
  for (const [f, d] of pairs) {
    const snap = buildSnapshot(evaluate(f, d, open), f, d, open, "2026-09-02T00:00:00.000Z");
    for (const lang of ["en", "sw"]) {
      const t = releaseText(snap, f, d, lang, REQ[lang]).replace("{link}", LINK);
      assert.ok(t.length <= RELEASE_BUDGET, `${lang} ${f.id} x ${d.id} is ${t.length} chars: ${t}`);
      assert.equal(t.includes("—"), false);
      assert.equal(t.includes("{"), false, "unfilled placeholder");
      assert.equal(t.includes(".."), false, "double period");
      assert.ok(t.includes(LINK));
      if (snap.verdict === "ok") { assert.ok(t.includes(d.name)); assert.ok(t.includes("2,500")); }
      if (snap.verdict === "warn") for (const g of snap.gaps.slice(0, 2)) assert.ok(t.includes(REQ[lang][g.key]), `${lang} ${f.id} x ${d.id} missing pending item ${g.key}`);
      if (snap.verdict === "danger") assert.ok(/Do not travel\.|Usisafiri\./.test(t), `${lang} ${f.id} x ${d.id} red must say do not travel`);
    }
  }
});

test("release text: unreleased subsidy is red with the subsidy reason", () => {
  const f = FARMERS[0], d = DEPOTS[0];
  const season = { id: "s1", subsidyReleased: false };
  const snap = buildSnapshot(evaluate(f, d, season), f, d, season, "2026-09-02T00:00:00.000Z");
  assert.ok(releaseText(snap, f, d, "en").includes("not yet released by government"));
  assert.ok(releaseText(snap, f, d, "sw").includes("Ruzuku bado haijatolewa"));
});
