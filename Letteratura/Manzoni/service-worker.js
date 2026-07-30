const CACHE_NAME = "manzoni-pwa-v1";

const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./mappe.html",
  "./video.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/immagini/index.png",
  "./assets/immagini/manzoni-ritratto.png",
  "./assets/immagini/icon-192.png",
  "./assets/immagini/icon-512.png",
  "./assets/mappe/mondo-pre-Manzoni.png",
  "./assets/mappe/fratture.png",
  "./assets/mappe/immagine-mondo.png",
  "./assets/mappe/provvida-sventura.png",
  "./assets/mappe/poetica.png",
  "./assets/mappe/opere.png",
  "./assets/mappe/Promessi-sposi.png",
  "./assets/mappe/capitolo1.png",
  "./assets/mappe/capitolo4.png",
  "./assets/mappe/capitolo9.png",
  "./assets/mappe/capitolo10.png",
  "./assets/mappe/Innominato.png",
  "./Lezioni/introduzione.html",
  "./Lezioni/fratture.html",
  "./Lezioni/immagine-del-mondo.html",
  "./Lezioni/poetica.html",
  "./Lezioni/opere.html",
  "./Lezioni/capitoli.html",
  "./Lezioni/conclusione.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
