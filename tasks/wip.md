# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 16 Nov 2026, session close

## In progress

Nothing. Session closed cleanly.

## Next up

1. Set `UPSTASH_REDIS_REST_URL`/`_TOKEN`, `OFFICER_PASSCODE`, and the `TWILIO_*` vars on the live Vercel project (`.env.example` has the full list). `api/board.js`/`api/season.js`/`api/approval.js` fail live without them.
2. Africa's Talking sandbox signup and callback URL pointed at the Vercel deploy, then a simulator run, the actual test condition for Milestone A (issue #1). The in-app simulator (`#ussd`) proves the code works, it isn't the same as a real sandbox run.
3. Decide toll-free vs standard USSD shortcode before quoting cost to any partner, the two council sessions on 2 Sep found this decides whether the farmer or the operator pays the session fee. See `council-transcript-20260902T190000.md`.
4. `specs/00-one-pager.md` and any future copy should describe USSD as pull-only (farmer dials in), not something a Release "pushes." Flagged for Victor, not changed here, it's his document.
5. Swahili strings need a native speaker's pass before demo, they were machine-drafted.
6. Source 5 (The Star, 25 Aug 2026): still just a real headline and URL away from clearing the "link pending" notes.

## Waiting on Mailu

- The items above, whichever aren't already being picked up by the team (uxvic, KodeckJames, Kajim360 all have collaborator access).
- A citable source for the depot/ward scale figures in MILESTONES.md, if one exists.

## Done 16 Nov 2026

- Repo made public. Published `presentation-sustainability.html` (served at /presentation-sustainability.html, linked beside the Live link in README). Fixed sw.js so visiting a non-index page no longer overwrites the cached app shell; bumped VERSION to kn-v5.

- Added the Claude Community winner badge (`assets/claude-community-winner.png`) to the README top, a winner line under the intro, and updated the GitHub repo description (images cannot go in a description, text only).

## Done 2 Sep 2026

- V1 core (steps 0 to 6), Milestone B (location), Vercel connected and verified live.
- Reviewed and merged uxvic's fork into master (`a415e61`): the v2 officer-release system, USSD (Milestone A code), a UI refresh. Found the merge sitting uncommitted from an earlier session, verified it (48/48 tests, engine.js properly reconciled), completed it, pushed. Commented on issue #1 with accurate status rather than closing it.
- FOUNDATION.md corrected: v2's real backend now has its own stack row instead of contradicting the old "no database" line; Decision Log entries; new Open Item for missing production env vars.
- Investigated an Africa's Talking MCP server, rejected it (wrong platform, SMS-only). Installed `emilkowalski/skills` globally instead.
- Built an in-app USSD simulator (`#ussd`), drives the real live `/api/ussd` endpoint, no AT account needed. Caught and fixed a naming collision with the imported `ussdText()` before it shipped.
- Verdict cards reworded to Utapata/Hutapata, Available/Unavailable. Caught and fixed a real bug in the process: `sw.js`'s cache `VERSION` wasn't bumped, which would have left returning visitors and installed PWAs seeing the old wording indefinitely.
- Two council sessions on sustainability, both saved as transcripts. First: sharpened the value proposition, proposed the officer-release system as the actual sustainability story. Second, triggered by the user flagging a specific slide claim: corrected "under a dollar a farmer" into two honest numbers (business pays for SMS/WhatsApp, the farmer pays his own USSD session unless a toll-free line is bought), produced the persona/payer table.
- Built `presentation-sustainability.html`, a 9-slide local deck matching the live app's own design tokens, not committed or pushed per the user's instruction (local-laptop use only). Includes the persona/payer grid and the corrected cost slide.

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
