# Session context

Stable facts a fresh session needs that are not obvious from the code. Keep short; FOUNDATION.md is the long-form source of truth.

- **What this is:** hackathon build (Claude Impact Lab, Nairobi, 2 Sep 2026). Purpose is leverage, not revenue. See FOUNDATION.md §1.
- **Discipline level:** lightweight by documented decision (FOUNDATION.md §7). Keep `tasks/wip.md` current; log decisions in FOUNDATION.md §9; no `.agent/` protocol, no `codebase_map.md`, README's own "Start here" / "Code" sections serve that purpose and stay current.
- **Architecture in one line:** `engine.js` holds all data and `evaluate()` (plus `nearestDepots()` for location); `index.html` renders it; future channels (`api/ussd.js`) import the same engine. Never duplicate engine data.
- **Hosting:** Vercel, linked and deployed. Live at [kilimo-nitapata.vercel.app](https://kilimo-nitapata.vercel.app), verified publicly reachable 2 Sep with no console errors. `.vercel/` exists locally (gitignored, correctly untracked) from the user's own `vercel link`.
- **Hard constraints:** no model inference in verdicts; demo data always labelled as sample; no em dashes anywhere (tested); never silently drop a stated requirement; never fabricate a citation, if a source isn't grounded, omit the claim rather than invent an attribution (see the source-5-headline decision in FOUNDATION.md §9).
- **Local run:** `npm test` (12/12), `npm run dev` (port 3000). Preview config in `.claude/launch.json`.
- **Repo:** `github.com/14leux/kilimo-nitapata`, private, branch `master`. Collaborators already added: uxvic, KodeckJames, Kajim360 (uxvic has forked).
- **Milestones:** B (location) shipped 2 Sep. A (USSD) tracked as [issue #1](https://github.com/14leux/kilimo-nitapata/issues/1), unowned.

---

## Closing checkpoint, 2 Sep 2026

**Goal this session:** stand up the project from source documents, build V1's core (steps 0 through 6), ship Milestone B, open tracking for Milestone A, get it live on Vercel.

**Completed:** everything above. V1 core is functionally complete and tested. Milestone B is done. Vercel deployment is live and verified. GitHub is current, nothing local-only.

**Current step:** none, session closing cleanly, not mid-task.

**Next step (for whoever resumes):** either pick up Milestone A (issue #1), get source 5's real headline/URL from Mailu, or continue toward demo day with whatever the team prioritizes. See `tasks/wip.md` for the live version of this list, it will have moved on by the time anyone reads this section.

**Blockers:** none blocking. Source 5's link and the depot/ward scale-figure citation remain open but nothing depends on them.

**Milestone status:** V1 core done. Milestone B done. Milestone A open, unowned, fully scoped in the GitHub issue.

Status: CLOSED

---

## Close Verification

- PROGRESS.md / TESTING.md updated: yes, entries for steps 0 through 6 and Step 7a (Milestone B), each with what changed and how to verify it. This project uses these two files in place of a knowledge/lessons file; both current as of the last commit.
- FOUNDATION.md Decision Log updated: yes, entries for the plan-review decisions, the source-5-headline call, and the Vercel connection.
- FOUNDATION.md Open Items table updated: yes, GitHub repo creation, Milestone B, and Vercel connection all marked DONE this session; source 5 URL and the depot/ward citation remain PENDING, correctly still open.
- Tracked-file reconcile: ran clean, `git ls-files` matches what README.md's "Start here" and "Code" sections describe, no drift found.
- tasks/wip.md: left populated with the live "next up" list (this project's convention, not reset to a blank template, see FOUNDATION.md §7 on why the full crash-pad protocol wasn't adopted).
- git commit created: yes, see the commit this file was written alongside.
- git push completed: yes, `git log @{u}..HEAD` empty, confirmed below.
- git worktree audit: clean, single worktree, no stray entries.
