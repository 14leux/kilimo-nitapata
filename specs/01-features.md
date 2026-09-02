# 01 Features

Every feature as a user story, behaviour, and states. Numbered so tickets can point at them (F1.2 etc). Verdict colours map to the engine: green = `ok`, yellow = `warn`, red = `danger`. Nothing here is computed anywhere except `engine.js`.

## F1 Officer board

**Story:** as the sub-county agricultural officer, I open the season and see every farmer in my register with a colour and the one thing blocking them, so I know who to chase before release.

Behaviour:
- F1.1 Board lists every farmer in the register with: name, ID, assigned collection point, verdict colour, blocking item (or "clear"), last message status.
- F1.2 Filter chips: All, Green, Yellow, Red, Not reached. Counts on each chip.
- F1.3 Tap a row: farmer detail sheet with every requirement, each approval with signed/unsigned and who signs, allocation, cost lines, the farmer's phone (masked), message history.
- F1.4 Sort: red first by default, then yellow, then green. Officer can switch to alphabetical.

States: empty register (should not happen with sample data, show "no farmers in this sub-county"); loading; error reading the store ("could not load the register, retry").

## F2 Season and subsidy gate

**Story:** as the officer, I open a season and declare whether the government has released the subsidy, so no farmer is told to travel before there is anything to collect.

Behaviour:
- F2.1 Season has status `draft`, `open`, `released`, `closed`. Only one season active at a time in v1.
- F2.2 `subsidyReleased` is a boolean the officer sets. While false, every farmer is red with blocking item "Subsidy not yet released by government", regardless of their own record. This is a new engine gate, ranked above depot authorisation.
- F2.3 Officer can set the subsidised price per bag for the season, defaulting to the engine's reported price with its source. Changing it is logged.

States: no season (board shows "Open a season" as the only action); draft; open (board live, no messages yet); released (messages sent, board shows delivery); closed (read only).

## F3 Approvals

**Story:** as the officer, I mark an approval as signed when the chief or sub-county office signs, so the farmer's status flips without anyone editing a spreadsheet.

Behaviour:
- F3.1 Each requirement that is a signature (`acChief`, `subCounty`) becomes an approval record: `signed` boolean, `signedBy` free text, `signedAt` ISO date.
- F3.2 Officer toggles signed from the farmer detail sheet. Toggle asks for the signer name once.
- F3.3 Toggling re-evaluates the farmer. If the season is `released`, a fresh status message is queued to the farmer automatically (F5).
- F3.4 Non-signature requirements (`registered`, `idLinked`, `acreage`, `withinLimit`) are shown but not editable in v1. They come from the register.

States: unsigned, signed, changing (spinner on the toggle only), failed to save (toggle reverts, toast).

## F4 Release

**Story:** as the officer, I press Release and every farmer gets their status on the channels they have, so nobody learns their situation at the counter.

Behaviour:
- F4.1 Release button on the board, enabled only when season is `open` and `subsidyReleased` is true. If false, the button says why.
- F4.2 Confirm sheet: "Send status to N farmers by WhatsApp and SMS. This cannot be unsent." with the counts per colour.
- F4.3 On confirm: for each farmer, the engine result is computed server side, stored as a `status` snapshot, and one message per available channel is sent (F5). Season moves to `released`.
- F4.4 Board updates delivery per farmer: queued, sent, delivered, failed, no phone. Failed rows are tappable to retry.
- F4.5 Re-release: after any change (approval, subsidy, price), officer can press "Send updates" which only messages farmers whose status snapshot changed.

States: idle; confirming; sending (progress N of M); done (summary); partial failure (list of failed, retry all).

## F5 Farmer message

**Story:** as the farmer or proxy, I get one message that tells me the colour, where to go, what I will pay, and what is still unsigned, in words I can read aloud.

Behaviour:
- F5.1 Body is `releaseText(status)` from the engine: verdict word in Swahili and English, collection point, amount to pay per bag and total for allocation, pending approvals by name, one line on what to do, and a link to the farmer status page. Under 320 characters for SMS (two segments), no limit concern on WhatsApp.
- F5.2 WhatsApp first if the phone has joined the sandbox, else SMS. In v1 both are attempted where possible and the log records each.
- F5.3 The link opens the farmer status page (F6) with a per-farmer token. No login.
- F5.4 USSD: the existing menu gains a first option "Hali yangu / My status" which asks for the farmer's phone number's last 4 digits plus ID, then returns the stored snapshot. Same text as SMS minus the link.

States: sent, delivered, failed (provider error stored), no phone on record.

## F6 Farmer status page

**Story:** as the farmer or proxy, I open the link and see exactly what the officer's board says about me, so the counter has nothing to argue about.

Behaviour:
- F6.1 Route `#status/<token>`. Reads the latest snapshot from the API. Works offline after first load (service worker caches the last snapshot per token).
- F6.2 Layout is the existing answer screen with two additions: the cost card (F7) and an approvals card listing each signature with signed or pending and who signs.
- F6.3 "Show at the counter" is the existing counter view plus the cost lines and the release timestamp: "Released by sub-county office, 2 Sep 2026 14:05".
- F6.4 If the snapshot is older than the register (an approval changed after release), page shows a "newer status available, pull to refresh" line. Never silently mixes old and new.
- F6.5 The existing self-check (pick any farmer and depot) stays reachable from the top bar as "Check another".

States: loading; loaded; offline with cached snapshot (badge); offline with nothing cached ("open once with data first"); invalid token ("this link is not valid, ask your officer").

## F7 Cost lines

**Story:** as the farmer, I see every shilling before I travel, with the source, so the clerk cannot add a line at the counter.

Behaviour:
- F7.1 Lines: subsidised price per bag (season value, default engine reported price with source); bags allocated and remaining; total to pay = price times remaining bags; subsidy statement as text ("government covers the rest, reported 40%" with source 4) not as a computed number unless a source gives the full market price.
- F7.2 Every line carries a citation or the note "set by sub-county office for this season".
- F7.3 A fixed line: "No other fee is payable at the depot." Sourced to the redemption process (source 2). If no source supports it, the line reads "No other fee is listed in the published process."

States: price from engine; price overridden by officer (shows "season price").

## F8 Mode switch

**Story:** as anyone opening the app, I pick whether I am the officer or checking as a farmer, and the app remembers.

Behaviour:
- F8.1 First open shows two cards: "I am the sub-county officer" and "I am a farmer or checking for one". Remembered on device.
- F8.2 Officer mode asks for a demo passcode (single shared secret in env). Not real auth, labelled as such.
- F8.3 Switch in the top bar.

## Locked decisions
- The engine is the only place a verdict, blocking item, or cost line is computed. Server and client both import it.
- Release stores a snapshot; the farmer page shows the snapshot, never a live recompute, so both sides are looking at the same frozen record.
- Officer edits are limited to: season status, subsidy released, season price, approval signatures. Nothing else in the register is editable in v1.
