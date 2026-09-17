'use strict';
const PREFIX = 'gbprof-rivoluzione-approfondimento:' + self.registration.scope + ':';
const CACHE = PREFIX + '__VERSION__';
const ASSETS = __ASSETS__;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  // Non interferire con le altre PWA o con l’indice del repository.
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(request, {ignoreSearch:true});
    if (saved) return saved;
    try { return await fetch(request); }
    catch (_) { return new Response('Questa risorsa non è disponibile offline. Ritorna a una pagina già salvata del percorso.', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
  })());
});
