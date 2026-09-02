import { test } from "node:test";
import assert from "node:assert/strict";
import { FARMERS, DEPOTS, evaluate, VERDICT_LABEL, ussdText } from "../engine.js";
import { ussdMenu, USSD_SCREEN_BUDGET } from "../ussd.js";

test("first dial lists every farmer on one screen", () => {
  const m = ussdMenu("");
  assert.ok(m.startsWith("CON "));
  assert.ok(m.length <= USSD_SCREEN_BUDGET, `farmer menu is ${m.length} chars`);
  for (const f of FARMERS) assert.ok(m.includes(f.id), f.id);
});

test("choosing a farmer lists every depot on one screen", () => {
  FARMERS.forEach((f, i) => {
    const m = ussdMenu(String(i + 1));
    assert.ok(m.startsWith("CON "), `${f.id}`);
    assert.ok(m.length <= USSD_SCREEN_BUDGET, `${f.id} depot menu is ${m.length} chars`);
    assert.equal((m.match(/\n\d\./g) || []).length, DEPOTS.length);
  });
});

test("the final screen is END plus exactly the web app's share text, for every pair", () => {
  FARMERS.forEach((f, i) => DEPOTS.forEach((d, j) => {
    const m = ussdMenu(`${i + 1}*${j + 1}`);
    assert.equal(m, "END " + ussdText(f, d), `${f.id} x ${d.id}`);
    assert.ok(m.includes(VERDICT_LABEL[evaluate(f, d).verdict].toUpperCase()));
  }));
});

test("bad input ends the session politely and never throws", () => {
  for (const t of ["9", "0", "abc", "1*9", "1*0", "7*1"]) {
    const m = ussdMenu(t);
    assert.ok(m.startsWith("END "), `${JSON.stringify(t)} gave ${m.slice(0, 20)}`);
    assert.equal(m.includes("—"), false);
  }
  // A bare "*" is an empty session, same as the first dial.
  assert.equal(ussdMenu("*"), ussdMenu(""));
  assert.equal(ussdMenu(undefined), ussdMenu(""));
});
