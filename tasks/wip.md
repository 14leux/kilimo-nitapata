# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 2 Sep 2026, after Milestone B and Milestone A issue

## In progress

Nothing mid-flight. Milestone B is complete and committed; Milestone A is tracked as [issue #1](https://github.com/14leux/kilimo-nitapata/issues/1), unowned.

## Next up

Nothing on the core build or Milestone B is blocking. Only remaining build item is Milestone A (USSD), issue #1, whenever someone picks it up.

## Waiting on Mailu

- Source 5 (The Star, 25 Aug 2026): real headline and URL. Not blocking.
- A citable source for the depot/ward scale figures in MILESTONES.md, if one exists.
- Vercel: connect the repo, confirm production URL.
- Owner for Milestone A (issue #1). Team already has collaborator access: uxvic, KodeckJames, Kajim360.

## Done today

- Repo seeded and pushed: `github.com/14leux/kilimo-nitapata` (private).
- Steps 0 through 6 (rule engine, clerk view, mobile polish, problem screen, Q&A, pitch, static fallback). All documented in PROGRESS.md / TESTING.md, every claim verified live before writing it up.
- Design skills installed globally (`emilkowalski/skills`, 12 skills). Africa's Talking MCP investigated and rejected (wrong platform, SMS-only, doesn't serve the USSD need); noted in Milestone A's issue instead.
- Milestone B (location/GPS depot suggestion): `engine.js` gained `coords` on each depot (hand-built town-centre approximations, labelled as such) and `nearestDepots(lat, lng)` (authorised-only, sorted, 3 new tests, 12/12 total). `index.html` gained a "Use my location" control with a full manual fallback on denial. Verified live: correct nearest-depot selection, unauthorised depot correctly excluded even when closest (tested from Kisumu), denial path leaves all 6 depots selectable, no overflow at 320px.
- Fallback screenshot recaptured to include the new location control.
- GitHub issue #1 opened for Milestone A (USSD), full spec carried over from MILESTONES.md plus the MCP rejection noted so nobody re-investigates it.
