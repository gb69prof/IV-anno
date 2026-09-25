'use strict';
const PREFIX = 'gbprof-rivoluzione-approfondimento:' + self.registration.scope + ':';
const CACHE = PREFIX + 'b3b15a14e917';
const ASSETS = ["./","app.js","assets/bastiglia.webp","assets/protagoniste/tricoteuses.png","assets/protagoniste/louise-felicite-de-keralio.png","assets/protagoniste/claire-lacombe.png","assets/protagoniste/pauline-leon.png","assets/protagoniste/madame-roland.png","assets/protagoniste/theroigne-de-mericourt.png","assets/protagoniste/maria-antonietta.png","assets/protagoniste/charlotte-corday.png","assets/protagoniste/olympe-de-gouges.png","assets/brumaio.webp","assets/icon-180.png","assets/icon-192.png","assets/icon-512.png","cerca.html","diario.html","documenti.html","documento-anno-iii.html","documento-brumaio-immagine.html","documento-cahiers.html","documento-costituzione-1791.html","documento-costituzione-1793.html","documento-dichiarazione-1789.html","documento-dichiarazione-donna.html","documento-pere-duchesne.html","documento-pratile.html","documento-regolamento-donne.html","documento-sieyes.html","documento-vieux-cordelier.html","donne.html","evento-18-brumaio.html","evento-19-brumaio.html","evento-abolizione-schiavitu.html","evento-anno-iii.html","evento-assemblea-nazionale.html","evento-bastiglia.html","evento-beni-chiesa.html","evento-campo-marte.html","evento-clero.html","evento-comitato.html","evento-costituente.html","evento-costituzione-1791.html","evento-costituzione-1793.html","evento-diritti-uomo.html","evento-donne-escluse.html","evento-egitto.html","evento-eguali.html","evento-fazioni-eliminate.html","evento-federazione.html","evento-fruttidoro.html","evento-girondini.html","evento-grande-paura.html","evento-guerra-1792.html","evento-italia.html","evento-le-chapelier.html","evento-leva.html","evento-luigi-esecuzione.html","evento-marat-morte.html","evento-notabili.html","evento-pallacorda.html","evento-pratile-1795.html","evento-pratile-fleurus.html","evento-quattro-agosto.html","evento-settembre.html","evento-sospetti-maximum.html","evento-stati-generali.html","evento-termidoro.html","evento-tuileries.html","evento-valmy.html","evento-vandea.html","evento-varennes.html","evento-vendemmiaio.html","evento-versailles.html","fase-1789.html","fase-antefatto.html","fase-brumaio.html","fase-direttorio.html","fase-monarchia-costituzionale.html","fase-repubblica-terrore.html","fonti.html","glossario.html","gruppi.html","gruppo-cordiglieri.html","gruppo-enrages.html","gruppo-foglianti.html","gruppo-giacobini.html","gruppo-gironda.html","gruppo-hebertisti.html","gruppo-indulgenti.html","gruppo-montagna.html","gruppo-ordini.html","gruppo-pianura.html","gruppo-realisti.html","gruppo-religioni.html","gruppo-repubblicane.html","gruppo-sanculotti.html","gruppo-termidoriani.html","index.html","installazione.html","manifest.webmanifest","persona-babeuf.html","persona-barras.html","persona-brissot.html","persona-carnot.html","persona-carrier.html","persona-condorcet.html","persona-corday.html","persona-danton.html","persona-desmoulins.html","persona-hebert.html","persona-keralio.html","persona-lacombe.html","persona-lafayette.html","persona-leon.html","persona-lucien.html","persona-luigi-xvi.html","persona-marat.html","persona-maria-antonietta.html","persona-napoleone.html","persona-olympe.html","persona-robespierre.html","persona-roland.html","persona-saint-just.html","persona-sieyes.html","persona-theroigne.html","persona-toussaint.html","persona-tricoteuses.html","privacy.html","protagonisti.html","quiz.json","search-index.json","studio.html","styles.css","test.html","uomini.html","biografia-corday.html","biografia-keralio.html","biografia-lacombe.html","biografia-leon.html","biografia-maria-antonietta.html","biografia-olympe.html","biografia-roland.html","biografia-theroigne.html","biografia-tricoteuses.html"];
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

