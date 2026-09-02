const CACHE_PREFIX="storia-crispi-fine-secolo-";
const CACHE=`${CACHE_PREFIX}v2`;
const CORE=[
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1","./","index.html","app.html","js/data.js","js/app.js","js/home.js","manifest.webmanifest","../Sinistra-storica/css/style.css","assets/img/icons/icon.svg","assets/img/covers/crispi-cover.svg","../Sinistra-storica/assets/img/people/crispi.jpg","assets/img/people/zanardelli.svg","assets/img/people/giolitti.svg","assets/img/people/colajanni.svg","assets/img/people/menelik.svg","assets/img/people/baratieri.svg","assets/img/people/bava.svg","assets/img/people/pelloux.svg","assets/img/people/bresci.svg","assets/img/maps/italia-crisi.svg","assets/img/maps/sicilia-fasci.svg","assets/img/maps/africa-orientale.svg"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
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
