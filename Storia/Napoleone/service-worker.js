const CACHE = 'napoleone-v1';
const CORE = [
  './','index.html','app.html','css/style.css','js/data.js','js/home.js','js/app.js','manifest.webmanifest',
  'assets/img/icons/icon.svg','assets/img/icons/icon-192.png','assets/img/icons/icon-512.png',
  'assets/img/covers/hero-napoleone.jpg','assets/img/covers/hero-napoleone-mobile.jpg',
  'assets/img/maps/europa-1811.svg','assets/img/maps/espansione-contrazione.svg','assets/img/maps/russia-1812.svg',
  'assets/img/fonti/incoronazione-david.jpg','assets/img/fonti/goya-tre-maggio.jpg',
  'assets/img/protagonisti/napoleone.jpg','assets/img/protagonisti/giuseppina.jpg','assets/img/protagonisti/fouche.jpg','assets/img/protagonisti/toussaint.jpg','assets/img/protagonisti/goya.jpg','assets/img/protagonisti/wellington.jpg',
  '../Restaurazione/assets/img/protagonisti/talleyrand.jpg','../Restaurazione/assets/img/protagonisti/alessandro-i.jpg',
  'assets/pdf/lezioni/1-figlio-rivoluzione.pdf','assets/pdf/lezioni/2-repubblica-uomo-forte.pdf','assets/pdf/lezioni/3-salvare-controllando.pdf','assets/pdf/lezioni/4-repubblica-incorona.pdf','assets/pdf/lezioni/5-liberatore-conquistatore.pdf','assets/pdf/lezioni/6-governare-guerra.pdf','assets/pdf/lezioni/7-caduta-eredita.pdf','assets/pdf/approfondimenti/fonti-in-dialogo.pdf','assets/pdf/approfondimenti/mappe-e-schemi.pdf'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url); if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => { if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone())); return response; });
    return cached || network.catch(() => event.request.mode === 'navigate' ? caches.match('index.html') : new Response('', {status:504}));
  }));
});
