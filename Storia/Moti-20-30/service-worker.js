const CACHE='moti-20-30-v1-focus1';const CORE=[
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1",'./','index.html','app.html','css/style.css','js/data.js','js/home.js','js/app.js','manifest.webmanifest','assets/img/icons/icon.svg','assets/img/icons/icon-192.png','assets/img/icons/icon-512.png','assets/img/covers/riego.jpg','assets/img/maps/onda-1820.svg','assets/img/maps/onda-1830.svg','assets/img/maps/italia-1820-1831.svg','assets/img/sources/cadice.svg',...['riego','pepe','santarosa','bouboulina','luigi-filippo','menotti','czartoryski'].map(x=>`assets/img/people/${x}.jpg`),...['1-ordine-opposizioni','2-idee-reti','3-onda-1820','4-sicilia-piemonte','5-grecia-decabristi','6-onda-1830','7-fallimenti-eredita'].map(x=>`assets/pdf/lezioni/${x}.pdf`),'assets/pdf/approfondimenti/fonti-in-dialogo.pdf','assets/pdf/approfondimenti/mappe-e-schemi.pdf'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch', event => {
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
