# Scripted Q&A

Answers to the questions most likely to derail the pitch if improvised. Rehearse these, don't wing them. Each answer states the honest limit rather than papering over it, per the project's own no-guessing rule, see [FOUNDATION.md](FOUNDATION.md) §5.2.

---

## "Where does this data actually come from? Is it official?"

No. The primary source, the gazette notice and KIAMIS's own documentation, was not publicly retrievable when this was built. Every requirement, gate, and price in the app is transcribed from five named secondary sources: news reporting and analysis pieces, each cited inline and listed in full in the app's own Sources section. Where two sources disagree, as they do on price, both figures are shown with their date, not one asserted as correct.

That's a real limitation, and the app says so out loud in its own "How this tool decides" panel, it's not something we're hoping nobody asks about. The alternative, staying silent about sourcing or presenting the demo data as an official feed, would be the actual problem. A production version of this would need a real data-sharing conversation with MoALD or KIAMIS, that's an open item, not a solved one.

**Why this is scripted:** if a judge who knows the space says "this isn't from the gazette," the honest answer needs to land as "correct, and here's why that's still a defensible build," not as a scramble.

---

## "Why doesn't it give any farming or fertiliser advice?"

Deliberately excluded. Recommending fertiliser types or quantities based on soil condition would require grounding in agronomic science the team doesn't have, and getting it wrong carries real harm, a farmer acting on bad input advice loses money and a season. That risk sits outside what five news articles can responsibly support, so it's out of scope by design, not by omission.

This app answers a narrower, verifiable question: given what the scheme's own rules say, does this farmer clear this depot, and what does he still need. That's checkable against the sources we have. Whether he should be using DAP or NPK on his particular soil is not, and pretending otherwise would be the actual mistake.

**Why this is scripted:** the instinct on stage is to seem more capable than the build is, listing this as a considered exclusion instead of an admission is the whole difference.

---

## "KIAMIS already has USSD, `*6163#`. Why build another one?"

That code handles registration and voucher delivery, confirming you're in the system and getting your voucher issued. It doesn't answer "will this specific depot serve me today, and what's the one thing standing in my way," which is what this app checks. They're not competing, `*6163#` gets you into the scheme, this checks your status once you're in it, on a feature phone, without a smartphone or data bundle, which is the reach this app is trying to extend past its current smartphone-first build. See [MILESTONES.md](MILESTONES.md), Milestone A, for the technical case.

**Why this is scripted:** this is the single most likely "gotcha" question from anyone who's actually used the real scheme, and it has a real answer, it just needs to be ready, not discovered live.

---

## Adding a question

Copy this block, fill it in, and keep the same shape: the honest answer first, then a one-line note on why it needed scripting rather than improvising.

```
## "<question, as a judge would actually ask it>"

<the answer, plain, no hedging beyond what's actually true>

**Why this is scripted:** <what goes wrong if this is improvised instead>
```
