# 02 Edge cases

Grouped by where they bite. Each has the required behaviour, not just the risk.

## Release and messaging
- E1 Twilio call fails for one farmer: record `failed` with the error string, continue with the rest, show partial failure summary with retry. Never abort the whole release.
- E2 Farmer has no phone on record: status snapshot still stored, delivery marked `no phone`, farmer can still be shown their status by the officer from the board (F1.3).
- E3 Phone has not joined the WhatsApp sandbox: Twilio returns an error for that channel; SMS still attempted; log shows which channel worked.
- E4 Trial account limits: only 5 verified numbers. Sample register carries at most 5 real phones; other farmers have placeholder numbers flagged `demo: true` and are skipped by the sender with delivery marked `demo, not sent`. The board says so plainly.
- E5 Kenya SMS filtering: message may be delayed or dropped. Status stays `sent` until a delivery webhook says otherwise; v1 has no webhook, so the board says "sent to network" not "delivered".
- E6 Officer presses Release twice: second press is idempotent within the same season state; the button disables while sending and a release id is stored.
- E7 Send updates with nothing changed: button disabled with "no changes since last send".
- E8 Message body over SMS budget: `releaseText()` is tested for every farmer in the register to stay under 320 chars; if a name or depot pushes it over, the test fails at build time, not at send time.

## Season and gate
- E9 Subsidy released flipped back to false after release: every farmer's snapshot becomes red on next "Send updates". Confirm sheet warns "this will tell N farmers not to travel".
- E10 Price changed after release: cost lines in new snapshots change; old snapshots are kept with their price for audit. Farmer page shows the latest.
- E11 No active season: farmer status page shows "No collection season is open" rather than an error.

## Approvals
- E12 Approval toggled by mistake: toggling back is allowed, both changes are logged with time and signer name.
- E13 Approval signed for an unregistered farmer: allowed in data, but the verdict stays red on registration; the board shows the blocking item correctly because the engine ranks registration first.

## Farmer page
- E14 Invalid or revoked token: friendly message, no data leak, no hint whether the token ever existed.
- E15 Token shared to a third party: accepted risk in v1; the page holds no more than the SMS already did. Noted in open questions.
- E16 Offline, snapshot cached: shows cached snapshot with "as of <time>" badge. Counter view works.
- E17 Offline, nothing cached: clear instruction, self-check still works because it needs no network.
- E18 Two languages: farmer page opens in the language of the message that was sent (officer sets default per farmer from the register, fallback Swahili).

## Store and concurrency
- E19 Two officers editing at once: v1 has one officer per sub-county; last write wins, every write is logged.
- E20 Store unavailable: officer board shows retry; release refuses to start; farmer page falls back to cached snapshot.
- E21 Sample data reset: an admin endpoint guarded by the passcode resets the register to `engine.js` seed data for repeated demos.

## Engine
- E22 Engine gate ordering is tested: subsidy gate, then depot authorisation, then registration, then the ledger. Any change to order fails a test.
- E23 Every farmer in the seed register evaluates at every depot without throwing, as today.

## Demo room
- E24 No network in the room: officer board is server backed, so the static fallback captures (FOUNDATION step 6) must include the board. Farmer page has the cached snapshot.
- E25 Judge's phone is not a verified number: show the message on a team phone that is; never promise a live send to an unverified number.
