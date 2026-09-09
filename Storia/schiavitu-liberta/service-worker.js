const PREFIX='schiavitu-liberta-';
const CACHE=PREFIX+'94d9d29dd6f0';
const LOCAL=["assets/css/style.css", "assets/dati/fonti.json", "assets/dati/hotspots.json", "assets/dati/portraits.json", "assets/dati/timeline.json", "assets/icone/icon-192.png", "assets/icone/icon-512.png", "assets/icone/icon.svg", "assets/immagini/ritratto-calhoun.jpg", "assets/immagini/ritratto-clarkson.jpg", "assets/immagini/ritratto-dessalines.jpg", "assets/immagini/ritratto-douglass.jpg", "assets/immagini/ritratto-equiano.jpg", "assets/immagini/ritratto-fitzhugh.jpg", "assets/immagini/ritratto-garrison.jpg", "assets/immagini/ritratto-gregoire.jpg", "assets/immagini/ritratto-hall.jpg", "assets/immagini/ritratto-jefferson.jpg", "assets/immagini/ritratto-napoleone.jpg", "assets/immagini/ritratto-schoelcher.jpg", "assets/immagini/ritratto-toussaint.jpg", "assets/immagini/ritratto-truth.jpg", "assets/immagini/ritratto-wilberforce.jpg", "assets/immagini/schiavitu-liberta.PNG", "assets/js/app.js", "assets/mappe/01.svg", "assets/mappe/02.svg", "assets/mappe/03.svg", "assets/mappe/04.svg", "assets/mappe/05.svg", "assets/mappe/06.svg", "assets/mappe/07.svg", "assets/mappe/08.svg", "assets/mappe/09.svg", "assets/mappe/10.svg", "assets/mappe/11.svg", "assets/mappe/12.svg", "bibliografia.html", "carte.html", "confronto.html", "documenti.html", "index.html", "laboratorio.html", "lezioni/01-che-cosa-e-la-schiavitu.html", "lezioni/02-tratta-atlantica.html", "lezioni/03-illuminismo-contraddizione.html", "lezioni/04-stati-uniti.html", "lezioni/05-francia.html", "lezioni/06-voci-degli-schiavi.html", "lezioni/07-haiti.html", "lezioni/08-tesi-a-confronto.html", "lezioni/09-abolizione.html", "lezioni/10-oggi.html", "manifest.json", "mappe.html", "offline.html", "percorso.html", "privacy-accessibilita.html", "protagonisti.html", "test.html", "timeline.html"];
const SHARED=["../../pwa-common/gbprof-accessibility.css", "../../pwa-common/gbprof-accessibility.js"];
const BASE=new URL('./',self.location.href);
const ALLOWED=new Set([...LOCAL,...SHARED].map(p=>new URL(p,BASE).href));
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll([...LOCAL,...SHARED].map(p=>new Request(new URL(p,BASE),{cache:'reload'})));})()));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith(PREFIX)&&n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin!==BASE.origin)return;
 const inScope=u.pathname.startsWith(BASE.pathname);u.search='';u.hash='';
 if(!inScope&&!ALLOWED.has(u.href))return;
 if(u.pathname===BASE.pathname)u.pathname+='index.html';
 e.respondWith((async()=>{
  const c=await caches.open(CACHE);const hit=await c.match(u.href);
  // Ogni versione è una copia coerente; nuove versioni passano da install/activate.
  if(hit)return hit;
  try{return await fetch(e.request);}catch{
   if(e.request.mode==='navigate')return (await c.match(new URL('offline.html',BASE).href))||Response.error();
   return Response.error();
  }
 })());
});
