/* Safeguard Anchors — service worker (offline-first PWA) */
const VERSION = "sa-v3";
const SHELL = [
  "./", "index.html", "manifest.webmanifest",
  "assets/css/app.css?v=3", "assets/js/app.js?v=3", "assets/js/data.js?v=3",
  "assets/img/logo.png",
  "assets/img/icons/icon-192.png", "assets/img/icons/icon-512.png",
  "assets/img/site/hero-bg.jpg", "assets/img/site/eta-logo.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  /* navigations: network first, fall back to cached shell (SPA) */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put("index.html", cp)); return res; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  /* code (css/js): network first — a stale stylesheet must never pair with fresh HTML */
  if (/\.(css|js)(\?|$)/.test(req.url)) {
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return res; })
        .catch(() => caches.match(req))
    );
    return;
  }

  /* other assets (images, fonts): cache first, then network */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
      return res;
    }).catch(() => hit))
  );
});
