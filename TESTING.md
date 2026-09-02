# Testing

Manual and automated checks for everything in [PROGRESS.md](PROGRESS.md) that is marked DONE. Run the relevant section before you build on top of a step, and add a new section here in the same push that marks a step DONE in PROGRESS.md, do not let the two drift apart.

**Before anything else:**

```
npm install     # first time only, pulls in nothing beyond Node's own test runner needs
npm test        # must show 9 passing, 0 failing
npm run dev     # serves the page at http://localhost:3000
```

If `npm test` fails on a machine that isn't yours, don't chase it silently, say so in `tasks/wip.md` and flag it before continuing.

---

## Step 0, Rule engine

**Automated:** `npm test`. Covers all 36 farmer x depot pairs (determinism, well-formed output), the two hard rules (unauthorised depot always blocks, unregistered farmer always blocks), the gap-count-to-verdict relationship, citation integrity (every citation in the app resolves to a real source), and the no-em-dash house style.

**Manual, in the browser (`npm run dev`, then open http://localhost:3000):**

1. Open DevTools console. It must be empty of errors on page load. An import error here means the ES module didn't load, check you're serving over HTTP (`npm run dev`), not opening `index.html` directly from disk (`file://` blocks ES module imports).
2. Select **Wanjiru M. (F-2291)** and **NCPB Kitale Depot**. Click "Check this depot for this farmer." Expect the stamp to read **SERVED**, all six requirement rows show a check mark, and the "Nothing outstanding" line appears above the ledger.
3. Select **Otieno K. (F-3387)** with the same depot. Expect **CONDITIONAL**, and exactly one failing row: "Validated by the local Assistant Chief."
4. Select **Mama Otieno's Agrovet** as the depot (any farmer). Expect **NOT SERVED**, and the reason text names the depot as not authorised, not the farmer.
5. Select **Mwangi P. (F-5502)** with an authorised depot. Expect **NOT SERVED**, reason names the farmer as unregistered.
6. Select **Kiprotich J. (F-4118)** with an authorised depot. He has used all 8 of 8 allocated bags. Expect **CONDITIONAL** with "Bags-per-acre allocation not yet exhausted" showing "(8 of 8 bags used)" as a failing row.
7. Check every price row cites `[3]` and `[2]` respectively, and every citation number is clickable and jumps to a matching row in the Sources section. No `[5]` should appear yet outside the Sources list itself (source 5 isn't cited by any requirement or price).

**Pass condition:** all 7 automated tests green, all 6 manual scenarios above match, zero console errors.

---

## Step 1, Clerk view

**Automated:** included in `npm test` (`blockingItem` and `clerkSummary` tests, 2 of the 9).

**Manual, in the browser:**

1. With **Wanjiru M.** and **NCPB Kitale Depot** selected (Served case), click "Show this at the counter." Expect: a card with eyebrow text, a green "SERVED" headline, farmer to depot line, a one-sentence summary, no callout box (nothing is blocking), the price, and the two citations `[2]` and `[3]`. No "Missing:" box should be visible, check by inspecting the DOM if unsure, the box has `hidden` when nothing blocks.
2. Click "Back to full detail." The checker form must reappear and the clerk card must disappear, don't leave both visible at once.
3. Select **Otieno K.** and the same depot (Conditional case), open the clerk view. Expect an orange "CONDITIONAL" headline and a callout box reading "Missing: Validated by the local Assistant Chief," no "more items outstanding" line (he has exactly one gap).
4. Select any farmer with **Mama Otieno's Agrovet** (Not Served, depot-side), open the clerk view. Expect a red "NOT SERVED" headline and a callout box reading "Missing: Not an authorised redemption point," not naming the depot a second time (the headline already does).
5. At each of the three verdicts above, resize the browser to a phone width (375px) or use device emulation. Confirm: text is legible without zooming, nothing overflows horizontally, the back button is reachable without scrolling past the fold on a typical phone screen.
6. Take a screenshot of the clerk view at mobile width for at least the Conditional case. It should be legible as a standalone image with no other page chrome visible, this is the actual artifact a farmer would hold up at a counter, so judge it as one.

**Pass condition:** all 5 scenarios above match, mobile screenshot is legible standalone, no console errors introduced.

---

## Adding a new section

Same rule as PROGRESS.md: copy the block below, fill it in, and do it in the same push that marks the step DONE.

```
## Step N, <name>

**Automated:** <what npm test now covers, if anything new>

**Manual, in the browser:**

1. ...

**Pass condition:** <what must be true for this step to count as verified>
```
