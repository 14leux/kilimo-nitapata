# Kilimo, Nitapata? Milestones

Scoped 2 September 2026, in response to team pushback on deferring USSD and location to V2. Both are back in scope, fully specified below, tracked as milestones a team member can pick up independently. Whether either actually ships in the demo gets decided closer to the cutoff, based on hours actually remaining, not decided here. Nothing below blocks the current build, which already works without either.

Push this file, and the rest of the project, to a real GitHub repository so the team can work against it directly. This session doesn't have GitHub access to create or push a repo itself, so that step is on whoever picks this up: create the repo, add these files, and open issues or a project board from the milestones below if that's useful.

---

## Milestone A: USSD channel (feature phones, direct)

**What it proves:** the farmer himself, not just his proxy, can get the same verdict on a basic phone, no smartphone or data bundle required.

**Why it's a structural change, not just a new screen:** the current build is a single static page with no backend. USSD needs a server that Africa's Talking can send an HTTP POST to on every keypress. That server has to compute the same verdict the web app computes, so before writing any USSD code, pull the rule engine (the farmer, depot, and requirement data, and the function that turns a farmer-plus-depot pair into a verdict) out of the page and into its own module both the web app and the USSD server import. Two copies of that logic drifting apart is the single most likely way this build embarrasses itself later, so this extraction is step one, not a nice-to-have.

**Confirmed from Africa's Talking's own documentation and two third-party developer guides:** a free sandbox exists for building and testing, no telco agreement needed, with a working test shortcode and an in-browser simulator. The protocol is a simple HTTP request-response loop: the user dials a shortcode, the operator opens a session and posts it to your webhook with the phone number, session ID, service code, and a `text` field that accumulates every input the user has typed so far, separated by `*`. The server replies with plain text starting `CON` to keep the session open and show another menu, or `END` to close it and show a final message. Sessions expire after roughly 180 seconds of inactivity, and each response is expected back within about 10 seconds.

**What a real shortcode costs, later, not for the hackathon:** a shared code runs roughly Ksh 3,000 a month plus a Ksh 5,000 setup fee; a dedicated code is closer to Ksh 10,000 a month plus regulator allocation fees, and either way carrier approval (Safaricom especially) takes two to four weeks. That means the hackathon demo, if it happens, runs on the free sandbox simulator, not a real phone call. That's a fine demo of the mechanism, and worth saying plainly rather than implying it's a live shortcode.

**Build steps:**
1. Extract the rule engine into a shared module, used by both the web app and the USSD server.
2. Stand up a small server (Node is the path of least resistance given Africa's Talking's own examples) with a single POST endpoint implementing the CON/END protocol.
3. Design the menu tree: welcome, pick a sample farmer, pick a depot, show the verdict and the single most important missing item and the price, in plain text, in the roughly 140-160 characters a USSD screen actually fits, which forces much shorter language than the web app's full ledger.
4. Sign up for the sandbox, note the test shortcode, and point Africa's Talking's callback setting at the server (a tunnelling tool is the fastest way to get a public URL for local development during the hackathon itself).
5. Run the full flow in the built-in simulator for every sample farmer and depot pair already in the web app.

**Test condition:** dialling the test shortcode in the simulator and completing the flow returns the same verdict, for the same farmer and depot, that the web app shows, within the response-time budget above.

**Owner:** open.

---

## Milestone B: Location / GPS depot suggestion

**What it proves:** the app can point a farmer toward the nearest depot without him first knowing which one to pick, closing the gap between "here's a list" and "here's the one near you."

**Why the data doesn't exist yet:** no public list of depot or agrovet coordinates was found anywhere in the research behind this build, only the count (103 NCPB depots, 281 last-mile points nationally). The demo depots already in the app are named after real towns, though, so an honest interim dataset is a small hand-built table of approximate town-centre coordinates for those towns, clearly labelled as approximate, not the depot's actual address.

**Build steps:**
1. Add a "use my location" control to the check screen using the browser's Geolocation API, which requires the user to grant permission.
2. Build the small approximate-coordinate table for the demo depots' towns.
3. Compute straight-line distance from the farmer's position to each authorised depot (the haversine formula, plain JavaScript, no backend needed) and sort the depot picker so the nearest authorised one is suggested first.
4. Fall back to manual selection, by county or ward, when permission is denied or the API is unavailable, which is common on shared or demo devices. This fallback is worth building well, not as an afterthought: KIAMIS itself organises farmers by ward rather than GPS point, so a ward-level picker is arguably the more realistic long-run design anyway, with live GPS as a convenience layered on top.

**Test condition:** on a phone with location permission granted, the suggested depot is the nearest authorised one in the demo set by straight-line distance to its town centre; on denial, the manual picker appears and the rest of the flow is unaffected.

**Risk worth naming out loud if this demos live:** a judge's own device may deny or mis-report location in the room. Don't build the pitch's critical path through a live permission prompt; have the manual fallback ready to show instead.

**Owner:** open.

---

## V2 and beyond: other directions worth naming, researched, not scoped to build

Raised per the team's request for wilder provisioning ideas. Each is grounded in either the persona work already done or the infrastructure research behind Milestone A, and flagged where a claim still needs its own verification before anyone commits to it.

**A WhatsApp channel for the proxy.** The persona document already establishes that the proxy runs the household's WhatsApp daily. A bot on that channel, rather than a link to a separate page, meets him where he already is, and Africa's Talking's own platform bundles SMS, USSD, and other channels under one account structure, which suggests the operational relationship from Milestone A would extend here without starting over. Worth scoping properly once Milestone A actually ships, not before.

**A Swahili voice line (IVR).** The persona document's own design principle says to assume the answer will be read aloud, and the farmer persona "reads English slowly, thinks in Swahili." A voice line read out in Swahili would serve him directly, without needing a literate proxy at all, which is more inclusive than the current smartphone-first design, not just an additional channel. Flagged honestly: this session did not confirm the specifics of a Voice API offering the way Milestone A's USSD claims were confirmed from primary and secondary documentation, so that needs its own verification pass before it goes on a real roadmap.

**An extension officer batch mode.** The persona document names her as a distribution multiplier, answering the same questions for dozens of farmers a day. A mode that runs many names against many depots at once, from a barraza or a county desk, turns one conversation into dozens of resolved questions, the single highest-leverage distribution mechanism named anywhere in the product definition, and it's a straightforward extension of the existing rule engine, not new mechanism.

**An SMS-forwardable citation.** One of the open questions from the founding problem document, whether the citation needs to work offline or as SMS text, has an obvious answer once the proxy-and-farmer split is taken seriously: a plain-text version of the clerk screen the proxy can forward directly to the farmer's own feature phone means the farmer holds evidence even if he never touches a smartphone himself.

**A live depot queue signal.** The single sharpest piece of evidence behind this whole build, the Mt Elgon farmer who reached the depot at 4am and still found seven people ahead of him, isn't actually solved by an eligibility check alone; knowing you're eligible doesn't shorten the queue. A crowdsourced or extension-officer-reported "how busy is this depot right now" layer would target that directly. Flagged as the hardest of these to build well: it needs a real base of reporters before the data means anything, and it's worth a second look at whether it's still "an information layer over an existing scheme" or starts to look like something closer to live operations tooling.

**A price-integrity feedback loop.** The teammate document's "second exposure," that a farmer who doesn't know the gazetted price can't tell fair from inflated, is only half-closed by showing him the gazetted price. Letting farmers report what they were actually charged, building a public record over time, closes the other half. Flagged deliberately as double-edged: this starts to resemble a complaint or accountability mechanism, which sits closer to the line the founding document draws around "not a new institution" than any of the other ideas here. Worth a real conversation before it's treated as an easy yes.

**The same pattern applied to other schemes.** Nothing about the rule engine is fertilizer-specific: eligibility, gaps, and cost are the same three-question shape behind SHA/NHIF registration status, HELB disbursement status, or a cash-transfer programme like Inua Jamii. Given the stated purpose of this project is leverage, proving the pattern generalises past one scheme is arguably a bigger story than perfecting this one.
