const CACHE_PREFIX = 'restaurazione-';
const CACHE = `${CACHE_PREFIX}v2-focus1`;
const CORE = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1",
  './',
  'index.html',
  'app.html',
  'css/style.css',
  'js/data.js',
  'js/home.js',
  'js/app.js',
  'manifest.webmanifest',
  'assets/img/icons/icon.svg',
  'assets/img/icons/icon-192.png',
  'assets/img/icons/icon-512.png',
  'assets/img/covers/hero-restaurazione.jpg',
  'assets/img/covers/hero-restaurazione-mobile.jpg',
  'assets/img/maps/europa-1815.svg',
  'assets/img/maps/italia-1815.svg',
  'assets/img/protagonisti/metternich.jpg',
  'assets/img/protagonisti/alessandro-i.jpg',
  'assets/img/protagonisti/francesco-i.jpg',
  'assets/img/protagonisti/federico-guglielmo-iii.jpg',
  'assets/img/protagonisti/luigi-xviii.jpg',
  'assets/img/protagonisti/talleyrand.jpg',
  'assets/pdf/lezioni/1-mondo-precedente.pdf',
  'assets/pdf/lezioni/2-frattura.pdf',
  'assets/pdf/lezioni/3-mondo-nuovo.pdf',
  'assets/pdf/lezioni/4-europa-restaurata.pdf',
  'assets/pdf/lezioni/5-forza-limiti.pdf',
  'assets/pdf/lezioni/6-liberali-conservatori.pdf',
  'assets/pdf/approfondimenti/fonti-in-dialogo.pdf',
  'assets/pdf/approfondimenti/mappe-e-schemi.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

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
