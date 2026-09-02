# 07 Architecture

## Shape
Static PWA plus a handful of Vercel functions plus one Redis. Same repo, same deploy.

```
index.html      one file, hash router, modes: officer | farmer   (client)
strings.js      EN/SW strings                                     (client)
engine.js       data seed, evaluate, blockingItem, clerkSummary,
                ussdText, releaseText, buildSnapshot              (client and server)
ussd.js         USSD menu, pure                                    (server)
lib/store.js    Redis access, key helpers, seed/reset              (server)
lib/register.js merge seed + overlay, loadSeason                   (server)
lib/notify.js   Twilio send, per-channel, never throws             (server)
api/board.js, season.js, approval.js, release.js, retry.js, status.js, ussd.js, reset.js
sw.js           network-first HTML, cache-first modules with ?v=, cache /api/status responses
```

## Module boundaries
- `engine.js` imports nothing. Server modules import it. The client imports it. Nothing else knows the rules.
- `lib/*` is server only, never shipped to the browser. Vercel bundles per function.
- `api/*` files are thin: parse, auth check, call lib, respond. No logic.
- The client never talks to Twilio or Redis.

## Dependencies
`twilio`, `@upstash/redis`. Nothing else. Node 20 on Vercel, ESM (`"type": "module"` already set).

## Environment
```
OFFICER_PASSCODE
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
TWILIO_SMS_FROM        the trial Twilio number, E.164
TWILIO_WHATSAPP_FROM   whatsapp:+14155238886 (sandbox)
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
PUBLIC_BASE_URL        https://<deploy>, used in message links
```
`.env.example` committed; `.env.local` ignored.

## Auth
Officer: one shared passcode in a header, stored in `sessionStorage` on the client. Labelled "demo passcode" in the UI and the docs. Farmer: per-farmer random token in the link. Both are v1 demo measures and say so.

## Deploy
Vercel, framework Other, no build. `api/` auto-detected. Redis from the Vercel Marketplace (Upstash), env vars injected. Twilio env vars added by hand.

## Local run
`vercel dev` for the functions (needs `vercel` CLI, or `npx vercel dev`). `npm run dev` keeps serving the static page for UI work without a backend, with the farmer page falling back to a stub snapshot when `/api/status` is unreachable, clearly badged "stub".

## Tests
`node --test` stays. New: `test/release.test.js` (releaseText budget and content for every farmer; snapshot shape; gate ordering), `test/ussd.test.js` extended for the status branch, `test/notify.test.js` with Twilio mocked (never calls the network in tests).

## Security floor for a hackathon
Passcode compare is constant time. Tokens are 12 chars from `crypto.randomBytes`. Phone numbers never leave the server unmasked. Reset endpoint requires the passcode. Nothing else; this is not the place for rate limiting.

## Locked decisions
- Redis over a file or in-memory: in-memory dies between Vercel invocations, and the demo needs two devices to agree.
- Snapshot on the server, not the client, so the farmer cannot be shown a status the officer never released.
- One HTML file stays. Codex's split is deferred to after the hackathon (08).
