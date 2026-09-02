# Pitch Narrative

The talk track for the live demo. Opens with the fair-price exposure, not the wasted-trip framing, per the plan-review decision recorded in [FOUNDATION.md](FOUNDATION.md) §9. Roughly 90 seconds of talking plus the live demo; adjust pacing to the room, don't cut the opening line.

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

## 5. Close, honestly (10 seconds)

> Two more pieces are scoped, not built: a USSD channel for feature phones, and GPS-based depot suggestion. Both are fully specified and tracked on GitHub for the team to pick up. Whether they made today's cutoff came down to hours, not ambition, and that call is on the record, not hidden.

If neither B nor A shipped by the time you're presenting, say so in these terms. Don't imply either is live if it isn't; the honest version of this line is stronger than a vague one, see the Decision Log entry on this exact tradeoff.

---

## If something breaks live

Switch to the static fallback (see [PROGRESS.md](PROGRESS.md) Step 6) and say so plainly: "the network's dropped, here's the same flow from a moment ago." Don't try to debug on stage.
