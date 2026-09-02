# 04 Data flow

Everything server side is a Vercel function under `api/`. Each imports `engine.js`. No function computes a verdict itself.

## Merging register and store
`lib/register.js` (server only):
```
loadFarmers(sid) -> FARMERS.map(f => ({ ...f, ...approvalOverlay(sid, f), season: loadSeason(sid) }))
```
`evaluate(farmer, depot, season)` in engine.js gains an optional third argument. If `season && !season.subsidyReleased`, verdict is danger with blocking `{ key: "subsidy", title: "Subsidy not yet released by government" }`. Existing two-argument calls behave exactly as today.

## API contracts
All JSON. Officer endpoints require header `x-officer-passcode`. Farmer endpoints need only the token.

| Method, path | In | Out | Notes |
|---|---|---|---|
| GET `/api/board` | passcode | `{ season, farmers: [{ id, name, depot, verdict, blocking, delivery }] }` | Computes live from register plus overlay; not from snapshots |
| POST `/api/season` | `{ action: open | release | close, subsidyReleased?, pricePerBag? }` | `{ season }` | `release` is handled by /api/release, this only changes flags |
| POST `/api/approval` | `{ farmerId, reqKey, signed, signedBy }` | `{ approval, farmer verdict }` | Appends history; if season released, marks farmer `dirty` |
| POST `/api/release` | `{ mode: all | updates }` | `{ releaseId, sent, failed, demo, noPhone, results: [...] }` | Writes snapshots, sends messages, updates season |
| POST `/api/retry` | `{ farmerId }` | `{ results }` | Re-sends latest snapshot |
| GET `/api/status?token=` | token | `{ snapshot, newer: boolean, season: { name, status } }` | Farmer page; masks nothing sensitive because snapshot has no phone |
| POST `/api/ussd` | AT form body | text | Existing menu plus "My status" branch reading snapshots |
| POST `/api/reset` | passcode | `{ ok }` | Re-seeds the season from engine.js |

## Release sequence
1. Officer POST `/api/release { mode }`.
2. Function loads season; refuses unless `open` or `released` and `subsidyReleased`.
3. Loads merged farmers. For `updates`, keeps only those marked `dirty` or with no snapshot.
4. For each farmer: `result = evaluate(farmer, depot, season)`, `snapshot = buildSnapshot(result, farmer, depot, season)`, `text = releaseText(snapshot)`. Writes snapshot (new version).
5. Sends: if `farmer.demo`, log `demo`. Else if no phone, log `no-phone`. Else try WhatsApp (`whatsapp:+...`), log; try SMS, log. Twilio errors are caught per call.
6. Clears `dirty`, sets season `released`, `releasedAt`.
7. Returns per-farmer results. Board refetches.

Time budget: 6 farmers times 2 channels is 12 Twilio calls, run with `Promise.allSettled` in batches of 4. Well inside a Vercel function timeout.

## Farmer page sequence
1. Message link `https://<host>/#status/<token>`.
2. Page reads token from hash, GET `/api/status?token=`.
3. Renders snapshot (never recomputes). Caches response in `localStorage` under `kn.status.<token>` and the service worker caches the API response for offline.
4. If `newer` is true, shows the refresh line.

## USSD "My status" sequence
1. First menu gains option 0: "Hali yangu / My status".
2. Asks for farmer ID (e.g. 2291). Looks up snapshot by farmer id in the active season.
3. Replies END with `snapshot.text.sw` trimmed to the USSD budget, no link.
4. If no snapshot: "Hakuna hali bado. Subiri ujumbe wa afisa." / "No status yet. Wait for the officer's message."

## Locked decisions
- Snapshots are written before any message is sent, so a send failure never leaves a farmer without a status.
- The board reads live, the farmer page reads snapshots. That is the intended asymmetry: the officer sees what will be sent, the farmer sees what was sent.
- `releaseText()` lives in engine.js and is tested like `ussdText()`.
