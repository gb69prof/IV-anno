const CACHE_PREFIX='ideologie-';const CACHE=`${CACHE_PREFIX}v1-focus1`;const CORE=[
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1",'./','index.html','app.html','css/style.css','js/data.js','js/home.js','js/app.js','manifest.webmanifest','assets/img/icons/icon.svg','assets/img/icons/icon-192.png','assets/img/icons/icon-512.png','assets/img/covers/mazzini.jpg',...['mazzini','cattaneo','ferrari','gioberti','balbo','dazeglio','belgiojoso'].map(x=>`assets/img/people/${x}.jpg`),...['reti-esilio','progetti-italia','matrice-programmi'].map(x=>`assets/img/maps/${x}.svg`),'assets/img/sources/giovine-italia.svg',...['1-dopo-1831','2-mazzini-giovine-italia','3-doveri-sociale','4-insurrezioni-limiti','5-federalisti','6-moderati','7-confronto-1848'].map(x=>`assets/pdf/lezioni/${x}.pdf`),'assets/pdf/approfondimenti/fonti-in-dialogo.pdf','assets/pdf/approfondimenti/mappe-e-schemi.pdf'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch', event => {
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
