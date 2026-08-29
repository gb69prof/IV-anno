const CACHE_PREFIX = "manzoni-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}v6`;

const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./mappe.html",
  "./video.html",
  "./offline.html",
  "./manifest.json",
  "./assets/css/style.css?v=6",
  "./assets/js/app.js?v=6",
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
        Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request,response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./offline.html"))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && requestUrl.origin === self.location.origin) caches.open(CACHE_NAME).then((cache) => cache.put(event.request,response.clone()));
    return response;
  })));
});
