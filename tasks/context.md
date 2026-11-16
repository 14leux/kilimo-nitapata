# Session context

Stable facts a fresh session needs that are not obvious from the code. Keep short; FOUNDATION.md is the long-form source of truth.

- **What this is:** hackathon build (Claude Impact Lab, Nairobi, 2 Sep 2026), now grown into a v2 "officer release system" (see `specs/00-one-pager.md`, signed off by teammate Victor). Purpose is leverage, not revenue, though the sustainability case for the v2 system is now real and researched, see the two council transcripts.
- **Discipline level:** lightweight by documented decision (FOUNDATION.md §7). Keep `tasks/wip.md` current; log decisions in FOUNDATION.md §9; council transcripts (`council-transcript-*.md`) stand in for a decision log entry when the reasoning is long. No `.agent/` protocol, no `codebase_map.md`.
- **Architecture in one line:** `engine.js` holds all data, `evaluate()`, `nearestDepots()`, `ussdText()`, `buildSnapshot()`, `releaseText()`. `index.html` is now a hash-routed PWA (home/answer/counter/detail/about/ussd). `ussd.js` + `api/ussd.js` are the real USSD channel (pull-only, not push, see below). `lib/store.js`/`lib/db.js` + `api/board.js`/`api/season.js`/`api/approval.js` are the v2 officer backend (Upstash Redis). Never duplicate engine data.
- **USSD is pull-only.** The farmer dials in; nothing in this codebase can push a USSD message to him. Don't describe it as one of the things a Release "pushes through", that's inaccurate to what's built (found and corrected 2 Sep, flagged for `specs/00-one-pager.md` but not changed there, it's Victor's document).
- **USSD cost, real and non-obvious:** in Kenya a standard shortcode bills the session to the farmer's own airtime (KES 1 to 5), not to the business. A toll-free shortcode shifts that cost to the operator for a KES 5,000 setup plus a higher monthly lease. This is an unmade decision, don't let a pitch or a partner conversation imply an answer before the team actually picks one.
- **Hosting:** Vercel, linked and deployed. Live at [kilimo-nitapata.vercel.app](https://kilimo-nitapata.vercel.app). The officer-mode API routes (`api/board.js`/`season.js`/`approval.js`) currently 500 live, `UPSTASH_REDIS_REST_*`/`OFFICER_PASSCODE`/`TWILIO_*` are not yet set on the Vercel project. The core farmer checker and USSD simulator are unaffected.
- **Hard constraints:** no model inference in verdicts; demo data always labelled as sample; no em dashes anywhere, including in HTML entity form (`&mdash;` renders the same as the literal character, both are banned); never silently drop a stated requirement; never fabricate a citation or a headline, if a source isn't grounded, omit the claim.
- **Service worker caching:** `sw.js` precaches `engine.js`/`strings.js`/`index.html` cache-first, keyed to a `VERSION` string. Bump it on every deploy that changes any precached file's content, or returning visitors and installed PWAs keep the old version until a background refresh catches up, which for a one-time demo audience can mean never.
- **Local run:** `npm test` (48/48). `npm run dev` serves static files only, does not run `/api/*`. Use `npx vercel dev` to exercise the USSD/officer endpoints locally.
- **Repo:** `github.com/14leux/kilimo-nitapata`, private, branch `master`. Collaborators: uxvic, KodeckJames, Kajim360 (uxvic has forked). Zero PRs have ever been opened against this repo, work from the fork lands via direct merge, reviewed here, not there.
- **Milestones:** B (location) shipped. A (USSD) has working code and an in-app simulator (`#ussd`), but its real test condition, a live Africa's Talking sandbox run, hasn't happened, tracked as [issue #1](https://github.com/14leux/kilimo-nitapata/issues/1).
- **Sustainability narrative:** two council sessions, saved as `council-transcript-20260902T173000.md` (value prop, officer-release as the real sustainability story) and `council-transcript-20260902T190000.md` (corrected cost claim, persona/payer table). The deck `presentation-sustainability.html` was local-only until 16 Nov 2026, when the user asked for it published; it is now committed and served at /presentation-sustainability.html.

---

## Closing checkpoint, 2 Sep 2026 (evening)

**What happened this stretch:** reviewed and completed an uncommitted merge of a teammate's fork (the v2 officer-release system, USSD, a full UI refresh), corrected FOUNDATION.md where it had gone stale against that merge, investigated and rejected an Africa's Talking MCP server, installed a design-skills package globally, built a working in-app USSD simulator, fixed the verdict-card wording (and a real PWA cache-versioning bug that surfaced during it), ran two council sessions on sustainability, and built a local-only presentation deck.

**Completed:** everything above, all verified live, not just claimed. 48/48 tests. GitHub fully current except the local-only presentation and its absence is intentional, not an oversight.

**Current step:** none, session closing cleanly.

**Next step (for whoever resumes):** the six items in `tasks/wip.md` under "Next up", most concretely: set the Vercel env vars, decide the USSD toll-free question, and get a real officer's answer to the one question the council flagged as the actual validation test ("would seeing what you see help or threaten you").

**Blockers:** none blocking the core product. The officer-mode API routes are broken live until env vars are set, that's known and tracked, not a surprise for whoever opens the officer screens next.

Status: CLOSED

---

## Close Verification

- PROGRESS.md / TESTING.md: not touched this stretch, no new build step landed, this was review, correction, and narrative work. Still current as of the last build-step entry.
- FOUNDATION.md Decision Log and Open Items: updated, v2 backend stack row, two new decision entries, new Open Item for Vercel env vars.
- Council transcripts: two, both saved, both linked from `tasks/wip.md`.
- Tracked-file reconcile: `presentation-sustainability.html` and this evening's work are intentionally untracked/local-only per explicit user instruction, not a gap.
- tasks/wip.md: rewritten, a duplicated section from a copy-paste edit was caught and removed before this close.
- git commit created: yes, `5d6188f`, "Second council: correct the per-farmer cost claim on the pitch".
- git push completed: yes, `git log @{u}..HEAD` empty, confirmed below.
- git worktree audit: clean, single worktree, no stray entries.

---

## Closing checkpoint, 16 Nov 2026

**What happened this stretch:** added the Claude Community winner badge to the README top and a winner line under the intro; updated the GitHub repo description (text only, images cannot go there); scanned history for secrets and made the repo public; published `presentation-sustainability.html` (served at `/presentation-sustainability.html`, linked next to the Live link in the README); fixed `sw.js` so only `/` and `/index.html` navigations overwrite the cached app shell, and bumped `VERSION` to `kn-v5-2026-11-16`.

**Completed:** all of the above, verified: 48/48 tests, deck returns HTTP 200 live, repo reports PUBLIC.

**Current step:** none, session closing cleanly.

**Next step:** unchanged, the six items in `tasks/wip.md` under "Next up". Extra note: the repo is public now, so check the sustainability deck's cost slide (farmer pays USSD unless toll-free is bought) before sharing the link with partners, the toll-free decision is still unmade.

**Blockers:** none for the core product. Officer-mode API routes still 500 live until the Vercel env vars are set.

Status: CLOSED

Close Verification:
- Knowledge/lessons file: none exists (lightweight discipline); the sw.js lesson is recorded in the FOUNDATION.md Decision Log row below.
- DECISIONS.md: does not exist; FOUNDATION.md §9 updated: yes, entry "Repo made public; sustainability deck published..." (16 Nov 2026)
- tasks/todo.md: does not exist in this project, n/a
- Open Items table (FOUNDATION.md §8): updated: no, none raised or resolved this session
- tasks/codebase_map.md: does not exist by documented decision (FOUNDATION.md §7), reconcile n/a
- tasks/wip.md reset to empty template: yes
- git commit and push: see the final lines of the close output
