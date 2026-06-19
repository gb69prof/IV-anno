const CACHE_NAME = "leopardi-pwa-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./app-data.js",
  "./manifest.webmanifest",
  "./immagini/icon-192.png",
  "./immagini/icon-512.png",
  "./immagini/index.png",
  "./immagini/1-Leopardi-Filosofia-base.png",
  "./immagini/2-fratture.png",
  "./immagini/3-immagine-mondo.png",
  "./immagini/4-poetica.png",
  "./immagini/5-scritti.png",
  "./immagini/infinito.png",
  "./immagini/bruto-saffo.png",
  "./immagini/natura-islandese.png",
  "./immagini/ginestra.png",
  "./immagini/siepe-lava.png",
  "./immagini/macchina-anima.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.pathname.toLowerCase().includes("/video/")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && url.origin === location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
