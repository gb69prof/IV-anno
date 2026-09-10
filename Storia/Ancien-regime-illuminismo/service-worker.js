/* Aggiornare la versione quando cambia un file precache. */
const CACHE_PREFIX='ancien-regime-illuminismo-';
const CACHE_NAME=CACHE_PREFIX+'v1.0.0';
const ASSETS=[
  "./",
  "ATTRIBUTIONS.md",
  "README.md",
  "app.html",
  "assets/img/icons/icon-192.png",
  "assets/img/icons/icon-512.png",
  "assets/img/louis-xiv.webp",
  "assets/img/salon-geoffrin.webp",
  "assets/img/schemi/cambiamento.svg",
  "assets/img/schemi/cittadini.svg",
  "assets/img/schemi/lumi.svg",
  "assets/img/schemi/ordini.svg",
  "assets/img/schemi/potere.svg",
  "assets/img/schemi/problemi.svg",
  "assets/img/schemi/scienza.svg",
  "assets/img/schemi/vita.svg",
  "css/style.css",
  "index.html",
  "js/app.js",
  "js/content.js",
  "js/cover.js",
  "js/data.js",
  "manifest.webmanifest",
  "testi.html",
  "../../privacy.html",
  "../../accessibilita.html",
  "../../pwa-common/gbprof-accessibility.css?v=1",
  "../../pwa-common/gbprof-accessibility.js?v=1",
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1"
];
const URLS=new Set(ASSETS.map(path=>new URL(path,self.location.href).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.location.href),{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;const own=req.url.startsWith(new URL('./',self.location.href).href);if(!own&&!URLS.has(req.url))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);const cached=await cache.match(req);const dynamic=req.mode==='navigate'||/\.(?:html|css|js|webmanifest)(?:\?|$)/.test(req.url);if(!dynamic&&cached)return cached;
 try{const response=await fetch(req,{cache:'no-cache'});if(response.ok&&(URLS.has(req.url)||own)){await cache.put(req,response.clone()).catch(()=>{})}if(!response.ok&&cached)return cached;return response}catch{if(cached)return cached;if(req.mode==='navigate'&&own)return (await cache.match(new URL('index.html',self.location.href).href))||Response.error();return Response.error()}})());
});
