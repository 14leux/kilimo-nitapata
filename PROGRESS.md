# Build Progress

Living log of what has actually shipped, against the sequence in [FOUNDATION.md §6](FOUNDATION.md#6-build-sequence-hours-left-time-boxed). Updated after every build step, before moving to the next one. For the reasoning behind each decision, see the Decision Log in FOUNDATION.md §9, not here, this file states what is true now, not why.

**How to read this if you're picking up a milestone:** find the step marked DONE closest to what you're touching, run its steps in [TESTING.md](TESTING.md), confirm they pass on your machine, then start. If a DONE step fails for you, stop and say so before building on top of it.

---

## Status at a glance

| Step | What | Status | Commit |
|---|---|---|---|
| 0 | Extract rule engine (`engine.js`), fold prototype into repo, Vercel-ready layout | DONE | `46efd97` |
| 1 | Counter-presentable clerk view | DONE | (this push) |
| 2 | Mobile polish on the base scroll page | DONE | (this push) |
| 3 | Problem screen (persona copy, Mt Elgon anecdote) | DONE | (this push) |
| 4 | Scripted Q&A answers | DONE | (this push) |
| 5 | Pitch narrative (fair-price lead) | DONE | (this push) |
| 6 | Static fallback capture | DONE | (this push) |
| 7a | Milestone B (location) | DONE | (this push) |
| 7b | Milestone A (USSD) | Code done (via merge below), sandbox simulator run still pending, see [issue #1](https://github.com/14leux/kilimo-nitapata/issues/1) | `a415e61` |
| 8 | v2 officer release system merged from uxvic's fork (backend, board/season/approval, USSD, UI refresh) | DONE, env vars pending on Vercel | `a415e61` |

---

## Step 0, Rule engine extraction, repo seeded

**Date:** 2 Sep 2026
**What changed:**
- `engine.js` created: every farmer, depot, requirement, price, and source record, plus the pure `evaluate(farmer, depot)` function. This is now the only place product knowledge lives.
- `index.html` rewritten as a full HTML document that imports `engine.js` as an ES module. Previously this only existed as a Claude Artifact; it is now retired in favour of this repo (see Decision Log).
- `test/engine.test.js` added: 7 tests covering all 36 farmer x depot pairs, verdict invariants, citation integrity, and house style (no em dashes).
- Stale copy fixed: "eight requirements" corrected to six, "four sources" corrected to five, source 5 (The Star, 25 Aug 2026) entered with a placeholder URL pending the actual link.
- Hosting decision changed from Claude Artifact to Vercel, deployed from this repo, so the team can actually deploy changes.

**Why this came before anything else:** two copies of the verdict logic (one for web, one for a future USSD/SMS channel) drifting apart was named in MILESTONES.md as the single most likely way this build embarrasses itself. Extracting first means every later channel imports the same engine and inherits the same test coverage.

**Test:** see [TESTING.md → Step 0](TESTING.md#step-0-rule-engine).

---

## Step 1, Counter-presentable clerk view

**Date:** 2 Sep 2026
**What changed:**
- `engine.js`: added `blockingItem(result, depot)` (the single most important thing standing between the farmer and a bag, ranked depot-authorization first, then the first failing requirement) and `clerkSummary(farmer, depot)` (everything a clerk view needs, as plain data: verdict, one-line summary, the blocking item, remaining-gap count, price, resolved sources). Two new tests added (9/9 total).
- `index.html`: a "Show this at the counter" button toggles from the checker to a stripped, large-type panel meant to survive a zoom or a screenshot, verdict word, farmer to depot, one-line summary, the blocking item in a colored callout, price, citations, a sample-data disclaimer, and a back button.

**Why this is core, not optional:** the counter screen is the product's actual stated design goal in FOUNDATION.md §2.2, the citation only matters at the moment a farmer holds it up to a clerk.

**Test:** see [TESTING.md → Step 1](TESTING.md#step-1-clerk-view).

---

## Step 2, Mobile polish on the base scroll page

**Date:** 2 Sep 2026
**What changed:** the page was already responsive (built mobile-first from the start), so this was a targeted audit against real constraints, not a rewrite, per the plan-review decision to keep the scroll page rather than build screen-by-screen routing.
- `index.html`: citation superscript links (`[2]`, `[3]`, etc.) had a 20x14px tap target, too small for a thumb. Enlarged the hit area to roughly 28x39px using padding plus a matching negative margin, so the visible mark stays the same size and position while the clickable area grows.
- `index.html`: the farmer/depot `<select>` elements were 14.5px font, which triggers iOS Safari's auto-zoom on focus below 16px. Bumped to 16px.
- Checked and found already correct, no change needed: no horizontal overflow at 375px or 320px viewport width (including the clerk view), primary buttons already 47 to 48px tall, the `<details>` "how this works" panel opens correctly, the scope banner and requirement-tag grids already collapse to a single column under 560px.

**Why 320px specifically:** this product's stated audience skews toward older or shared devices, not flagship phones, so the narrower of the two common breakpoints (320px, 375px) was checked deliberately rather than assumed to be fine because 375px passed.

**Test:** see [TESTING.md, Step 2](TESTING.md#step-2-mobile-polish).

---

## Step 3, Problem screen

**Date:** 2 Sep 2026
**What changed:**
- `index.html`: a new section opens the page, before the scope banner and the checker. Original headline ("He can't tell a fair price from an inflated one," leading with the fair-price exposure per the earlier plan-review decision), the Mt Elgon queue pull-quote cited to source 5, the four persona cards and the tying line from `presentation-copy.md` (lightly trimmed for card format, not rewritten), and a "Skip straight to the check" link. Verified live: no console errors, skip link scrolls to the checker, no horizontal overflow at 320px, persona grid collapses to one column under 560px.
- `index.html`: the pull-quote shows "link pending" next to its citation whenever `engine.js`'s source 5 entry has an empty URL, same honesty rule as the sources ledger, computed from the data, not hardcoded.

**What was deliberately left out, and why:** the headline is original copy for this screen, not a quotation attributed to *The Star*, inventing a headline and presenting it as a real news source's own words would be a fabricated citation, the one failure mode this product's entire design argues against. The scale figures in MILESTONES.md (103 NCPB depots, 281 last-mile points, 1,382 wards) are also not on this screen, none of the five sources' grounds cover those specific counts, so they were omitted rather than attached to a source that doesn't actually support them. See Decision Log 9 in FOUNDATION.md.

**Still open:** source 5's real headline and URL, whenever Mailu has them; a citable source for the depot/ward figures, if one turns up, would strengthen this screen but isn't required for it.

**Test:** see [TESTING.md, Step 3](TESTING.md#step-3-problem-screen).

---

## Step 4, Scripted Q&A answers

**Date:** 2 Sep 2026
**What changed:** [QA.md](QA.md) added, three scripted answers to the questions FOUNDATION.md §6 names as the ones most likely to derail an improvised pitch: whether the data is official (it isn't, and the app already says so), why there's no agronomic advice (a considered exclusion, not an omission), and why build USSD when KIAMIS already has `*6163#` (different question answered). Each answer states the honest limit rather than smoothing over it, and each closes with a one-line note on why scripting it matters.

**Test:** see [TESTING.md, Step 4](TESTING.md#step-4-qa).

---

## Step 5, Pitch narrative

**Date:** 2 Sep 2026
**What changed:** [PITCH.md](PITCH.md) added, the talk track for the live demo: opens with the fair-price exposure (matching the app's own problem-screen headline word for word, not a separate framing), grounds it with the Mt Elgon anecdote, walks the live demo in the order that shows the clerk view as the centerpiece rather than a bonus screen, states the three things the demo proves in FOUNDATION.md §2.4's own order, and closes with an honest line about the stretch milestones rather than implying either shipped.

**Test:** see [TESTING.md, Step 5](TESTING.md#step-5-pitch).

---

## Step 6, Static fallback capture

**Date:** 2 Sep 2026
**What changed:**
- `index.html`: added a small capture-only hook, when the URL carries `#clerk-demo` the page auto-selects a known Conditional pair and opens the clerk view on load. Not a feature, not linked from anywhere in the UI, exists purely so the fallback can be recaptured headlessly instead of by hand.
- `fallback/01-checker-served.png` and `fallback/02-clerk-view-conditional.png`, captured via headless Chrome against the local dev server. The first is the full default-load page (problem screen through sources), the second is the clerk view's Conditional case.
- `fallback/README.md`, what each image shows and the exact command to recapture them.

**Test:** see [TESTING.md, Step 6](TESTING.md#step-6-fallback).

---

## Step 7a, Milestone B: location / GPS depot suggestion

**Date:** 2 Sep 2026
**What changed:**
- `engine.js`: each depot record gained a `coords` field (`{ lat, lng, approx: true }`), hand-built town-centre approximations per MILESTONES.md, since no public list of real depot coordinates exists. Added `haversineKm(lat1, lng1, lat2, lng2)` and `nearestDepots(lat, lng)`, the latter returns **authorised depots only**, sorted nearest first, each with a `distanceKm`. Three new tests (12/12 total): distance is zero for identical points and symmetric, the nearest depot from a known position is correct and results are sorted, and, the important one, an unauthorised depot never appears in the results even when it is geographically the closest (tested from Kisumu, where the unauthorised agrovet and the authorised KNTC warehouse share a town).
- `index.html`: a "Use my location" button next to the depot picker. On success, the depot dropdown is rebuilt with authorised depots first (nearest first, each showing its approximate distance) followed by the rest, the nearest is auto-selected, and a status line names it. On denial, timeout, or an unsupported browser, a status message explains why and the picker is left exactly as it was, fully usable, nothing about the manual flow changes.

**Why the manual fallback matters more than the happy path:** MILESTONES.md flagged that a judge's own device may deny or mis-report location in the room, so the pitch's critical path should never run through a live permission prompt. Verified by mocking `navigator.geolocation` to simulate both a permission-denied error and a successful position; the denied case leaves all 6 depots selectable and re-enables the button rather than leaving it stuck.

**Test:** see [TESTING.md, Step 7a](TESTING.md#step-7a-milestone-b).

---

## Step 8, Merged uxvic's fork: v2 officer release system

**Date:** 2 Sep 2026
**What changed:** reviewed and completed a `git merge uxvic/master` that had been run in an earlier session, conflicts resolved, but never committed. Verification before finishing it: 48/48 tests passed on the merged tree, no leftover conflict markers, `engine.js` properly reconciled (both this repo's and the fork's independent Milestone B implementations landed on nearly identical hand-built coordinates, kept as one function, nothing dropped). Added the untracked `favicon.png` and staged an in-progress polish pass (softer "readiness demo, cannot confirm live stock" language, a real logo, reduced-motion support) that the merge's own edits depended on, so the commit wouldn't ship broken icon references. Commit `a415e61`, pushed.

**What this brings in:** Milestone A (USSD: `ussd.js`, `api/ussd.js`, `test/ussd.test.js`), a v2 "officer release system" (a real Vercel-functions-plus-Redis backend, `lib/db.js`, `lib/store.js`, `api/board.js`, `api/season.js`, `api/approval.js`, signed off by Victor 2 Sep, see `specs/00-one-pager.md`), and a UI refresh (hash-routed app, PWA, EN/SW toggle). See `tasks/wip.md` for the fuller history.

**What was found and flagged, not silently fixed:** zero PRs have ever been opened against this repo, `gh pr list --state all` returns nothing, all of the fork's own "Merge PR #28" through "#34" happened only inside the fork. Commented on issue #1 with accurate status rather than closing it, its real test condition (a live Africa's Talking simulator run) hasn't happened. FOUNDATION.md's stack section said "no database service"; corrected with a new row and Decision Log entries rather than left contradicting the shipped code. The live Vercel deployment does not yet have `UPSTASH_REDIS_REST_*` or `TWILIO_*` set, new Open Item in FOUNDATION.md.

**Test:** `npm test`, 48/48. No dedicated TESTING.md section, this was a review-and-merge, not a new feature; the merged-in code carries its own tests.

---

## Step 9, In-app USSD simulator

**Date:** 2 Sep 2026
**What changed:** a new `#ussd` screen, reached from a "No data bundle?" card on the answer screen. Feature-phone-styled terminal (monospace, LCD-green screen) that drives the real live `/api/ussd` endpoint over `fetch`, not a client-side reimplementation of `ussd.js`, so what it shows is exactly what a real USSD session would return. Session id is random per dial, the accumulated `text` field matches Africa's Talking's own protocol (digits joined by `*`). Ends the session and disables input on an `END` reply; "Dial again" starts fresh.

**Why in-app rather than the real Africa's Talking sandbox:** getting a real shortcode requires creating an AT account, which is outside what an agent does on someone's behalf. An in-app simulator sidesteps that entirely, needs no signup, no phone, no account, and it's arguably a better demo asset: it can run standalone, offline of any telco, and still proves the mechanism against the actual deployed function. The real sandbox integration remains open in issue #1 for whoever wants to pursue the genuine end-to-end path.

**Bug caught before shipping:** the simulator's session-text accumulator was first named `ussdText`, colliding with the `ussdText` function already imported from `engine.js` in the same module, `let` redeclaring an import binding is a hard SyntaxError that would have broken the entire app, not just the simulator. Caught before commit, renamed to `ussdDigits`.

**Verified live** (via `vercel dev`, the only way to exercise `/api/ussd` locally): full farmer to depot to verdict flow returns the identical Conditional verdict and blocking item the web checker shows for the same pair; "Dial again" resets cleanly; Swahili toggle translates the screen chrome (the USSD transcript itself is bilingual by design, per `ussd.js`); no new horizontal overflow at 375px (a pre-existing, unrelated 7px topbar overflow exists on every screen including home, not introduced here, not fixed here, out of scope for this change). `npm test` unaffected, 48/48, since no `engine.js` or `ussd.js` file changed.

**Test:** no dedicated automated test, this is a UI wrapper around already-tested logic (`ussd.js`'s own tests cover the protocol). Manual: open `#ussd`, dial through to a verdict, confirm it matches the same pair's answer screen.

---

## Step 10, Verdict card wording: Utapata / Hutapata

**Date:** 2 Sep 2026
**What changed:** `strings.js` `VERDICT`, the words on the big verdict card (answer screen, `v-word`/`v-word-alt`) and the counter card (`c-word`). Per Mailu: `ok` is now Utapata (sw) / Available (en), `danger` is now Hutapata (sw) / Unavailable (en), replacing the more clinical "No sample-record blocker" / "Cannot confirm readiness" pair. `warn` (Hatua inahitajika / Action required) unchanged, wasn't part of the request.

**Real bug caught in the process, not just a content edit:** `sw.js` precaches `strings.js` cache-first, keyed to a `VERSION` string the file's own comment says to bump on every deploy. Changed the content without bumping `VERSION` first, then verified against a browser tab that had an old service worker installed from earlier this session, saw the old wording, assumed the edit hadn't taken, dug in, found the real cause: a live PWA install (or any returning visitor's browser) would have kept serving the old cards until a second background-refreshed visit, the actual demo audience for this change. Bumped `VERSION` to `kn-v4-2026-09-02`. Confirmed the theory by clearing that tab's cache and service worker, which reproduced the stale read, then confirmed the fix in an untouched tab.

**Test:** verified live (not just by reading source) in a clean browser tab: `ok`, `warn`, and `danger` all render correctly on both the answer card and the counter card, in both languages via the alt-language slot. `npm test` 48/48, no em dashes.

---

## Adding a new entry

Copy the block below to the top of the step-by-step log (not the status table, update that too) when a step finishes. Keep the language plain enough that someone who has not read this session's chat can verify the claim.

```
## Step N, <name>

**Date:**
**What changed:**
- <file>: <what, in one line each>

**Why:** <one line, only if not obvious>

**Test:** see [TESTING.md → Step N](TESTING.md#step-n-name).
```
