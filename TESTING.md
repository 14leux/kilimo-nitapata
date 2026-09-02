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

## Step 2, Mobile polish

**Automated:** none new. `npm test` should still show 9/9 (this step touched only CSS, not `engine.js`).

**Manual, in the browser (use device emulation or a real phone):**

1. At 375px width, load the page. Confirm no horizontal scrollbar and nothing overflows the right edge, check visually and, if you have DevTools, confirm `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
2. At 320px width, repeat step 1 for both the checker page and the clerk view (select a farmer and depot, run a check, click "Show this at the counter"). This is the narrower, more conservative width; if this passes, 375px and up are covered.
3. Tap (or click) a citation mark such as `[2]` next to any requirement row. It should jump to the matching row in the Sources section without needing a precise tap; the clickable area is intentionally larger than the visible bracketed number.
4. Focus a `<select>` dropdown on an actual iOS device (a desktop browser or Android emulator will not reproduce this). The page must not zoom in when the dropdown opens. If it zooms, the select's font size has regressed below 16px.
5. Tap "How this tool decides & where its data comes from" at the bottom of the page. It must expand in place without the page jumping or the layout breaking.
6. Confirm the two main buttons ("Check this depot for this farmer" and the clerk view's "Show this at the counter") are each comfortably tappable, at least 44px tall is the usual accessibility guideline; both should measure at or above that.

**Pass condition:** all 6 checks above pass at both 320px and 375px widths, `npm test` still shows 9/9.

---

## Step 3, Problem screen

**Automated:** `npm test` should still show 9/9 (this step didn't touch `engine.js` beyond nothing, it reads the existing source 5 entry).

**Manual, in the browser:**

1. Load the page. The very first thing below the masthead should be "WHY THIS NEEDS TO EXIST" and the headline "He can't tell a fair price from an inflated one," before the scope banner and before the checker form.
2. Confirm the pull-quote ("One farmer reached his depot by 4am...") is attributed to "The Star, 25 Aug 2026, link pending". The "link pending" text is generated from `engine.js`'s source 5 entry; once that entry gets a real URL, this note should disappear on its own without a manual edit here, confirm that if you're the one adding the URL.
3. Confirm all four persona cards render (farmer, proxy, depot clerk, extension officer) plus the tying line above them.
4. Click "Skip straight to the check". The page should jump to the farmer/depot picker, not to the top or somewhere mid-scroll.
5. At 320px width, confirm the persona cards stack to a single column and nothing overflows horizontally.
6. Confirm no depot-count or ward-count statistics appear anywhere on this screen. Their absence is deliberate (see PROGRESS.md, Step 3), not a bug, don't add them back without a citation.

**Pass condition:** all 6 checks pass, `npm test` still 9/9, zero console errors.

---

## Step 4, Q&A

**Automated:** none, this step is content, not code.

**Manual:**

1. Open [QA.md](QA.md). Confirm all three questions FOUNDATION.md §6 names are present: data provenance, no agronomic advice, and why USSD when `*6163#` exists.
2. Read each answer against the app itself: the sourcing answer should match what the "How this tool decides" panel in `index.html` actually says, don't let the two drift.
3. Have someone who hasn't read this file ask you one of the three questions cold. If you find yourself improvising instead of recalling the scripted answer, that's a rehearsal gap, not a documentation gap, practice it, don't rewrite it.

**Pass condition:** all three questions present, sourcing claims match the live app, answers can be delivered from memory.

---

## Step 5, Pitch

**Automated:** none.

**Manual:**

1. Open [PITCH.md](PITCH.md). Read the opening line out loud. It must be the fair-price line, not a wasted-trip line, check it against the app's own problem-screen headline, they should match.
2. Time a full read-through including the live demo steps. It should land close to 90 seconds to 2 minutes; if it's running long, cut from the middle sections, never the opening or the honest close about the stretch milestones.
3. Confirm the "what it proves" section lists the same three points, in the same order, as FOUNDATION.md §2.4.

**Pass condition:** opening line matches the app, timing is in range, the three-points section matches FOUNDATION.md.

---

## Step 6, Fallback

**Automated:** none, but recapturing exercises the app itself, a failed capture command is a signal something upstream broke.

**Manual:**

1. Open `fallback/01-checker-served.png`. Confirm it shows the problem screen, the checker, a Served verdict, the full requirement ledger, price, and sources, all in one image, not cropped mid-section.
2. Open `fallback/02-clerk-view-conditional.png`. Confirm it shows the clerk card with a Conditional verdict and a visible "Missing:" callout, not a Served card with no callout.
3. Recapture both using the commands in `fallback/README.md`. They should complete without an error and produce non-trivial file sizes (tens of KB, not a few hundred bytes, which would indicate a blank capture).
4. Load `http://localhost:3000/#clerk-demo` directly in a normal browser tab. Confirm the clerk view opens automatically with no click needed, this is what makes the capture possible; if it stops working, the fallback can no longer be recaptured without a manual click, fix the hook in `index.html` before relying on it again.

**Pass condition:** both images show the right content, both recapture cleanly, the `#clerk-demo` hook still auto-opens the clerk view.

---

## Step 7a, Milestone B

**Automated:** `npm test`, now 12/12. Three new tests cover `haversineKm` and `nearestDepots`, including the one that matters most: an unauthorised depot never appears in the results even when it is the closest.

**Manual, in the browser:**

1. Open DevTools console and run, before clicking anything:
   ```js
   navigator.geolocation.getCurrentPosition = (ok) => ok({ coords: { latitude: -0.0917, longitude: 34.7680 } });
   ```
   This simulates a position in Kisumu, home to both an authorised depot (KNTC Kisumu Warehouse) and an unauthorised one (Mama Otieno's Agrovet), the sharpest test of the ranking rule.
2. Click "Use my location to suggest the nearest depot". The status line should name KNTC Kisumu Warehouse as nearest, at approximately 0.0 km, and the depot dropdown should already have it selected.
3. Open the depot dropdown. KNTC Kisumu Warehouse should be first, Mama Otieno's Agrovet should be last with no distance shown, confirm the unauthorised depot was excluded from the ranking, not just sorted to the bottom by coincidence.
4. Click "Check this depot for this farmer". The verdict should compute normally against whichever depot is selected, the reorder doesn't break the checker.
5. Reload the page (undoing the mock), then run this instead:
   ```js
   navigator.geolocation.getCurrentPosition = (ok, err) => err({ code: 1 });
   ```
   Click "Use my location" again. The status line should explain permission was denied, in an visibly different (warning) style from the success message, all 6 depots should still be present and selectable, and the button should not be stuck disabled.
6. At 320px width, confirm the location button and status text don't overflow horizontally and remain tappable.

**Pass condition:** all 6 checks pass, `npm test` shows 12/12, zero console errors in either the success or denied path.

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
