# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 2 Sep 2026, after step 6

## In progress

Nothing mid-flight. V1's core build sequence (steps 0 through 6) is complete and committed.

## Next up

Nothing on the core build is blocking. Remaining work is:
1. Milestone B (location), sequenced first, unowned.
2. Milestone A (USSD), sequenced second, unowned.
3. Whichever of A/B don't ship, the pitch already handles that honestly (see PITCH.md, close section).

## Waiting on Mailu

- Source 5 (The Star, 25 Aug 2026): real headline and URL. Not blocking, the problem screen and pitch both already work without it; the "link pending" notes clear themselves once the URL is added to `engine.js`.
- A citable source for the depot/ward scale figures in MILESTONES.md (103 NCPB depots, 281 last-mile points, 1,382 wards), if one exists.
- Vercel: connect the repo, confirm production URL.
- Owners for Milestones B and A; GitHub issues (team already has collaborator access: uxvic, KodeckJames, Kajim360, and uxvic has forked the repo).

## Done today

- Repo seeded and pushed: `github.com/14leux/kilimo-nitapata` (private).
- Plan review; decisions logged in FOUNDATION.md §9.
- Step 0: rule engine extracted, prototype folded into repo, Vercel-ready layout.
- Step 1: counter-presentable clerk view.
- PROGRESS.md and TESTING.md added; every documented scenario verified live before writing it up.
- Step 2: mobile polish (citation tap targets, iOS select zoom fix).
- Step 3: problem screen, original headline (not a fabricated quote attributed to source 5), Mt Elgon pull-quote correctly cited.
- Design skills installed globally (`emilkowalski/skills`, 12 skills, repocheck CLEAR). Africa's Talking MCP investigated and NOT installed, wrong platform (Mac-only Claude Desktop instructions), SMS-only, doesn't serve Milestone A's actual USSD need.
- Step 4: QA.md, three scripted answers (sourcing, no agronomic advice, why USSD vs *6163#).
- Step 5: PITCH.md, talk track, fair-price opening matching the app's own headline.
- Step 6: fallback/ screenshots (checker+Served, clerk+Conditional), captured via headless Chrome using a small `#clerk-demo` capture-only hook in index.html.
