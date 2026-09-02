# Kilimo, Nitapata?

*Nikienda leo, nitapata?* If I go today, will I get it?

A mobile-first web app that answers three questions for a registered smallholder farmer enrolled in Kenya's fertilizer e-Voucher scheme: will a given depot serve him, what is he still missing, and what does the bag cost. Verdict-first, with a citation trail behind every claim, computed by a deterministic rule table, never guessed by a model.

Built for the Claude Impact Lab, Nairobi.

**Live:** [kilimo-nitapata.vercel.app](https://kilimo-nitapata.vercel.app)

## Start here

- [`FOUNDATION.md`](FOUNDATION.md), the Project Foundation Document. Single source of truth for scope, stack, architecture, build sequence, open items, and the decision log. Read this first.
- [`PROGRESS.md`](PROGRESS.md), what has actually been built, step by step, updated after every build session. Check here before assuming something works.
- [`TESTING.md`](TESTING.md), how to verify each completed step yourself, automated and manual. Run this before building on top of anything.
- [`MILESTONES.md`](MILESTONES.md), full specs for the two stretch milestones open for team contribution: GPS/location depot suggestion (sequenced first) and the USSD channel (second). Both are scoped for someone to pick up independently.
- [`presentation-copy.md`](presentation-copy.md), persona-segmented copy for the pitch and the app's problem screen.
- [`PITCH.md`](PITCH.md), the talk track for the live demo.
- [`QA.md`](QA.md), scripted answers to the questions most likely to derail the pitch.
- [`fallback/`](fallback/), screenshots to fall back on if the live network drops.

## Code

- [`index.html`](index.html), the page. Static, no framework, no build step.
- [`engine.js`](engine.js), every farmer, depot, requirement, price and source, plus `evaluate(farmer, depot)`. The only place product knowledge lives. Every channel imports it; nothing copies it.
- [`test/engine.test.js`](test/engine.test.js), all 36 farmer x depot pairs, verdict invariants, citation integrity, house style.

```
npm test        # rule engine tests
npm run dev     # http://localhost:3000
```

Deploys to Vercel from this repo: framework preset "Other", no build command, output directory `.`.

## Status

V1 (hackathon build) core is functionally complete, steps 0 through 6, plus Milestone B (location), are done. See `PROGRESS.md` for what and `TESTING.md` for how to verify it yourself. What's left: source 5's real link, and Milestone A (USSD), open and unowned, see `MILESTONES.md` for the build steps and test condition.

## Non-negotiable constraints

- Never generate a verdict, gap, or price from model inference. Only from the fixed rule table against selected records.
- Never present demo data as live or real farmer/depot records.
- Never silently drop a stated requirement without naming it as deferred, in the product or the pitch.

No em dashes in any project copy. House style, enforced by a test.
