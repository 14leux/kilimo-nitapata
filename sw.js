// Kilimo, Nitapata? service worker.
// Everything the app needs is static, so the whole app is precached and
// served from cache first. Bump VERSION on every deploy; the old cache is
// dropped on activate.
const VERSION = "kn-v5-2026-11-16";
const APP = ["./", "./index.html", "./engine.js", "./strings.js", "./manifest.json", "./icon.svg", "./icon-maskable.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Navigations (the HTML): network first so a deploy reaches everyone on the
// next open, cache when offline. Other app files and fonts: cache first,
// refreshed in the background. Anything else: network only.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  const isApp = url.origin === location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!isApp && !isFont) return;

  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      if (e.request.mode === "navigate") {
        try {
          const fresh = await fetch(e.request);
          if (fresh && fresh.ok && (url.pathname === "/" || url.pathname === "/index.html")) cache.put("./index.html", fresh.clone());
          return fresh;
        } catch {
          return (await cache.match("./index.html")) || new Response("Offline", { status: 503 });
        }
      }
      const cached = await cache.match(e.request, { ignoreSearch: isApp });
      const network = fetch(e.request).then((res) => {
        if (res && res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => null);
      if (cached) { network; return cached; }
      const res = await network;
      if (res) return res;
      if (e.request.mode === "navigate") return cache.match("./index.html");
      return new Response("", { status: 504 });
    })
  );
});
