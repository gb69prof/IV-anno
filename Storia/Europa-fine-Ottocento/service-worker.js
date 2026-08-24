const CACHE_PREFIX = "storia-europa-fine-ottocento-";
const CACHE = `${CACHE_PREFIX}v1`;
const CORE = [
  "./","index.html","app.html","css/style.css","js/data.js","js/app.js","js/home.js","manifest.webmanifest",
  "assets/img/covers/europa-cover.svg","assets/img/icons/icon.svg","assets/img/icons/icon-192.png","assets/img/icons/icon-512.png",
  "assets/img/people/ferry.svg","assets/img/people/dreyfus.svg","assets/img/people/gladstone.svg","assets/img/people/witte.svg",
  "assets/img/people/nicola.svg","assets/img/people/francesco.svg","assets/img/people/leopoldo.svg","assets/img/people/rhodes.svg",
  "assets/img/people/menelik.svg","assets/img/people/mutsuhito.svg",
  "assets/img/maps/sistemi-politici.svg","assets/img/maps/politica-massa.svg","assets/img/maps/imperi-rotte.svg","assets/img/maps/resistenze.svg",
  "assets/pdf/approfondimenti/sintesi-generale.pdf","assets/pdf/approfondimenti/fonti-in-dialogo.pdf","assets/pdf/approfondimenti/mappe-e-schemi.pdf",
  "assets/pdf/lezioni/1-europa-contraddittoria.pdf","assets/pdf/lezioni/2-francia-repubblica.pdf","assets/pdf/lezioni/3-gran-bretagna.pdf","assets/pdf/lezioni/4-russia-zarista.pdf",
  "assets/pdf/lezioni/5-austria-ungheria.pdf","assets/pdf/lezioni/6-imperialismo-cause.pdf","assets/pdf/lezioni/7-africa-spartita.pdf","assets/pdf/lezioni/8-asia-giappone.pdf"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(caches.match(event.request, {ignoreSearch:true}).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("index.html") : new Response("", {status:504}))));
});

