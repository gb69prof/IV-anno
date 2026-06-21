const CACHE_NAME = "leopardi-foscolo-style-v4";

const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./lezioni.html",
  "./percorso-testi.html",
  "./approfondimenti.html",
  "./mappe.html",
  "./video.html",
  "./test-finale.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/immagini/index.png",
  "./assets/immagini/icon-192.png",
  "./assets/immagini/icon-512.png",
  "./pagine/filosofia-base.html",
  "./pagine/fratture.html",
  "./pagine/immagine-mondo.html",
  "./pagine/poetica.html",
  "./pagine/scritti.html",
  "./pagine/infinito.html",
  "./pagine/bruto-saffo.html",
  "./pagine/natura-islandese.html",
  "./pagine/ginestra.html",
  "./pagine/siepe-lava.html",
  "./pagine/macchina-anima.html",
  "./pagine/senso-natura.html",
  "./assets/mappe/1-Leopardi-Filosofia-base.png",
  "./assets/mappe/2-fratture.png",
  "./assets/mappe/3-immagine-mondo.png",
  "./assets/mappe/4-poetica.png",
  "./assets/mappe/5-scritti.png",
  "./assets/mappe/bruto-saffo.png",
  "./assets/mappe/ginestra.png",
  "./assets/mappe/infinito.png",
  "./assets/mappe/macchina-anima.png",
  "./assets/mappe/natura-islandese.png",
  "./assets/mappe/siepe-lava.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.toLowerCase().includes("/video/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        if (response.ok && url.origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
