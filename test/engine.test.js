import { test } from "node:test";
import assert from "node:assert/strict";
import { FARMERS, DEPOTS, REQUIREMENTS, SOURCES, PRICES, evaluate, VERDICT_LABEL, blockingItem, clerkSummary } from "../engine.js";

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
