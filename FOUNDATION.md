# Kilimo, Nitapata?, Project Foundation Document

**Owner:** Mailu Mwau
**Created:** 2 September 2026
**Skill version:** new-project v2, optimised for hackathon timeline (see note in Section 7)
**Status:** Active, read before any build session
**Event:** Claude Impact Lab, Nairobi

> This document is the single source of truth for this build. No structural change to scope, stack, or design should be made without recording it in the Decision Log below.

---

## 1. Project Purpose

### 1.1 What this is
A mobile-first web app that answers three questions for a registered smallholder farmer enrolled in Kenya's fertilizer e-Voucher scheme: will a given depot serve him, what is he still missing, and what does the bag cost. Every answer is verdict-first with a citation trail behind it, computed by a deterministic rule table against farmer and depot records, not guessed by a model. It is not a marketplace, does not give agronomic advice, and does not touch payments.

### 1.2 Primary purpose
Leverage. The build demonstrates a grounded, citation-disciplined civic-tech pattern credible enough to open doors, with Anthropic, partners, or future clients, rather than functioning as a revenue product today.

### 1.3 Problem being solved
A registered smallholder cannot verify his own standing in a scheme he is already enrolled in, his eligibility, allocation, and assigned depot exist as facts inside a government system he cannot see into. He discovers what he's missing only at the depot counter, after a day's labour and a fare he can't recover, and in planting season, timing he can't get back either. A related exposure: without knowing the gazetted price, he can't tell a fair price from an inflated one at the point of sale.

### 1.4 Success signal
A genuinely reusable asset, correct, well-grounded, demoable live today, that holds up as a case study regardless of how judging goes. Not a placement-dependent measure.

---

## 2. Build Strategy

### 2.1 Phase overview

| Phase | When | What it includes | Gate condition |
|---|---|---|---|
| V1, hackathon build | Today, hours available | Mobile-first retrofit of the existing prototype, researched problem screen with persona copy, counter-presentable clerk screen, scripted Q&A answers, static demo fallback | Live and working before judging |
| V1 stretch milestones, build-or-cut decided near cutoff | Today, only if hours remain after V1 is solid | USSD channel and GPS/location depot suggestion, both fully scoped in MILESTONES.md, restored to scope after team pushback on 2 Sep | Ship if time allows; if not, the scoping itself is the deliverable and the pitch says so honestly |
| V2, post-hackathon, only if this continues | Not scheduled | Whichever of the USSD/location milestones didn't make the cutoff, plus the wilder directions logged in MILESTONES.md (WhatsApp channel, Swahili voice line, extension-officer batch mode, SMS-forwardable citation, depot queue signal, price-integrity feedback, multi-scheme expansion) | Only if the project is picked up as an operated effort past today |

### 2.2 Version 1 scope
A mobile-first, installable web page, built for the proxy (the literate, smartphone-holding relative who asks on the farmer's behalf), not the farmer's feature phone directly. It opens on a researched problem screen (scale figures and the Mt Elgon queue account from The Star, persona-segmented copy on why the tool needs to exist) before the checker itself. The proxy selects a sample farmer and a depot, gets a verdict, served, conditional, or not served, an itemised list of what's missing, and the price, each claim footnoted to its source. A second screen, reached from the verdict, is designed to be shown to or read out at the depot counter itself: short, plain language, looks official, readable on a slow connection. Demo data (farmers, depots) is clearly labelled as sample data, not a live feed. Rules and prices are transcribed from five cited secondary sources (see Glossary/Sources note) because the primary gazette notice and KIAMIS's own documentation were not publicly retrievable, this is disclosed inside the product, not hidden. USSD and GPS/location, both pushed back into scope after team review, are fully specified as build-or-cut milestones in MILESTONES.md rather than either built outright or firmly excluded.

### 2.3 What is explicitly excluded from V1
| Excluded | Reason |
|---|---|
| Agronomic advice / soil-test-based entitlement | Cannot be grounded in scheme documents; carries harm risk outside the team's competence. Argued in the presentation as a deliberate scope decision, not built. |
| Marketplace function | Turns an information layer into an intermediary with inventory liability. |
| Payments | Converts the product into a regulated financial service. |
| Live KIAMIS/government integration | No public API, sandbox, or self-service status lookup was found anywhere at national or county level. Confirmed unavailable, flagged as future work requiring a real data-sharing arrangement with MoALD/KIAMIS. |
| Native app build | No time for app-store review inside the hackathon window. A web app manifest for Add-to-Home-Screen is now feasible under Vercel hosting (we control the page head) but is a nice-to-have, not a V1 item. |
| Full national depot dataset | A small representative demo set stands in for the real 384-point redemption network. |

USSD and GPS/location moved from this table to the stretch-milestone row in 2.1 on 2 Sep, after team pushback; see MILESTONES.md and Decision Log 9.

### 2.4 Demo narrative, what three things it proves, in order
1. The verdict is never guessed, every claim, eligibility gate, and price traces to a named, dated source, shown inline and in full in a sources ledger.
2. The product knows the difference between a farmer-side gap (missing validation) and a depot-side gate (unauthorised redemption point), and explains which one is blocking service.
3. The answer is built to survive contact with the person who actually decides at the counter, it's not just accurate, it's presentable as evidence.

---

## 3. Technology Stack

| Layer | Technology | Decision rationale |
|---|---|---|
| Frontend | Static mobile-first HTML/CSS/JS (`index.html`), no framework, no build step | Opens on a judge's phone the instant the link is shared; a web app manifest for installability is now possible since we control the page head (was not possible under Artifact hosting) |
| Logic | Deterministic rule engine in one shared ES module (`engine.js`), imported by the page and by any future channel (USSD, SMS, batch) | "Never guess" is a stated design principle; one copy of the data and the verdict function is the only way two channels stay in agreement. Covered by `npm test` (all 36 farmer x depot pairs, citation integrity, house style) |
| Data | Embedded demo dataset in `engine.js` (sample farmers, depots, rules, sources) | No backend needed; keeps the build achievable in hours |
| Hosting | Vercel, deployed from this GitHub repo | Team members can deploy, which Artifact hosting never allowed; static page plus optional serverless functions under `api/` means Milestone A's USSD webhook can live in the same repo and import the same engine. Replaced Artifact hosting on 2 Sep, see Decision Log |

### 3.1 What is explicitly excluded from the stack
| Technology | Why excluded |
|---|---|
| React Native / Flutter / native app shell | No time to build and there's no app-store distribution happening today |
| Any database service | Adds a moving part with no time to harden it; demo data ships with the page |
| Backend beyond a single Vercel serverless function | Only Milestone A (USSD) needs a server at all, and a single `api/ussd.js` importing `engine.js` covers it. No persistent server process anywhere. |
| Live geolocation-driven backend matching | Milestone B computes distance client-side (haversine over a small coordinate table); no backend involved |

---

## 4. Data (V1, no formal schema, embedded demo records)

### 4.1 Design principles
Every requirement, price, and problem-scale figure carries a citation to one of five named sources. Every farmer and depot record is labelled sample data. Where sources disagree (as they do on price), both figures are shown rather than one being asserted as correct.

### 4.2 Entities

**Farmer (sample record):** id, name, county, crop, acres, registered (bool), idLinked (bool), acreage confirmed (bool), Assistant Chief validation (bool), Sub-County Agricultural Officer approval (bool), bags used, bags allocated.

**Depot (sample record):** id, name, county, type (NCPB depot / Cooperative / KNTC warehouse / registered agrovet / unlisted), authorised (bool), fertilizer types stocked.

**Requirement (rule):** key, title, citation reference(s).

**Source:** id, title, publisher, URL, what it grounds, date retrieved.

---

## 5. Architecture

### 5.1 System overview
Single static page. On load, it renders farmer and depot pickers from embedded JSON. On selection, a pure JS function evaluates the farmer's record against the requirement table and the depot's authorisation flag, and renders a verdict, a gap ledger, a price block, and a sources ledger, all client-side, no network call after initial page load.

### 5.2 Non-negotiable constraints
- Never generate a verdict, gap, or price from model inference, only from the fixed rule table against the selected records.
- Never present demo data as live or real farmer/depot records.
- Never silently drop a stated requirement (like location) without naming it as deferred, in the product or the pitch.

---

## 6. Build Sequence (hours-left, time-boxed)

Reordered 2 Sep after plan review (Decision Log). Code work is serial; writing work runs in parallel from the moment step 0 lands; the stretch milestones can start in parallel from step 0 too, since they no longer touch the same file as the page.

| Order | Deliverable | Who | Test condition | Status |
|---|---|---|---|---|
| 0 | Extract the rule engine into `engine.js`; wire source 5 into the engine; strip em dashes from the app; fix stale "eight requirements / four sources" copy; test suite over all 36 pairs; Vercel-deployable layout | Mailu + Claude | `npm test` green; page renders all three verdicts from the module with no console errors | **DONE 2 Sep.** Source 5 URL still pending (see Open Items) |
| 1 | Counter-presentable "show the clerk" view, reached from the verdict. Implemented as a toggle that hides everything but the verdict, the one blocking item, the price and the citation, not as a separate route | Mailu + Claude | Readable at a glance, plain language, survives being zoomed or screenshotted, no network needed once loaded | **DONE 2 Sep.** Verified at mobile width (375px) for Served, Conditional and Not Served |
| 2 | Mobile polish of the existing scroll page. Not a screen-by-screen rewrite: the page is already responsive, and routing state would cost hours for no demo gain | Mailu + Claude | Fully usable on an actual phone, not just a resized desktop window | |
| 3 | Researched problem screen: the Mt Elgon queue account (source 5), persona-segmented copy on why the tool needs to exist. Skippable, so the demo can go straight to the checker | Mailu or teammate; copy already exists | Every stat and the pull-quote are cited; persona copy matches presentation-copy.md | **DONE 2 Sep.** Headline is original copy for this screen, not attributed to source 5. Depot/ward scale figures from MILESTONES.md (103 NCPB depots, 281 last-mile points, 1,382 wards) deliberately omitted, no source among the five grounds those specific counts; add them only once a citable source is found |
| 4 | Script the Q&A answers: why secondary sources count as grounding; why no agronomic advice; why build USSD when KIAMIS already has `*6163#` (that code does registration and voucher delivery, not "will this depot serve me and what am I missing") | Teammate, in parallel from step 0 | Written down, rehearsed, not improvised | **DONE 2 Sep**, see [QA.md](QA.md) |
| 5 | Lead pitch narrative with the fair-price exposure, not the wasted-trip framing | Teammate, in parallel from step 0 | Pitch opens with "he can't tell a fair price from an inflated one," not "he wastes a trip" | **DONE 2 Sep**, see [PITCH.md](PITCH.md) |
| 6 | Static fallback: screenshots or short screen recording of the working app. Capture right after step 3, not at the end | Anyone | Exists and is accessible even if live network fails in the room | **DONE 2 Sep**, see [fallback/](fallback/) |
| 7 (stretch) | Milestone B (GPS/location) first, then Milestone A (USSD), per MILESTONES.md. B is far cheaper and its fallback is already designed; A carries three external dependencies (sandbox, tunnel, response budget) that can fail in the room | Team via GitHub, in parallel from step 0 | Meets the test condition in MILESTONES.md for whichever is attempted | |

If 7 doesn't make the cutoff, the pitch says so directly: both are scoped in detail, tracked on GitHub, and the call on whether either shipped was made deliberately against the clock, not skipped.

### 6.1 Running and testing locally

```
npm test        # rule engine: 36 pairs, invariants, citation integrity, house style
npm run dev     # static server on http://localhost:3000
```

Deploy: connect the GitHub repo to Vercel with framework preset "Other", no build command, output directory `.`.

---

## 7. Session Discipline, deferred by design

This is a same-day hackathon build, not a multi-session operated project, so the full session-discipline scaffold (.agent/ folder, git hooks, KNOWLEDGE.md, DECISIONS.md, session boot/close protocol) is deliberately not created today. This is a documented decision (see Decision Log 9.x), not an oversight.

The GitHub repository exists as of 2 Sep (private, `14leux/kilimo-nitapata`), so the team can contribute to the USSD and location milestones directly. A lightweight checkpoint pad is kept in `tasks/wip.md` and `tasks/context.md` so that a crashed or compacted session can resume from files rather than memory; this is the one piece of the discipline apparatus worth carrying even on a same-day build, because it costs nothing and the day is long. The full `.agent/` boot and close protocol is still not created.

**If this project is picked up again as a real build after the hackathon:** run the full new-project skill scaffold at that point, .agent/ files, git initialisation, session discipline framework, before writing any further code, exactly as the skill normally requires. This document becomes the seed for that process, not a replacement for it.

---

## 8. Open Items

| Item | Depends on | Owner | Required for | Status |
|---|---|---|---|---|
| USSD channel: build or cut | Hours remaining after core V1 is solid; requires extracting the rule engine into a shared module first | Team, via GitHub, per MILESTONES.md | V1 stretch / V2 | PENDING, fully scoped |
| GPS/location depot suggestion: build or cut | Hours remaining after core V1 is solid | Team, via GitHub, per MILESTONES.md | V1 stretch / V2 | PENDING, fully scoped |
| Create the GitHub repository and add it as a remote | | Mailu | Team contribution to the two milestones above | DONE 2 Sep: `github.com/14leux/kilimo-nitapata`, private. Collaborator invites still to be sent once milestone 1 is accepted |
| Source 5 (The Star, 25 Aug 2026): exact headline, article URL | Mailu has the article | Mailu | Sources ledger and problem-screen pull-quote both currently show "link pending" | PENDING, engine entry exists with an empty URL. Not blocking: the problem screen shipped 2 Sep using an original headline plus the Mt Elgon anecdote, which the existing entry already grounds |
| A citable source for depot/ward scale figures (103 NCPB depots, 281 last-mile points, 1,382 wards, from MILESTONES.md) | Research, or confirm these came from one of sources 1 to 5 and add the citation | Mailu | Would strengthen the problem screen, not required for it | PENDING, deliberately left out of the problem screen rather than cited without grounding |
| Connect the repo to Vercel and confirm the production URL | Vercel account access | Mailu | Demo link, QR code, team deploys | PENDING |
| Assign owners to Milestones A and B and open GitHub issues for each | Team availability today | Mailu | Parallel work on step 7 | PENDING |
| Which published documents are canonically authoritative this season, and where they're hosted | Access to primary gazette/KIAMIS documentation | Mailu + team, possibly a MoALD/extension-officer contact | Any real build past V1 | PENDING |
| Language strategy, Swahili-first, English-first, or mirrored | Team decision | Mailu + team | Any real build past V1 | PENDING |
| Failure mode when sources conflict or are silent | Design decision | Mailu + team | Any real build past V1 | PENDING, V1 precedent: show both figures rather than asserting one, applied to the price disagreement already found |
| Whether the counter screen needs to work fully offline or as SMS text | Team decision | Mailu + team | V2 | PENDING, candidate answer proposed in MILESTONES.md (SMS-forwardable citation) |
| Real KIAMIS/MoALD data-sharing conversation | Outreach, not a build task | Mailu + team | Any real integration | PENDING |
| Seven wilder V2 directions (WhatsApp channel, Swahili voice line, extension-officer batch mode, SMS-forwardable citation, depot queue signal, price-integrity feedback, multi-scheme expansion) | Whether project continues past hackathon | Mailu + team | V2, none block today | PENDING, logged with justification in MILESTONES.md; price-integrity feedback flagged as needing real discussion against the "not a new institution" principle before it's a yes |

---

## 9. Decision Log

| Date | Decision | Rationale | Made by | Council position |
|---|---|---|---|---|
| 2 Sep 2026 | V1 targets the general national e-Voucher farmer base, not narrowed to Sultan Green's existing network | Matches the hackathon brief's own scope; no existing relationship required | Mailu | Not applicable, pre-council |
| 2 Sep 2026 | Project purpose is "strongest hackathon entry," not an operated product, for now | Explicit choice over building for revenue today | Mailu | Not applicable, pre-council |
| 2 Sep 2026 | Full session-discipline scaffold (.agent/, git hooks, etc.) is skipped for today's build | Disproportionate to an hours-left, live-demo timeline; deferred to a real post-hackathon build if it happens | Mailu, on Claude's recommendation | Not applicable, pre-council |
| 2 Sep 2026 | No agronomic advice, including no entitlement-by-soil-test carve-out, argued in the presentation, not built | Resolves the tension between Mailu's realism concern and the teammate document's flat exclusion, without weakening the brief's grounding requirement | Mailu | Not applicable, resolved before council |
| 2 Sep 2026 | Feature-phone reach achieved via proxy relay, not a second USSD channel. **Superseded later the same day** by the entry restoring USSD as a scoped stretch milestone; left here as the record | Teammate document's persona split (farmer vs. proxy) makes a single smartphone-first interface sufficient for V1 | Mailu (via teammate document) | Accepted, First Principles + Executor |
| 2 Sep 2026 | Location/GPS is a must-build, for V2, not V1, and is named explicitly in the presentation | Resolves the one genuine council disagreement: not load-bearing to the core mechanism (First Principles), but a stated requirement worth being honest about rather than silently dropping | Mailu | Council flagged as the one unresolved disagreement; resolved by Mailu |
| 2 Sep 2026 | Retrofit the existing prototype rather than rebuild from scratch | The rule engine, citation model, and verdict logic already work; remaining hours should go to presentation-layer work | Mailu (accepted council recommendation) | Accepted, First Principles + Executor |
| 2 Sep 2026 | Add a counter-presentable "show the clerk" screen | This is the document's actual stated design goal, not a nice-to-have | Mailu (accepted council recommendation) | Accepted, Executor, reinforced by Outsider |
| 2 Sep 2026 | Script sourcing and no-agronomic-advice answers in advance | A live, unscripted answer to a sharp judge question risks derailing the pitch | Mailu (accepted council recommendation) | Accepted, Contrarian + Outsider |
| 2 Sep 2026 | Lead the pitch with the fair-price exposure, not the wasted-trip framing | Stronger, more visceral hook for judges unfamiliar with the domain | Mailu (accepted council recommendation) | Accepted, Expansionist |
| 2 Sep 2026 | Keep a static screenshot/recording fallback for network failure | No advisor caught this until peer review; a dropped connection mid-pitch is a real, avoidable failure mode | Mailu (accepted council recommendation) | Accepted, surfaced in peer review, all five missed it individually |
| 2 Sep 2026 | USSD and GPS/location restored to scope, as fully-specified milestones, build-or-cut decided near the cutoff, rather than firmly excluded from V1 | Team pushback on deferring both outright; resolved by scoping them properly instead of either building them blind under time pressure or dropping them a second time | Mailu, on behalf of team pushback | Not applicable, decided after the council ran, not put back to it |
| 2 Sep 2026 | The Star's 25 Aug 2026 investigative piece added as source 5, cited for the app's new problem-scale screen and used to correct "four sources" language throughout the build and this document | The strongest, most current, most directly relevant source found in the original research wasn't yet wired into the product's own citation system | Claude, on the day's research already in hand | Not applicable, correction, not a new finding |
| 2 Sep 2026 | Local git repository initialised for the project, no remote; pushing to GitHub is on the team | This session has no GitHub credentials; a bare local repo is still useful groundwork for whoever picks up the milestones | Claude, per Mailu's request for the team to contribute on GitHub | Not applicable, infrastructure, not a council-scope decision |
| 2 Sep 2026 | Persistent style rule enforced retroactively across the app, the foundation document, and all copy: no em dashes | Standing project instruction is non-negotiable; earlier drafts used them and were corrected once noticed | Claude, self-corrected | Not applicable, house style, not a council-scope decision |
| 2 Sep 2026 | The Artifact prototype is folded into this repo as `index.html` and no longer maintained as a standalone artifact | One copy of the product; the artifact could not be deployed by the team and could not load a shared module | Mailu, after plan review | Not applicable, post-council |
| 2 Sep 2026 | Rule engine extracted into `engine.js` as step 0 of V1, not step 1 of the USSD stretch | Unblocks both milestones for parallel work, makes the 36-pair verdict test possible, and removes the "two copies drift" risk MILESTONES.md itself named as the most likely embarrassment | Mailu, after plan review | Not applicable, post-council |
| 2 Sep 2026 | Hosting moves from Claude Artifact to Vercel, deployed from the GitHub repo | Team can deploy; page head is under our control (manifest becomes possible); a serverless `api/` folder gives Milestone A a home in the same repo with the same engine. Resolves the contradiction between the old §3 (PWA installable) and old §2.3 (Artifact can't do a manifest) | Mailu, after plan review | Not applicable, post-council |
| 2 Sep 2026 | Build sequence reordered: engine first, clerk view before mobile polish, writing tasks parallelised, fallback captured early. Screen-by-screen navigation dropped in favour of keeping the scroll page and adding a clerk-view toggle | Screen-by-screen routing costs hours for no demo gain on a page that is already responsive; the clerk view is the stated design goal so it comes first | Mailu, after plan review | Not applicable, post-council |
| 2 Sep 2026 | Milestone B (GPS/location) sequenced before Milestone A (USSD) | B has no server, no sandbox signup, no tunnel and no response budget, and its fallback is already designed; A is the bigger story but has three external dependencies that can fail in the room | Mailu, after plan review | Not applicable, post-council |
| 2 Sep 2026 | Lightweight checkpoint files (`tasks/wip.md`, `tasks/context.md`) kept even on the hackathon build; full `.agent/` protocol still deferred | Zero cost, and protects a long day of work from a crashed or compacted session | Mailu | Not applicable, infrastructure |
| 2 Sep 2026 | Problem screen's headline is original copy written for this screen, not a quotation attributed to source 5; the depot/ward scale figures from MILESTONES.md were left out entirely rather than cited to an invented source | Mailu asked for a compelling headline to unblock the build while the real article link was still pending. Inventing and attributing a headline to a named news source would be exactly the fabricated-citation failure this product exists to avoid; the scale figures have no source among the five that grounds their specific counts, so they were omitted rather than guessed at | Mailu, on Claude's flag | Not applicable, post-council |

### 9.1 Council findings, full record

#### Accepted findings
- Retrofit, don't rebuild (First Principles, Executor), changes Section 6 build order.
- Counter-presentable clerk screen is core, not optional (Executor, Outsider), added to Section 2.2 and 6.
- Script the sourcing and no-agronomic-advice answers (Contrarian, Outsider), added to Section 6 as a deliverable, not left to improvisation.
- Lead with the fair-price exposure (Expansionist), changes pitch narrative, recorded in Section 2.4 and 6.
- Static fallback for network failure (peer review finding, missed by all five individually), added to Section 6.

#### Rejected findings
None, all five settled recommendations were accepted without objection.

#### Deferred findings
- Location/GPS (First Principles called it disposable; brief and teammate document call it required), deferred to V2 by Mailu's explicit decision at the time, named in the presentation rather than silently dropped. Superseded later the same day: restored to a fully-scoped V1 stretch milestone after team pushback, see the newer Decision Log entry above and MILESTONES.md. Left here as the honest record of how the call was actually made, not edited away.
- Extension-officer/bulk-mode distribution angle (Expansionist), deferred to a pitch mention only at the time; now scoped further as a wilder V2 direction in MILESTONES.md, still not a V1 build item.

---

## 10. Glossary

| Term | Definition |
|---|---|
| KIAMIS | Kenya Integrated Agriculture Management Information System, the national platform hosting farmer registration records for the fertilizer subsidy scheme. |
| e-Voucher | The digital entitlement issued to a registered farmer, redeemable for subsidised fertilizer at an authorised depot. |
| NCPB | National Cereals and Produce Board, operates a large share of the scheme's redemption depots. |
| KNTC | Kenya National Trading Corporation, operates warehouses that also serve as redemption points. |
| Agrovet | A registered agricultural input retailer; some are authorised e-Voucher redemption points, others are not. |
| Ward | The administrative unit (1,382 nationally) KIAMIS uses to organise farmer registration, the basis for a manual location picker in the absence of live GPS. |
| Assistant Chief validation / Sub-County Agricultural Officer approval | Two of the secondary validations a farmer's registration needs beyond initial sign-up, per the reporting this build is grounded in. |
| Proxy | The literate, smartphone-holding relative who looks up the answer on the registered farmer's behalf and relays it, usually by voice. |

---

## 11. How to Read This Document

Start with Section 1 for what this is and why. Section 2 for what's in and out of today's build. Section 6 for the actual hours-left punch list. Section 9 for why each call was made, including the one the council couldn't settle on its own and the one the team overturned later the same day. Section 8 holds everything genuinely still open, none of it blocks today's build.

Two companion files live alongside this one. MILESTONES.md fully scopes the USSD and GPS/location stretch milestones for team contribution, plus the wilder V2 directions researched on request, each with its justification and its honest caveats. presentation-copy.md carries the persona-segmented copy behind the app's new problem screen, written for the pitch, not restated from the teammate document.

The code is `index.html` (the page) and `engine.js` (all data and the verdict function). `tasks/wip.md` is the live checkpoint of what is in progress right now; read it before resuming any session.
