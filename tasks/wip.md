# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 2 Sep 2026, after step 2

## In progress

Nothing mid-flight. Step 2 is complete and committed.

## Next up (from FOUNDATION.md §6)

1. Step 3: problem screen. Blocked on source 5 URL and figures from Mailu.
2. Step 4 and 5 (Q&A scripts, pitch narrative) can start in parallel any time; they're writing, not code.

## Waiting on Mailu

- Source 5 (The Star, 25 Aug 2026): headline, URL, problem-scale figures. `engine.js` has the entry with an empty URL; the page shows "[5] link pending".
- Vercel: connect the repo, confirm production URL.
- Owners for Milestones B and A; GitHub issues; collaborator invites (after milestone 1 acceptance).

## Done today

- Repo seeded and pushed: `github.com/14leux/kilimo-nitapata` (private).
- Plan review; five decisions logged in FOUNDATION.md §9.
- Step 0: `engine.js` extracted, `index.html` rewritten against it, tests green, em dashes gone, stale "eight/four" copy fixed, source 5 entry added, Vercel-ready layout.
- Step 1: clerk view. `blockingItem()` and `clerkSummary()` added to engine, verified in-browser for all three verdicts at desktop and mobile width.
- PROGRESS.md and TESTING.md added for team review; every documented manual scenario for steps 0 and 1 verified live before writing it up.
- Step 2: mobile polish. Citation tap targets enlarged (20x14px to ~28x39px, no visual change), select font bumped to 16px to stop iOS auto-zoom. Confirmed no horizontal overflow at 320px or 375px, including the clerk view. 9/9 tests still green (CSS-only change).
