const CACHE_PREFIX = "leopardi-";
const CACHE_NAME = "leopardi-study-environment-v12";

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
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/css/study-focus.css",
  "./assets/js/app.js",
  "./assets/js/study-environment.js",
  "./assets/js/study-focus.js",
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
  "./pagine/conclusione.html",
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
  "./assets/mappe/siepe-lava.png",
  "../rete-pwa/bridge.js?v=2",
  "../rete-pwa/bridge.css?v=2",
  "../rete-pwa/links.json?v=2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.pathname.toLowerCase().includes("/video/")) return;

  const sameOrigin = url.origin === self.location.origin;
  const needsFreshCopy =
    event.request.mode === "navigate" ||
    event.request.destination === "document" ||
    (sameOrigin && ["script", "style", "worker"].includes(event.request.destination));

  const remember = (response) => {
    if (response.ok && sameOrigin) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    }
    return response;
  };

  if (needsFreshCopy) {
    event.respondWith(
      fetch(event.request)
        .then(remember)
        .catch(() => caches.match(event.request, { ignoreSearch: sameOrigin }))
    );
    return;
  }

  event.respondWith(
    caches
      .match(event.request, { ignoreSearch: sameOrigin })
      .then((cached) => cached || fetch(event.request).then(remember))
  );
});
