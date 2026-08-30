const CACHE_PREFIX='parini-study-';
const CACHE=`${CACHE_PREFIX}v7`;
const CORE=[
  './','./index.html','./style.css?v=7','./data.js','./app.js','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png','./assets/parini_fotorealistico.png','./assets/parini_dipinto_originale.jpeg',
  './assets/mappa_dea_moda_tesi_apparente.png','./assets/mappa_dea_moda_tesi_vera.png',
  './assets/schema_primo_stato_01.png','./assets/schema_primo_stato_02.png','./assets/schema_primo_stato_03.png','./assets/schema_primo_stato_04.png','./assets/schema_primo_stato_05.png',
  './assets/schema_primo_stato_06.png','./assets/schema_primo_stato_07.png','./assets/schema_primo_stato_08.png','./assets/schema_primo_stato_09.png','./assets/schema_primo_stato_10.png'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&url.pathname.includes('/Letteratura/Parini/')){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;})));
});
