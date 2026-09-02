const CACHE_PREFIX = "storia-sinistra-storica-";
const CACHE = `${CACHE_PREFIX}v2`;
const CORE = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1",
  "./","index.html","app.html","css/style.css","js/data.js","js/app.js","js/home.js","manifest.webmanifest",
  "assets/img/covers/sinistra-cover.svg","assets/img/icons/icon.svg","assets/img/icons/icon-192.png","assets/img/icons/icon-512.png",
  "assets/img/people/depretis.jpg","assets/img/people/minghetti.jpg","assets/img/people/crispi.jpg","assets/img/people/pio-ix.jpg",
  "assets/img/maps/suffragio.svg","assets/img/maps/forze-sociali.svg","assets/img/maps/protezionismo.svg","assets/img/maps/mediterraneo.svg",
  "assets/pdf/approfondimenti/sintesi-generale.pdf","assets/pdf/approfondimenti/fonti-in-dialogo.pdf","assets/pdf/approfondimenti/mappe-e-schemi.pdf",
  "assets/pdf/lezioni/1-rivoluzione-parlamentare.pdf","assets/pdf/lezioni/2-riforme.pdf","assets/pdf/lezioni/3-trasformismo.pdf","assets/pdf/lezioni/4-societa-organizzata.pdf",
  "assets/pdf/lezioni/5-economia-crisi.pdf","assets/pdf/lezioni/6-triplice.pdf","assets/pdf/lezioni/7-colonialismo.pdf","assets/pdf/lezioni/8-bilancio.pdf"
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
