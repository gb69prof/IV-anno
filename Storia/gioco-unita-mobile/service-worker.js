const CACHE_PREFIX = 'italia-1861-mobile-';
const CACHE = `${CACHE_PREFIX}v3`;
const FILES = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  './', './index.html', './style.css', './game.js', './manifest.webmanifest',
  './vendor/three.min.js', './assets/icon.svg', './assets/icon-192.png',
  './assets/icon-512.png', './assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  })));
});
