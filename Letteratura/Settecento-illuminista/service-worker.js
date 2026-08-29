const CACHE_PREFIX = "settecento-illuminista-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const CORE = [
  "./","index.html","offline.html","manifest.webmanifest",
  "assets/styles.css","assets/data.js","assets/app.js",
  "content/00-introduzione.txt","content/01-goldoni.txt","content/02-parini.txt","content/03-alfieri.txt","content/04-saperi-vocabolario.txt",
  "assets/images/copertina-indice.webp","assets/images/copertina-indice.png",
  "assets/images/mappa-introduzione.webp","assets/images/mappa-introduzione.png",
  "assets/images/mappa-goldoni.webp","assets/images/mappa-goldoni.png",
  "assets/images/mappa-parini.webp","assets/images/mappa-parini.png",
  "assets/images/mappa-alfieri.webp","assets/images/mappa-alfieri.png",
  "assets/images/visual-mondo.svg","assets/images/visual-fratture.svg","assets/images/visual-immagine.svg",
  "assets/images/visual-poetica.svg","assets/images/visual-opere.svg","assets/images/visual-conclusione.svg",
  "assets/icons/favicon-32.png","assets/icons/icon-180.png","assets/icons/icon-192.png","assets/icons/icon-512.png"
];

self.addEventListener("install",event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate",event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch",event => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy));
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match("./")) || (await caches.match("offline.html"))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy));
    }
    return response;
  })));
});

