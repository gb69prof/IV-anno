const CACHE_PREFIX = "storia-destra-storica-";
const CACHE = `${CACHE_PREFIX}v3`;
const CORE = [
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1",
  "./", "index.html", "app.html", "css/style.css", "js/data.js", "js/home.js", "js/app.js", "manifest.webmanifest",
  "assets/img/icons/icon.svg", "assets/img/icons/icon-192.png", "assets/img/icons/icon-512.png", "assets/img/covers/destra-cover.svg",
  ...["ricasoli","minghetti","la-marmora","lanza","sella","spaventa","rattazzi","depretis","vittorio-emanuele","garibaldi","pio-ix","crocco","villari"].map(x => `assets/img/people/${x}.jpg`),
  ...["italia-amministrativa","brigantaggio","completamento","indicatori"].map(x => `assets/img/maps/${x}.svg`),
  ...["1-stato-sulla-carta","2-accentramento","3-cittadini","4-bilancio","5-brigantaggio","6-mezzogiorno","7-roma-1876"].map(x => `assets/pdf/lezioni/${x}.pdf`),
  "assets/pdf/approfondimenti/fonti-in-dialogo.pdf", "assets/pdf/approfondimenti/mappe-e-schemi.pdf", "assets/pdf/approfondimenti/sintesi-generale.pdf"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const network = fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  });
  const fresh = event.request.mode === 'navigate' || event.request.destination === 'style' || event.request.destination === 'script';
  if (fresh) {
    event.respondWith(network.catch(() => caches.match(event.request).then(cached => cached || (event.request.mode === 'navigate' ? caches.match('index.html') : new Response('', {status:504})))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || network.catch(() => new Response('', {status:504}))));
});
