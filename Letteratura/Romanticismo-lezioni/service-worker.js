const CACHE_PREFIX = "romanticismo-lezioni-";
const CACHE_VERSION = `${CACHE_PREFIX}v7`;
const OFFLINE_URL = "./offline.html";
const CORE_ASSETS = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css?v=7",
  "./assets/js/app.js?v=7",
  "./assets/images/copertina-romanticismo.webp",
  "./assets/images/icon-192.png",
  "./assets/images/icon-512.png",
  "./assets/images/tavola-contraddizioni.png",
  "./assets/images/tavola-romanticismo-europeo.png",
  "./assets/images/tavola-romanticismo-italiano.png",
  "./assets/maps/dall-ordine-alla-crepa.svg",
  "./assets/maps/quattro-fratture.svg",
  "./assets/maps/nuova-immagine.svg",
  "./assets/maps/nuova-letteratura.svg",
  "./assets/maps/vie-europee.svg",
  "./assets/maps/via-italiana.svg",
  "./assets/maps/mappa-finale.svg",
  "./assets/docs/Dispensa_Romanticismo_gbprof_Libera.docx"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match("./index.html") || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
