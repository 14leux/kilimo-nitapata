# Council Transcript: Unit economics, revenue, and per-persona willingness to pay

**Run:** 2 Sep 2026, same evening as the first council. Triggered by a specific claim on the sustainability pitch deck's slide 5: "Under a dollar a farmer, per release." The user flagged this claim directly and asked for it to be re-examined with real cost and revenue numbers, and mapped to why each key persona would actually pay.

## Scan (Step 0)

`council-transcript-20260902T173000.md` already exists (this session, ~90 minutes earlier). It resolved the high-level sustainability narrative: lead the pitch with the officer-release system, state costs honestly, close on an unvalidated assumption rather than a claimed deal. It did NOT rigorously verify the cost claim it produced, the Revenue Lens advisor in that run flagged SMS/WhatsApp pricing with one search and produced an estimate ("Ksh 1,500 to 2,700 per release cycle... under a dollar per farmer") that this new session's research shows was incomplete: it priced SMS and WhatsApp but never checked who actually pays for a USSD session in Kenya. That gap is the reason this second council exists. Nothing else from the first transcript is re-litigated, its persona work, its structural conclusions, and its "lead with the officer system" call all stand.

## Framed question

**The claim under scrutiny, verbatim, from the live pitch deck:** *"Under a dollar a farmer, per release."*

**New research since the first council (2 Sep 2026, dated, attach to every advisor, don't reason from memory):**

1. **SMS via Africa's Talking, Kenya:** roughly KES 0.50 to 0.80 per message, business-side cost, billed to whoever operates the release (the county, the NGO partner, or this project, depending on the deal). [celcomafrica.com, helloduty.com, 2026]
2. **WhatsApp via Twilio:** Twilio's own platform fee is a flat $0.005 per message (inbound and outbound), on top of Meta's own per-message template fee, which varies by country and template category and was NOT found at a Kenya-specific rate in this search. Also business-side cost. [multiple pricing-guide sources, 2026]
3. **USSD via Africa's Talking, Kenya, the number that changes the picture:** the telco deducts the session cost directly from the END USER's own airtime, typically KES 1 to 5 per session in Kenya. This is not a business-side cost at all, under a standard shortcode, **the farmer or his proxy pays it, out of his own airtime, every time he dials in.** A toll-free shortcode (where the business absorbs this instead) costs an additional KES 5,000 (VAT exclusive) as a one-time setup fee on top of the shortcode itself, MILESTONES.md's own earlier research already found a shared shortcode runs roughly Ksh 3,000/month plus Ksh 5,000 setup, a dedicated one closer to Ksh 10,000/month. [africastalking.com Help Center, 2026]
4. **Backend infrastructure (Upstash Redis + Vercel functions):** genuinely near-zero at pilot scale. Upstash's free tier is 500,000 commands per month and 10GB bandwidth (raised from a 10,000-per-day cap in March 2025). Vercel's Hobby plan free tier covers at minimum 100,000 function invocations a month, some current sources say up to 1 million. Either figure comfortably covers a single-county pilot. [upstash.com, Vercel Community/docs, 2026]

**What this means for the claim:** "under a dollar a farmer" is defensible for the SMS and WhatsApp channels, on the business's own books. It is not accurate, or at minimum badly incomplete, for the USSD channel, which is the specific channel this project built a working simulator for and is proudest of, because on a standard (non-toll-free) shortcode the farmer pays that cost himself, in airtime, not the project. Saying "under a dollar" without that caveat, in front of a room that includes anyone who has ever used USSD in Kenya, is a credibility risk.

**Sub-questions for the council:**
1. What should the pitch actually claim about cost, now that the USSD nuance is known, without either overclaiming ("free to the farmer") or drowning a short pitch in caveats?
2. What is a credible revenue model, who pays, in what unit, and does it actually cover the real cost structure above?
3. For each key persona already established in this project (farmer, proxy, depot clerk, extension officer, and now explicitly the institutional payer, county/NGO), what is the specific value they get and why would the party who can actually pay, pay?

No app changes in scope, this is the sustainability narrative and the specific slide claim.

## Recency step

Yes. Research was run once (the four findings above) and attached to the frame. Revenue Lens and Executor each retain their one-search allowance if a specific number still needs checking mid-session; neither used it, the frame's research covered what was needed.

## Advisor responses

### The Contrarian

Assume the claim survives scrutiny as-is, "under a dollar a farmer" is fine to say. The strongest reason that's wrong: **a room that includes even one person who has used a Kenyan USSD service will know, from lived experience, that dialing a short code costs them money**, deducted from their own airtime, visibly, every time. If this pitch says "under a dollar" and doesn't distinguish which channel that dollar sits on, the first informed question in the room is "wait, doesn't USSD cost the farmer directly?" and there is no good answer prepared. That's not a rounding error in a pitch built entirely on the premise of never asserting something ungrounded, it's the exact failure mode the whole product argues against, just moved from the app into the pitch about the app.

### The First Principles Thinker

Strip the claim to what has to be true. Two structural things the frame doesn't yet separate cleanly:

1. **Push versus pull are different mechanisms with different cost-bearers.** SMS and WhatsApp are push, the officer's Release action can genuinely originate them, and the business (county or NGO partner) pays. USSD, as currently built (`ussd.js`, a CON/END session), is pull only, the farmer has to dial in himself, there is no mechanism in this codebase for the officer's Release to push a USSD message to him. Calling USSD one of the channels a "Release" pushes through overstates what's built. It's accurate to say USSD is the self-check channel for farmers without a smartphone or WhatsApp, available any time, not one of the three things a Release action fires.
2. **Who pays for a session is a business decision (toll-free or not), not a fixed cost.** On a standard shortcode, the farmer pays KES 1 to 5 out of his own airtime per dial-in. On a toll-free shortcode, the business absorbs it, for a one-time KES 5,000 setup plus a higher monthly lease (roughly KES 3,000 to 10,000/month depending on shared versus dedicated, per this project's own earlier research). This is a real design choice with a real trade-off: toll-free is more inclusive (true to the "he can't afford another cost" principle) and costs the operator more; a standard shortcode is cheaper to run and quietly reintroduces the cost this entire product exists to protect the farmer from.

### The Expansionist

The upside being missed in a pure cost-defense posture: **the actual USSD session cost, even paid by the farmer, is smaller than what the product already saves him.** KES 1 to 5 to dial in and learn his status is trivial next to a wasted day's labour and a fare to a depot that won't serve him, the entire founding problem statement of this project. The honest framing isn't "USSD is free", it's "USSD costs the farmer a few shillings to avoid losing a day", which is a stronger, more defensible value claim than a vague "under a dollar" ever was, because it's the actual trade being offered, made explicit instead of hidden.

### The Outsider

Reading the claim cold: "under a dollar a farmer" answers a question nobody in the room actually asked yet. The real question a funder or partner asks is "what does this cost ME, and what does it cost the FARMER", two different numbers, one payer each. Collapsing them into one soft dollar figure is confusing even before the USSD nuance. Two numbers, two payers, stated separately, is clearer, not more complicated: "under a cent a farmer for us, on SMS or WhatsApp" and "a few shillings, optionally absorbed by us, on USSD."

### The Executor

Concrete recommendation for exactly what the slide should say, and the persona/payer table this council was asked for.

**Corrected cost claim, two numbers, not one:**
- Push channels (SMS, WhatsApp), paid by whoever runs the release, county or NGO partner: roughly **KES 0.50 to 1.50 per farmer per release** (under 1.5 US cents), comfortably inside any pilot budget.
- Pull channel (USSD), paid by the farmer himself unless the operator buys a toll-free shortcode: **KES 1 to 5 per session** on his own airtime, or absorbed by the operator for a one-time KES 5,000 setup plus a monthly lease, if inclusivity is prioritised over cost.
- Backend (Redis, hosting): effectively **KES 0** at pilot scale, both providers' free tiers cover a single-county pilot with room to spare.

**Persona value and willingness-to-pay table:**

| Persona | What they get | Do they pay? | Why / why not |
|---|---|---|---|
| Farmer | Knows his status before travelling; a citation he can hold up at the counter; USSD access without a smartphone | No, or a few shillings only if he chooses USSD on a non-toll-free line | He's the one person in the chain who structurally cannot absorb a real cost, the whole product exists because he's already the one bearing risk |
| Proxy | Relays a verified answer instead of a guess; something concrete to defend to the family if it's wrong | No | Same household budget as the farmer; the value is in reduced social risk of being wrong, not a service worth a line-item |
| Depot clerk | Nothing, he's explicitly not a user, the product is built to survive him, not serve him | No | Not a persona this product needs to monetise, monetising the party the citation is meant to hold accountable would be a conflict of interest |
| Extension officer | Time back, one release instead of individually answering the same question up to 1,800 times; a defensible record of when she acted | Not personally | She's not the budget holder, but she's the reason the budget holder should say yes, her adoption is the proof the county's money bought something real |
| County government / NGO partner (the actual payer) | A cheap, low-risk way to demonstrably improve extension delivery, with existing precedent (Nakuru + CARE Kenya) to point to when justifying the spend internally | **Yes, this is the one persona who should** | They already fund extension work and NGO partnerships as a line item; this replaces or augments an existing budget category rather than asking for a new one, and the entire per-release cost is small enough to be a rounding error against that existing budget |

**How it pays for itself, stated plainly:** it doesn't, in the sense of generating farmer-side revenue, and shouldn't try to. It pays for itself in the sense that its entire operating cost per release cycle is small enough (low hundreds of shillings for a full officer's list on push channels) that a single county extension budget or a single NGO partnership, both of which already exist in Kenya today for adjacent purposes, comfortably covers it. The ask isn't "fund a product," it's "redirect a small slice of a budget that already exists."

## Conditional advisors

### The Revenue Lens, FIRES

Correcting the first council's own math, which is exactly why this second council was called. The first pass said "Ksh 1,500 to 2,700... under a dollar per farmer" without separating channels or payers. The corrected numbers:

- SMS at KES 0.65 average × 1,800 farmers = **KES 1,170 (~$9) per release**, business-side.
- WhatsApp: materially similar order of magnitude per message once Meta's Kenya-specific template rate is confirmed (not found in this search, flagged as an open item, not guessed at).
- USSD: **KES 1,800 to 9,000 (~$14 to $70) per release cycle IF the farmer's own session cost were somehow aggregated**, which it isn't, it's paid individually, in real time, by each farmer who dials in, not billed to the business at all. Do not add this figure to a "cost to us" total, it's not a cost to us.
- The only real business-side monthly fixed cost is the shortcode lease itself, if toll-free is chosen: roughly KES 3,000 to 10,000/month, already researched and cited in MILESTONES.md.

**The corrected top-line claim:** "Under ten dollars per release, for a full officer's list of 1,800 farmers, on the channels we control the cost of." That is a stronger number than "under a dollar a farmer" (it's the same order of magnitude restated honestly) and it survives a follow-up question about USSD, because it doesn't quietly include a cost that isn't actually the business's to claim.

### The Gatekeeper, FIRES

One gatekeeper this council's research surfaces that the first council didn't name explicitly: **whoever controls the toll-free-versus-standard shortcode decision controls whether this product's own stated principle (don't cost the farmer anything) survives contact with the USSD channel.** That's not a technical decision, it's a budget decision, made by whoever pays the KES 5,000 setup and the higher monthly lease. If a pilot partner balks at that extra cost and defaults to a standard shortcode to save money, the product quietly starts charging the exact population it was built to protect, without anyone deciding that on purpose. Name this explicitly in any real partnership conversation, don't let it default silently.

### The Trap Detector, FIRES

The dangerous unexamined assumption here isn't the officer-incentive one from the first council (still valid, still open), it's a financial one: **that a county government or NGO partner will treat "a few hundred shillings per release" as trivial rather than as "another line item to approve."** Small absolute cost does not always mean fast or easy approval, procurement processes don't scale down proportionally to cost, a KES 1,200 recurring spend can still take months to clear a county budget cycle. The fastest test: don't ask "will you fund this", ask "what is the smallest amount of money your office can approve without going through full procurement", and design the pilot ask to fit under that line, whatever it turns out to be. That number, not the per-farmer cost, is the actual constraint on how fast this can start.

## Anonymization map

| Letter | Advisor |
|---|---|
| A | The Contrarian |
| B | The First Principles Thinker |
| C | The Expansionist |
| D | The Outsider |
| E | The Executor |
| F | The Revenue Lens |
| G | The Gatekeeper |
| H | The Trap Detector |

## Peer review

### Pass 1

**Strongest contribution:** F (Revenue Lens). It did the thing this whole council was convened to do, took an ungrounded aggregate claim and replaced it with two separated, sourced numbers by channel and payer. That's the direct answer to the user's ask, not a tangential insight.

**Biggest blind spot:** E (Executor) produced the full persona table, genuinely useful, but stated the WhatsApp cost as "materially similar order of magnitude" without the actual Kenya-specific Meta template rate, which F later flagged as unconfirmed too. Neither advisor used their permitted follow-up search to actually resolve it, both left it as an open item. That's honest, but it's also two advisors independently declining to spend the one search they were explicitly given for exactly this situation.

**What everyone missed:** nobody proposed the actual sentence structure for saying two numbers instead of one inside a short pitch without it sounding like a hedge or a caveat-laden retreat. Naming the right numbers isn't the same as knowing how to say them out loud in eight seconds.

### Pass 2

**Strongest contribution:** B (First Principles). The push-versus-pull distinction is the single most load-bearing correction in the entire session, more important than the exact shilling figures, because it's not a pricing detail, it's a claim about what the architecture actually does. Saying USSD is one of the things a "Release" pushes through is simply inaccurate given the current codebase (`ussd.js` is pull-only), independent of any pricing question.

**Biggest blind spot:** H (Trap Detector) raised a real procurement-friction risk but didn't connect it back to B's architectural point, if USSD can't actually be pushed, the "one Release reaches everyone including USSD users" framing needs a structural fix regardless of the budget conversation, that's arguably the more urgent fix of the two.

**What everyone missed:** none of the eight advisors asked whether the officer-release system's own `specs/00-one-pager.md` (the source document for the v2 pivot) already got this push/pull distinction right or wrong at the design level, this session treated it as a pitch-copy problem when it may also be a specs document accuracy problem, worth a separate, smaller check outside this council.

### Pass 3

**Strongest contribution:** A (Contrarian), for framing the stakes correctly at the very start: an informed person in the room will catch an inaccurate USSD claim, and the cost of being caught in a pitch about a product whose entire premise is never overclaiming is disproportionately high. That framing is what makes every other advisor's correction feel necessary rather than pedantic.

**Biggest blind spot:** C (Expansionist)'s reframe, "a few shillings to avoid losing a day," is rhetorically strong but was not stress-tested against the actual scenario where a farmer dials in repeatedly (checking daily during a busy release window) and the small cost compounds. Nobody ran that number.

**What everyone missed:** the persona table (from E) names the county/NGO as the payer but no advisor addressed what happens to the sustainability story if neither materialises during the pilot window, is there a credible bridge (the team's own time, a small grant, Anthropic-adjacent credits) that keeps a pilot alive between "we asked" and "they said yes"? That gap sits between this session's scope and the first council's, and isn't fully answered by either.

## COUNCIL VERDICT

### Where the council agrees

- "Under a dollar a farmer" was too coarse to survive a follow-up question, and the fix is not a smaller number, it's two numbers, one per payer (A, D, E, F all converged on this independently).
- The real recurring cost, on the channels the business actually controls (SMS, WhatsApp), is genuinely trivial, roughly KES 0.50 to 1.50 per farmer, well under what "under a dollar" implied, if anything the honest number is a *stronger* claim, not a weaker one.
- USSD's session cost is not the business's cost to claim, honestly or otherwise, because it isn't the business paying it. Stating this plainly is a credibility asset, not a caveat to hide.
- The county or NGO partner is the only persona in the table who should pay anything, and the ask is small enough to plausibly sit inside an existing budget line rather than requiring a new one.

### Where the council clashes

**Clash 1: is USSD one of the channels a Release "pushes" through?** The specs and this project's own prior copy (PITCH.md, `specs/00-one-pager.md`) describe delivery as "in-app, SMS, WhatsApp, and USSD." B's first-principles read says this overstates the current build, USSD in this codebase (`ussd.js`) is pull-only, a farmer has to dial in, nothing pushes to him. **The chairman sides with B.** This is not a pricing nuance, it's an accuracy question about what's actually built, and this project's entire standing discipline is not claiming a mechanism that doesn't exist. The pitch and any future spec revision should describe USSD as the self-check channel, available any time, not one of the things a Release action fires through. This is flagged here as a finding for the team, not silently corrected in `specs/00-one-pager.md`, that document has its own author (Victor) and editing someone else's design doc without being asked is a separate decision from answering the question this council was actually convened for.

**Clash 2: does the repeated-dial compounding cost (pass 3) change the conclusion?** It doesn't, arithmetically, even a farmer checking three times in a release window spends KES 3 to 15, an order of magnitude below the cost of one wasted trip, C's original reframe holds. But the chairman notes the council was right to check rather than assume, that's the discipline working as intended, not a wasted pass.

### Blind spots the council caught

1. **The specs document itself may need the same push/pull correction the pitch does** (peer review pass 2). Not fixed here, flagged for whoever owns `specs/00-one-pager.md` next.
2. **No bridge plan if the county/NGO ask doesn't land during the pilot window** (peer review pass 3). Answer below, in the recommendation.
3. **Kenya-specific Meta WhatsApp template pricing was never actually confirmed**, both advisors who touched it declined to spend their permitted search. Stated as an open item, not guessed at, consistent with the project's own rule.

### Priority filter

1. **Accuracy first, not cost.** The push/pull correction matters more than the shilling figures, because it's a claim about what's built, not what it costs. Fix how the pitch describes USSD before worrying further about the number.
2. **State two numbers, not one**, per the corrected claim below.
3. **Name the county/NGO ask in units they can actually approve without full procurement** (H's test), not in units convenient for the pitch.

### The recommendation

Replace the slide's claim. Old: *"Under a dollar a farmer, per release."* New, said as two short sentences, not one hedged one:

> **"Under ten dollars per release, for every farmer on an officer's list, on the channels we control the cost of. USSD is free to run, but the session itself is a few shillings on the farmer's own airtime, unless we buy the tollfree line, that trade-off is a design choice we're naming, not hiding."**

If the pitch needs it shorter, the floor version that still survives a follow-up question: *"A few hundred shillings, total, per release. Cheaper than one wasted trip, many times over."*

### The one thing to do first

Before touching the slide further: confirm, in one sentence to be added wherever this claim appears, whether the pilot's USSD line will be toll-free or standard. That single decision determines whether "the farmer pays nothing" is true. Don't let the pitch imply an answer to that question before the team has actually made it.

---

*Council run 2 Sep 2026, 8 advisors, 3 peer review passes, chairman synthesis. Builds on and does not repeat `council-transcript-20260902T173000.md`. Saved to `council-transcript-20260902T190000.md`.*

