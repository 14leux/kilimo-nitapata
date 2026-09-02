# Session context

Stable facts a fresh session needs that are not obvious from the code. Keep short; FOUNDATION.md is the long-form source of truth.

- **What this is:** hackathon build (Claude Impact Lab, Nairobi, 2 Sep 2026). Purpose is leverage, not revenue. See FOUNDATION.md §1.
- **Discipline level:** lightweight by documented decision (FOUNDATION.md §7). Keep `tasks/wip.md` current; log decisions in FOUNDATION.md §9; no `.agent/` protocol.
- **Architecture in one line:** `engine.js` holds all data and `evaluate()`; `index.html` renders it; future channels (`api/ussd.js`) import the same engine. Never duplicate engine data.
- **Hosting:** Vercel from the GitHub repo. Framework "Other", no build, output `.`. The old Claude Artifact is retired.
- **Hard constraints:** no model inference in verdicts; demo data always labelled as sample; no em dashes anywhere (tested); never silently drop a stated requirement.
- **Local run:** `npm test`, `npm run dev` (port 3000). Preview config in `.claude/launch.json`.
- **Repo:** `github.com/14leux/kilimo-nitapata`, private, branch `master`. Share with the team after milestone 1 is accepted.
- **Milestone order:** B (location) before A (USSD).
