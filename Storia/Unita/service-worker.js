const CACHE_PREFIX = "storia-unita-";
const CACHE = `${CACHE_PREFIX}v1`;
const CORE = [
  "./", "index.html", "app.html", "css/style.css", "js/data.js", "js/home.js", "js/app.js", "manifest.webmanifest",
  "assets/img/icons/icon.svg", "assets/img/icons/icon-192.png", "assets/img/icons/icon-512.png", "assets/img/covers/unita-cover.svg",
  ...["cavour","vittorio-emanuele","garibaldi","mazzini","crispi","pilo","manin","dazeglio","rattazzi","ricasoli","la-marmora","napoleone-iii","francesco-ii","pio-ix","adelaide-cairoli","belgiojoso"].map(x => `assets/img/people/${x}.jpg`),
  ...["italia-1849","trasformazioni-1859-1861","completamento-1861-1870"].map(x => `assets/img/maps/${x}.svg`),
  ...["1-piemonte-laboratorio","2-piemonte-europa","3-diplomazia-guerra","4-annessioni-rivoluzione","5-mille-mezzogiorno","6-costruire-stato","7-veneto-roma"].map(x => `assets/pdf/lezioni/${x}.pdf`),
  "assets/pdf/approfondimenti/fonti-in-dialogo.pdf", "assets/pdf/approfondimenti/mappe-e-schemi.pdf"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("index.html") : new Response("", { status: 504 }))));
});
