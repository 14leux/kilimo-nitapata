# Pitch Narrative

The talk track for the live demo. Opens with the fair-price exposure, not the wasted-trip framing, per the plan-review decision recorded in [FOUNDATION.md](FOUNDATION.md) §9. Roughly 2 to 2.5 minutes of talking plus the live demo; adjust pacing to the room. Don't cut the opening line (section 1) or the scale pivot (section 5), those are the two moments that actually change how the room hears the rest, cut from the demo walkthrough (section 3) first if you're short on time.

**Sharpened one-line value proposition**, use this as a slide title or a spoken anchor if you need one sentence: *"Kilimo, Nitapata turns one officer's release into 1,800 farmers who all see the same number, at the same time, before anyone at the counter gets a chance to change the story."*

---

## 1. Open (15 seconds)

> A registered farmer walks up to a fertiliser depot counter. He's been told he'll get a subsidised bag. What he can't tell, standing there, is whether the price he's being quoted is the real one, or an inflated one, because he never saw the gazetted price before he made the trip.
>
> That's the exposure this app closes. Not "did he waste a trip," though that happens too, but "can he actually defend himself at the counter."

Say the line the app's own problem screen opens with: **"He can't tell a fair price from an inflated one."** Consistency between the pitch and the product matters here, a judge who opens the link mid-pitch should see the same framing, not a different one.

---

## 2. Ground it (15 seconds)

> This isn't hypothetical. Reporting from 25 August found a farmer at his depot by 4am who still had seven people ahead of him. Knowing you're eligible doesn't shorten that queue, but knowing before you travel, and being able to prove the price once you're there, changes what the trip costs you if something's wrong.

This is the Mt Elgon anecdote, already in the app's problem screen, cited to source 5. Don't add a number here that isn't in the app, if a stat isn't on screen, don't say it out loud either.

---

## 3. Live demo (45 to 60 seconds)

Walk through, don't narrate the code:

1. **Pick a farmer and depot, get a verdict.** Show a Served case first, fast, clean. "Every one of these six checks, and this price, traces to a named, dated source, not a guess."
2. **Switch to a Conditional case** (Otieno K. is a good one, single clean gap). "This is the part most tools miss, it doesn't just say no. It tells him exactly what's missing, one thing, not a wall of jargon."
3. **Click "Show this at the counter."** This is the actual point of the product. "This is what he holds up. Big type, one blocking item, the citation. This has to survive a real conversation with a clerk who has his own register and his own incentive to say no."

If you only have time for one screen, make it this one. It's the product's stated design goal, not a bonus feature.

---

## 4. What it proves, in order (10 to 15 seconds)

Say these in this order, they're the app's own stated demo narrative, see FOUNDATION.md §2.4:

1. The verdict is never guessed. Every claim traces to a named source, shown inline and in a sources ledger.
2. It knows the difference between "you're missing something" and "this depot won't serve anyone," and says which one is blocking you.
3. The answer survives contact with the person who actually decides, the clerk, not just an accuracy claim in a demo.

---

## 5. The scale pivot (15 to 20 seconds)

Added 2 Sep after a council review specifically on sustainability, see `council-transcript-20260902T173000.md` for the full reasoning. This is the part that answers "how does this survive past today," don't skip it for time, it's the difference between a demo and a plan.

> This isn't just a farmer app. A teammate independently built the other half: a sub-county agricultural officer opens a release window, the same engine runs every farmer on her list, and one press sends everyone the same status, at the same moment, before anyone at the counter gets a chance to change the story.
>
> Kisumu county's own reported extension officer-to-farmer ratio is one to eighteen hundred. That's the leverage this closes, one release, not eighteen hundred separate conversations, for under a dollar a farmer across SMS, WhatsApp, or USSD.

Say the number. "One to eighteen hundred" and "under a dollar" are both real, both citable, both land in a room faster than the mechanism does.

> We haven't asked a real officer yet whether that helps her or threatens her, whether a system that timestamps exactly when she acted is a convenience or a liability to her specifically. That's the first thing we test next, not a funding round.

This line is doing real work, not just humility. It preempts the sharpest question a good judge could ask ("won't someone not want this transparency?") by naming it first. See the council transcript's Trap Detector section for why this matters more than it looks like it should.

---

## 6. Close, honestly (10 seconds)

> The USSD channel and GPS depot suggestion, both scoped as stretch goals, both actually shipped. USSD runs against a working simulator hitting the real deployed endpoint, live in the app right now, we don't have a registered shortcode yet, that needs an Africa's Talking account this team doesn't have. Location suggestion is fully live.

Say this only if it's still true when you present, check PROGRESS.md's status table first. If something regressed, say what's actually true instead, a wrong claim here is worse than an honest gap.

---

## If something breaks live

Switch to the static fallback (see [PROGRESS.md](PROGRESS.md) Step 6) and say so plainly: "the network's dropped, here's the same flow from a moment ago." Don't try to debug on stage.
