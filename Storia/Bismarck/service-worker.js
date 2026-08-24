const CACHE_PREFIX = "storia-bismarck-reich-";
const CACHE = `${CACHE_PREFIX}v1`;
const CORE = [
  "./","index.html","app.html","css/style.css","js/data.js","js/app.js","js/home.js","manifest.webmanifest",
  "assets/img/covers/bismarck-cover.svg","assets/img/icons/icon.svg","assets/img/icons/icon-192.png","assets/img/icons/icon-512.png",
  "assets/img/people/bismarck.svg","assets/img/people/guglielmo-i.svg","assets/img/people/moltke.svg","assets/img/people/roon.svg",
  "assets/img/people/napoleone-iii.svg","assets/img/people/windthorst.svg","assets/img/people/gorcakov.svg","assets/img/people/guglielmo-ii.svg",
  "assets/img/maps/germania-1815-1871.svg","assets/img/maps/tre-guerre.svg","assets/img/maps/costituzione-reich.svg","assets/img/maps/alleanze.svg",
  "assets/pdf/approfondimenti/sintesi-generale.pdf","assets/pdf/approfondimenti/fonti-in-dialogo.pdf","assets/pdf/approfondimenti/mappe-e-schemi.pdf",
  "assets/pdf/lezioni/1-germania-prima.pdf","assets/pdf/lezioni/2-crisi-prussiana.pdf","assets/pdf/lezioni/3-ducati.pdf","assets/pdf/lezioni/4-guerra-austria.pdf",
  "assets/pdf/lezioni/5-francia-reich.pdf","assets/pdf/lezioni/6-costituzione-reich.pdf","assets/pdf/lezioni/7-stato-sociale.pdf","assets/pdf/lezioni/8-equilibrio-eredita.pdf"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => { if (event.request.method !== "GET") return; const url = new URL(event.request.url); if (url.origin !== location.origin) return; event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => { if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone())); return response; }).catch(() => event.request.mode === "navigate" ? caches.match("index.html") : new Response("", {status:504})))); });
