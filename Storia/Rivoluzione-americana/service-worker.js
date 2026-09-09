/* Aggiornare la versione quando cambia un file precache. */
const CACHE_PREFIX='rivoluzione-americana-';
const CACHE_NAME=CACHE_PREFIX+'v1.0.1';
const ASSETS=[
  "./",
  "index.html",
  "app.html",
  "css/style.css",
  "js/data.js",
  "js/content.js",
  "js/app.js",
  "js/cover.js",
  "manifest.webmanifest",
  "README.md",
  "ATTRIBUTIONS.md",
  "assets/img/documents/bill-of-rights.jpg",
  "assets/img/documents/constitution.jpg",
  "assets/img/documents/declaration.jpg",
  "assets/img/documents/wheatley.webp",
  "assets/img/icons/icon-192.png",
  "assets/img/icons/icon-512.png",
  "assets/img/schemi/bill-rights.svg",
  "assets/img/schemi/colonie.svg",
  "assets/img/schemi/confederazione.svg",
  "assets/img/schemi/controlli.svg",
  "assets/img/schemi/costituzione.svg",
  "assets/img/schemi/crisi.svg",
  "assets/img/schemi/dichiarazione.svg",
  "assets/img/schemi/economie.svg",
  "assets/img/schemi/federalismo.svg",
  "assets/img/schemi/federalisti.svg",
  "assets/img/schemi/francia.svg",
  "assets/img/schemi/geografia.svg",
  "assets/img/schemi/guerra.svg",
  "assets/img/schemi/indipendenza.svg",
  "assets/img/schemi/liberta.svg",
  "assets/img/schemi/marbury.svg",
  "assets/img/schemi/paine.svg",
  "assets/img/schemi/percorso.svg",
  "assets/img/schemi/proclamazione.svg",
  "assets/img/schemi/rappresentanza.svg",
  "assets/img/schemi/saratoga.svg",
  "assets/img/schemi/tasse.svg",
  "assets/img/schemi/tea-act.svg",
  "assets/img/schemi/teatri-guerra.svg",
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
