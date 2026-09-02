# UI refresh plan: PWA on Vercel, USSD as fallback

Drafted 2 Sep 2026. Scope: the web UI only. `engine.js` stays the single source of truth; this plan adds exports to it, never copies from it. House style holds: no em dashes, every claim cited, sample data always labelled.

## 1. What is wrong with the current page, per persona

The page is a well-written essay with a checker in the middle of it. That serves the pitch, not the four people in `presentation-copy.md`.

| Persona | What they need | What the page does today |
|---|---|---|
| Farmer | The verdict word, in Swahili, big enough to read once | Verdict is section 02, below 900px of English prose |
| Proxy | Something he can read aloud or forward on WhatsApp, and have the farmer trust it | No share, no read-aloud script, no Swahili |
| Clerk | One screen, one number, one dated source | Counter view exists and is good; it is three taps and a scroll away |
| Extension officer | Check many farmers at one depot, fast, repeatedly | Every check resets to the top; nothing is remembered |

Cross-cutting: nothing is remembered between visits, nothing works offline, and there is no manifest, so it cannot be installed. That is what "PWA" has to fix.

## 2. Target shape

One HTML file, still no framework, still no build step. Three screens driven by the URL hash so the back button and sharing both work.

1. **Home = the check.** Who are you checking for, which depot. Depot list grouped by county now, nearest first once Milestone B lands. The problem screen moves behind an "About" link in the masthead; it is no longer page one.
2. **Answer.** Verdict first, as a word and a colour, Swahili and English mirrored. Under it, in this order: the one blocking item, the price, then the persona actions:
   - Show at the counter (existing clerk view, one tap)
   - Read this aloud (a three-line script in Swahili and English, written for relaying by voice)
   - Share (Web Share API with plain text; falls back to copy). The text is the same `ussdText()` string USSD will send, so the forwarded SMS and the USSD reply are identical by construction.
   - Check another farmer at this depot (keeps the depot, returns to step one)
3. **Detail.** The full six-requirement ledger, both prices, sources. Reached by "See everything behind this" from the answer. This is where the current sections 03 to 05 go, unchanged.

## 3. Remembering the user

- `localStorage` only: last farmer, last depot, and the last five checks as a "Recent" list on Home.
- Home opens on the remembered pair with the verdict already visible, so a repeat visit is zero taps.
- One line under it: "Remembered on this phone only. Sample records, not a live KIAMIS lookup."
- No accounts, no server, nothing leaves the device. This is a two-way door; deleting the key resets everything.

## 4. Installable and offline

- `manifest.json` (name, short name, icons, standalone display, theme colour from the existing paper palette).
- `sw.js`: precache `index.html`, `engine.js`, `manifest.json`, the three Google Fonts CSS responses. Cache-first for those, network-first for nothing (there is no network data). Bump a version string on each deploy.
- An "Add to home screen" nudge, shown once, dismissible.
- An offline badge in the masthead so a clerk can see the screen is not pretending to be live.
- Vercel: still framework "Other", no build. Add `vercel.json` only if the service worker needs a `Service-Worker-Allowed` header; at root scope it should not.

## 5. USSD as the fallback channel

- Add `ussdText(result)` to `engine.js` now (Milestone A step 2), with the character-budget and no-em-dash tests. The share text in section 2 uses it immediately, so the formatter ships and is tested before any endpoint exists.
- On the Answer screen: "No data bundle? The same answer by USSD" with the sandbox code once Milestone A is live. Until then the line reads "USSD channel in progress" and links to MILESTONES.md. Never imply a live shortcode.

## 6. Language

Decided 2 Sep (Victor): full Swahili toggle. Every visible string switchable between English and Swahili, choice remembered on the phone. Strings live in a `STRINGS` table in `index.html` keyed by language, not in the engine, so the engine stays language-neutral and testable. Engine text (requirement titles, reasons, price labels) gets a translation map keyed by record id, still outside the engine. A teammate reviews the Swahili before demo; all strings live in one file Victor can forward, and their edits paste straight back. Machine-drafted Swahili is a placeholder, never the shipped copy.

Verdict words to confirm with a Swahili speaker before shipping: Utapata (Served), Huenda (Conditional), Hutapata (Not Served).

## 7. Build order, time-boxed

| Order | Deliverable | Test condition |
|---|---|---|
| R0 | `ussdText()` in engine plus tests | `npm test` green, every pair under budget |
| R1 | Hash-routed shell: Home, Answer, Detail. About link holds the problem screen | Back button works; every existing element still renders; no console errors at 320px |
| R2 | Remembering: localStorage, Recent list, zero-tap repeat visit | Reload shows last pair; clearing storage resets cleanly |
| R3 | Answer screen actions: counter, read aloud, share, check another | Share text equals `ussdText()` output character for character |
| R4 | PWA: manifest, service worker, install nudge, offline badge | Airplane mode after one load still gives a verdict; Lighthouse installable |
| R5 | Swahili toggle across every screen | Every string has both languages; reviewed by a Swahili speaker; no em dashes |
| R6 | USSD line on Answer, wired to Milestone A when it lands | Never shows a code that does not work |

R0 and R1 can run in parallel. R2 and R3 depend on R1. R4 is independent and can go any time after R1. Milestone B (location) plugs into Home's depot list without touching the rest.

## 8. Decisions needed before R1

1. DECIDED: the check is the first screen. The problem screen moves behind About. Capture it for the deck (step 6 in FOUNDATION.md) before it moves.
2. DECIDED: go cleaner and app-like. New palette and type, larger controls, less editorial. Citations stay, but as a tappable footnote sheet rather than an inline ledger.
3. DECIDED: full Swahili toggle, see section 6.

## 9. Out of scope for this refresh

Real registry lookup, accounts, any server state, WhatsApp bot, voice line, batch mode. All remain in MILESTONES.md V2.
