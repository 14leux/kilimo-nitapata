# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 2 Sep 2026, after merging uxvic's fork into master

## In progress

Nothing mid-flight. The uxvic/master merge (commit a415e61) is committed and pushed. See PROGRESS.md and FOUNDATION.md §9 for what it reconciles.

## Next up

1. Set `UPSTASH_REDIS_REST_URL`/`_TOKEN`, `OFFICER_PASSCODE`, and the `TWILIO_*` vars on the live Vercel project (`.env.example` has the full list). `api/board.js`/`api/season.js`/`api/approval.js` fail live without them.
2. Africa's Talking sandbox signup and callback URL pointed at the Vercel deploy, then a simulator run, the actual test condition for Milestone A (issue #1), not yet done even though the code and `npm test` are green.
3. Swahili strings need a native speaker's pass before demo, they were machine-drafted (see `strings.js` history; the review-status flag from the pre-merge UI refresh didn't survive the merge as a named constant, worth re-adding if it matters to whoever owns that review).
4. Source 5 (The Star, 25 Aug 2026): still just a real headline and URL away from clearing the "link pending" notes.

## Waiting on Mailu

- The four items above, whichever aren't already being picked up by the team (uxvic, KodeckJames, Kajim360 all have collaborator access).
- A citable source for the depot/ward scale figures in MILESTONES.md (103 NCPB depots, 281 last-mile points, 1,382 wards), if one exists.

## Done today

- V1 core (steps 0 to 6), Milestone B (location), Vercel connected and verified live, session closed cleanly. See earlier entries in this file's git history, or PROGRESS.md, for the detail.
- Reviewed and merged uxvic's fork into master: found the merge sitting uncommitted from an earlier session, verified it (48/48 tests, no conflict markers, engine.js properly reconciled rather than one side clobbering the other), completed it (added the untracked `favicon.png` and staged an in-progress polish pass so the merge wouldn't ship broken icon references), committed, pushed.
- Found and reported the real gap: uxvic's fork's "Merge PR #28" through "#34" were all against the fork itself, zero PRs were ever opened against this repo. Commented on issue #1 with accurate status rather than closing it, its real test condition (a live AT simulator run) still hasn't happened.
- FOUNDATION.md updated: v2 "officer release system" backend (Vercel functions + Upstash Redis, signed off by Victor, see `specs/00-one-pager.md`) now has its own stack row rather than silently contradicting the old "no database" line; two new Decision Log entries; new Open Item for the missing production env vars.

---

## History: v2 officer release system (built on uxvic's fork, merged into master 2 Sep)

Specs in `specs/00` to `08`, signed off by Victor. Built as a GitHub epic with milestones and tickets, entirely within the fork (no PRs against this repo, see above):
- A engine (subsidy gate, buildSnapshot, releaseText), B store (`lib/store.js`, `lib/register.js`), C API (`api/board.js`, `api/season.js`, `api/approval.js`), all DONE, all merged, all tested.
- D officer UI, E farmer UI, F Codex polish, G deploy and demo: not confirmed done, the merge brought in the engine/store/API layer and a UI refresh, but check PROGRESS.md and the live site before assuming the full ticket list shipped.

## History: pre-merge UI refresh (Victor, 2 Sep, also from the fork)

- `index.html` rewritten as a hash-routed app (home, answer, counter, detail, about), `localStorage` memory of last pair and five recent checks, persona actions (counter, read aloud, share, another farmer same depot).
- PWA: `manifest.json`, `sw.js`, icons, install nudge, offline pill.
- `strings.js`: full EN/SW toggle, Swahili machine-drafted, needs review (see Next up).
- Restyle: dropped the cream/paper look for Manrope + JetBrains Mono, green-forward palette, searchable bottom-sheet pickers, network-first service worker for HTML.
