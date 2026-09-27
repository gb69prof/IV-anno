const PREFIX='gbprof-alfieri-';
const CACHE=PREFIX+'6bfdfbef7c2c9d';
const CORE=["./", "assets/alfieri.png", "assets/app.js", "assets/css/alfieri.css", "assets/css/lesson-focus.css", "assets/css/style.css", "assets/icons/icon-180.png", "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/icon.svg", "assets/immagini/alfieri.webp", "assets/js/app.js", "assets/js/content.js", "assets/js/lesson-focus.js", "assets/js/study-workspace.js", "assets/mappe/conclusione.svg", "assets/mappe/fratture.svg", "assets/mappe/immagine-del-mondo.svg", "assets/mappe/introduzione.svg", "assets/mappe/mirra.svg", "assets/mappe/opere.svg", "assets/mappe/poetica.svg", "assets/mappe/saul.svg", "assets/style.css", "fonti.html", "index.html", "lezioni/conclusione.html", "lezioni/fratture.html", "lezioni/immagine-del-mondo.html", "lezioni/introduzione.html", "lezioni/mirra.html", "lezioni/opere.html", "lezioni/poetica.html", "lezioni/saul.html", "lezioni/scrittore.html", "manifest.json", "mappe.html"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const hit=await cache.match(event.request,{ignoreSearch:true});
  if(hit)return hit;
  try{return await fetch(event.request);}catch(error){
   if(event.request.mode==='navigate')return cache.match('index.html');
   throw error;
  }
 }));
});
