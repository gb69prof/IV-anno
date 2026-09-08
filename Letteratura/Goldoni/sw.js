const PREFIX = 'goldoni-pwa-';
const CACHE = PREFIX + '2026-09-08-v1';
const ASSETS = [
  "./",
  "./index.html",
  "./mappe.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/copertina.webp",
  "./assets/goldoni.webp",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon.svg",
  "./assets/lessons.json",
  "./assets/mappa-0.webp",
  "./assets/mappa-1.webp",
  "./assets/mappa-2.webp",
  "./assets/mappa-3.webp",
  "./assets/mappa-4.webp",
  "./assets/mappa-5.webp",
  "./assets/mappa-6.webp",
  "./assets/quizzes.json",
  "./lezioni/conclusione.html",
  "./lezioni/fratture.html",
  "./lezioni/immagine-del-mondo.html",
  "./lezioni/mondo-precedente.html",
  "./lezioni/opere.html",
  "./lezioni/poetica.html"
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scope = new URL('./', self.location.href);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request, {ignoreSearch:true});
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch (error) {
      if (event.request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  }));
});
