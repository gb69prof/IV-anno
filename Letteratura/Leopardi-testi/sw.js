const CACHE_PREFIX = 'leopardi-testi-pwa-';
const CACHE = `${CACHE_PREFIX}v4`;
const CORE = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1','./','./index.html','./css/style.css','./js/app.js','./manifest.json','./data/catalog.json','./data/paper.json','./data/corpus.json','./data/work-intros.json','./assets/icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
    const clone = resp.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, clone));
    return resp;
  }).catch(() => cached)));
});
