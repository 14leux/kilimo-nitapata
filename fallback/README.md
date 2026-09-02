# Static fallback

Screenshots of the working app, for when the live network drops mid-pitch. Use these, say so plainly, and move on, don't try to debug on stage. See [PITCH.md](../PITCH.md), "If something breaks live."

- `01-checker-served.png`, the full page on default load: problem screen, checker, a Served verdict, the requirement ledger, price, and sources.
- `02-clerk-view-conditional.png`, the counter view for a Conditional case, the actual centerpiece of the product.

## Recapturing

Both were captured headlessly against the local dev server, no manual clicking needed for either, including the clerk view, which `index.html` opens automatically when the URL carries `#clerk-demo` (a capture-only convenience, not a real feature; see the comment above it in `index.html`).

```
npm run dev
# in another terminal, with Chrome or Edge installed:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=900,4200 --screenshot="fallback\01-checker-served.png" "http://localhost:3000"
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=750,1500 --screenshot="fallback\02-clerk-view-conditional.png" "http://localhost:3000/#clerk-demo"
```

Recapture whenever the app's content changes meaningfully, a stale fallback that doesn't match the live app is worse than none.
