# WIP crash pad

Read this first when resuming. Overwrite it whenever the in-progress task changes. Empty "In progress" means nothing was mid-flight.

**Last updated:** 2 Sep 2026, UI refresh R0 to R4 built, not yet committed

## In progress

UI refresh per `tasks/ui-refresh-plan.md`. Built and locally verified, not committed:
- R0 `ussdText()` in engine.js, tested (11/11 green).
- R1 to R3: `index.html` rewritten as a hash-routed app (home, answer, counter, detail, about), `localStorage` memory of last pair and five recent checks, persona actions (counter, read aloud, share, another farmer same depot).
- R4 PWA: `manifest.json`, `sw.js`, icons, install nudge, offline pill.
- R5 `strings.js`: full EN/SW toggle. Swahili is machine-drafted, `SWAHILI_REVIEWED = false`, needs the teammate's pass before demo.
- R6 USSD note on the answer screen says "in progress, not live".
- Milestone A, USSD: `ussd.js` (menu, pure), `api/ussd.js` (Vercel function, Africa's Talking CON/END), `test/ussd.test.js`. Every final screen equals the web share text. Still needs: Africa's Talking sandbox signup and callback URL pointed at the Vercel deploy, then a simulator run.
- Counter and answer verdict words size from the longest word so "CONDITIONAL" and "BADO KUNA KITU" never clip.
- Restyle (Victor, 2 Sep): dropped the cream/paper look, Manrope + JetBrains Mono, green-forward palette, light line-art farming hero. Farmer and depot pickers are now searchable bottom sheets. Service worker is network-first for HTML so deploys reach users on next open.
- Previous page kept at `capture/index.v1.html`; problem-screen captures for the deck in `capture/`.

## v2: officer release system (2 Sep, evening)

Specs in `specs/00` to `08`, signed off. GitHub epic #1 with milestones and tickets:
- A engine #2 (tickets #3 #4 #5)
- B store #6 (#7 #8)
- C API #9 (#10 #11 #12 #13)
- D officer UI #14 (#15 #16 #17 #18)
- E farmer UI #19 (#20 #21)
- F Codex polish #22 (#23 #24)
- G deploy and demo #25 (#26 #27)
Build order A to G, one ticket per PR. Spec links in the tickets point at `blob/master/specs/`, so the specs must be pushed before the links resolve.

## Next up (from FOUNDATION.md §6)

1. Step 4: script the Q&A answers (why secondary sources count as grounding; why no agronomic advice; why build USSD when KIAMIS has `*6163#`). Writing, not code, can go to a teammate.
2. Step 5: pitch narrative, fair-price lead. Also writing.
3. Step 6: static fallback capture. Do this once step 3's screen is final, not at the very end.

## Waiting on Mailu

- Source 5 (The Star, 25 Aug 2026): real headline and URL. Not blocking, the problem screen already shipped with an original headline and the existing grounded anecdote; the "link pending" note on the pull-quote and in the sources ledger will clear itself once the URL is added to `engine.js`.
- A citable source for the depot/ward scale figures in MILESTONES.md (103 NCPB depots, 281 last-mile points, 1,382 wards), if one exists. Deliberately left off the problem screen otherwise.
- Vercel: connect the repo, confirm production URL.
- Owners for Milestones B and A; GitHub issues; collaborator invites (after milestone 1 acceptance).

## Done today

- Repo seeded and pushed: `github.com/14leux/kilimo-nitapata` (private).
- Plan review; decisions logged in FOUNDATION.md §9.
- Step 0: rule engine extracted, prototype folded into repo, Vercel-ready layout.
- Step 1: counter-presentable clerk view.
- PROGRESS.md and TESTING.md added; every documented scenario verified live before writing it up.
- Step 2: mobile polish (citation tap targets, iOS select zoom fix).
- Step 3: problem screen. Original headline (not attributed to source 5 as a fabricated quote), Mt Elgon pull-quote correctly cited and self-clearing "link pending" note, four persona cards from presentation-copy.md, skip-to-check link. Scale figures deliberately omitted, no source grounds them. Verified live at desktop and 320px, 9/9 tests still green.
