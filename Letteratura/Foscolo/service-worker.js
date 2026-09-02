const CACHE_PREFIX = "foscolo-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}v16`;

const LOCAL_ASSETS = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "./",
  "./index.html",
  "./mappe.html",
  "./video.html",
  "./manifest.json",
  "./assets/css/style.css?v=13",
  "./assets/css/lesson-focus.css?v=2",
  "./assets/js/app.js?v=13",
  "./assets/js/study-workspace.js?v=14",
  "./assets/js/lesson-focus.js?v=3",
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
  "./lezioni/conclusione.html",
  "./lezioni/ortis-parini.html",
  "./lezioni/alla-sera.html",
  "../rete-pwa/bridge.js?v=2",
  "../rete-pwa/bridge.css?v=2",
  "../rete-pwa/links.json?v=2"
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
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isHtml = event.request.mode === "navigate" || requestUrl.pathname.endsWith(".html");

  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok && requestUrl.origin === self.location.origin) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && requestUrl.origin === self.location.origin) {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
      }
      return response;
    }))
  );
});
