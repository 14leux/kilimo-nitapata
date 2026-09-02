# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 2 Sep 2026, after step 1

## In progress

Nothing mid-flight. Step 1 is complete and committed.

## Next up (from FOUNDATION.md §6)

1. Step 2: mobile polish pass on the scroll page (the base page, not the clerk view, which is already mobile-verified).
2. Step 3: problem screen. Blocked on source 5 URL and figures from Mailu.

## Waiting on Mailu

- Source 5 (The Star, 25 Aug 2026): headline, URL, problem-scale figures. `engine.js` has the entry with an empty URL; the page shows "[5] link pending".
- Vercel: connect the repo, confirm production URL.
- Owners for Milestones B and A; GitHub issues; collaborator invites (after milestone 1 acceptance).

## Done today

- Repo seeded and pushed: `github.com/14leux/kilimo-nitapata` (private).
- Plan review; five decisions logged in FOUNDATION.md §9.
- Step 0: `engine.js` extracted, `index.html` rewritten against it, tests green, em dashes gone, stale "eight/four" copy fixed, source 5 entry added, Vercel-ready layout.
- Step 1: clerk view. `blockingItem()` and `clerkSummary()` added to `engine.js` with tests (9/9 passing). "Show this at the counter" button toggles a stripped, large-type panel: verdict, who, one-line summary, the single blocking item (or none), price, sources, sample-data note, back button. Verified in-browser for Served, Conditional (Otieno K., missing Assistant Chief validation), and Not Served (unlisted agrovet) at both desktop and 375px mobile width. No console errors.
