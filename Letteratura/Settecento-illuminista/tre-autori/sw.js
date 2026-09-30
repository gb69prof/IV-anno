const CACHE_PREFIX = 'settecento-tre-autori-';
const CACHE_NAME = CACHE_PREFIX + 'v1';
const CORE = ['./','index.html','style.css','app.js','manifest.webmanifest','assets/icon.svg','assets/icon-180.png','assets/icon-192.png','assets/icon-512.png','assets/parini.jpeg','assets/alfieri.webp','assets/goldoni.webp','../../../pwa-common/gbprof-accessibility.css?v=1','../../../pwa-common/gbprof-accessibility.js?v=1'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const inScope=url.href.startsWith(self.registration.scope);
  const isCommon=CORE.some(path=>new URL(path,self.registration.scope).href===url.href);
  if(!inScope&&!isCommon)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(async response=>{
      if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(event.request,response.clone());return response;}
      return await caches.match(event.request)||response;
    }).catch(async()=>await caches.match(event.request)||await caches.match(new URL('index.html',self.registration.scope).href)));
  }else{
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(async response=>{
      if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(event.request,response.clone());}return response;
    })));
  }
});
