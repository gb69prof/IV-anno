const CACHE_NAME = "foscolo-pwa-v5";

const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./mappe.html",
  "./video.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/immagini/Foscolo-foto.PNG",
  "./assets/immagini/index.png",
  "./assets/mappe/Alla-sera.PNG",
  "./assets/mappe/Foscolo-meccanicismo.PNG",
  "./assets/mappe/Foscolo-religione-illusioni.PNG",
  "./assets/mappe/Foscolo-vita-pensiero-poetica.PNG",
  "./assets/mappe/Foscolo-vita.PNG",
  "./assets/mappe/Grazie.PNG",
  "./assets/mappe/Neoclassicismo-preromanticismo.PNG",
  "./assets/mappe/sepolcri.PNG",
  "./assets/mappe/sonetti.PNG",
  "./assets/mappe/ultime-lettere-Jacopo-Ortis.PNG",
  "./lezioni/introduzione.html",
  "./lezioni/fratture.html",
  "./lezioni/immagine-del-mondo.html",
  "./lezioni/poetica.html",
  "./lezioni/opere.html",
  "./lezioni/ortis-parini.html",
  "./lezioni/alla-sera.html"
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
