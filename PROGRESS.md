# Build Progress

Living log of what has actually shipped, against the sequence in [FOUNDATION.md §6](FOUNDATION.md#6-build-sequence-hours-left-time-boxed). Updated after every build step, before moving to the next one. For the reasoning behind each decision, see the Decision Log in FOUNDATION.md §9, not here, this file states what is true now, not why.

**How to read this if you're picking up a milestone:** find the step marked DONE closest to what you're touching, run its steps in [TESTING.md](TESTING.md), confirm they pass on your machine, then start. If a DONE step fails for you, stop and say so before building on top of it.

---

## Status at a glance

| Step | What | Status | Commit |
|---|---|---|---|
| 0 | Extract rule engine (`engine.js`), fold prototype into repo, Vercel-ready layout | DONE | `46efd97` |
| 1 | Counter-presentable clerk view | DONE | (this push) |
| 2 | Mobile polish on the base scroll page | Not started | |
| 3 | Problem screen (persona copy, scale figures) | Blocked on source 5 URL from Mailu | |
| 4 | Scripted Q&A answers | Not started | |
| 5 | Pitch narrative (fair-price lead) | Not started | |
| 6 | Static fallback capture | Not started | |
| 7 | Milestone B (location), then Milestone A (USSD) | Open for team, unowned | |

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
