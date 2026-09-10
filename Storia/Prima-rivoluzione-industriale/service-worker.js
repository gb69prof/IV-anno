/* Cache isolata; rigenerare con python tools/cache.py. */
const CACHE_PREFIX='prima-rivoluzione-industriale-';
const CACHE_NAME=CACHE_PREFIX+'2c520b38e11e';
const ASSETS=[
  "./",
  "app.html",
  "assets/img/cottage-1750.webp",
  "assets/img/cotton-mill-1830.webp",
  "assets/img/filiera.svg",
  "assets/img/geografia.svg",
  "assets/img/icons/icon-192.png",
  "assets/img/icons/icon-512.png",
  "assets/img/motore.svg",
  "assets/img/schemi/britannia.svg",
  "assets/img/schemi/citta.svg",
  "assets/img/schemi/cotone.svg",
  "assets/img/schemi/diritti.svg",
  "assets/img/schemi/energia.svg",
  "assets/img/schemi/esiti.svg",
  "assets/img/schemi/fabbrica.svg",
  "assets/img/schemi/prima.svg",
  "css/style.css",
  "index.html",
  "js/app.js",
  "js/content.js",
  "js/cover.js",
  "js/data.js",
  "js/offline.js",
  "js/scope.js",
  "manifest.webmanifest",
  "testi.html",
  "ATTRIBUTIONS.md",
  "README.md",
  "../../privacy.html",
  "../../accessibilita.html",
  "../../pwa-common/gbprof-accessibility.css?v=1",
  "../../pwa-common/gbprof-accessibility.js?v=1",
  "../ui-focus/history-focus.css?v=1",
  "../ui-focus/history-focus.js?v=1"
];
const URLS=new Set(ASSETS.map(p=>new URL(p,self.location.href).href));
const ROOT=new URL('./',self.location.href).href;
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE_NAME);await c.addAll(ASSETS.map(p=>new Request(new URL(p,self.location.href),{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;const own=r.url.startsWith(ROOT);if(!own&&!URLS.has(r.url))return;
e.respondWith((async()=>{const c=await caches.open(CACHE_NAME),cached=await c.match(r);if(cached)return cached;try{const response=await fetch(r);if(response.ok&&URLS.has(r.url))await c.put(r,response.clone());return response}catch{if(r.mode==='navigate'&&own)return await c.match(new URL('index.html',ROOT).href)||Response.error();return Response.error()}})());
});
