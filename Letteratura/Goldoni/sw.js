const PREFIX = 'goldoni-pwa-';
const CACHE = PREFIX + '2026-09-08-v2-foscolo';
const ASSETS = [
  "./",
  "./index.html",
  "./mappe.html",
  "./timeline.html",
  "./style.css",
  "./app.js",
  "./workspace.js",
  "./manifest.webmanifest",
  "./assets/goldoni.webp",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon.svg",
  "./assets/index.webp",
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
  "./lezioni/poetica.html",
  "../../pwa-common/gbprof-accessibility.css?v=1",
  "../../pwa-common/gbprof-accessibility.js?v=1",
  "../../privacy.html",
  "../../accessibilita.html"
];
const PRECACHED = new Set(ASSETS.map(asset => new URL(asset, self.location.href).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const old = keys.filter(key => key.startsWith(PREFIX) && key !== CACHE);
    await Promise.all(old.map(key => caches.delete(key)));
    await self.clients.claim();
    // La revisione cambia l'intero ambiente: le vecchie pagine vengono ricaricate
    // una sola volta, dopo la cache completa. I dati di studio restano in localStorage.
    if (old.length) {
      const scope = new URL('./', self.location.href);
      const windows = await self.clients.matchAll({type:'window'});
      await Promise.allSettled(windows.filter(client => {
        const url = new URL(client.url);
        return url.origin === scope.origin && url.pathname.startsWith(scope.pathname);
      }).map(client => client.navigate(client.url)));
    }
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scope = new URL('./', self.location.href);
  const inApp = url.origin === scope.origin && url.pathname.startsWith(scope.pathname);
  if (!inApp && !PRECACHED.has(url.href)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request, {ignoreSearch:true});
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch (error) {
      if (inApp && event.request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  }));
});
