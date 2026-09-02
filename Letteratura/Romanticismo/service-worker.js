const CACHE_PREFIX = "romanticismo-pwa-";
const CACHE_NAME = CACHE_PREFIX + "v3.0.2";

const CORE = [
  '../../privacy.html',
  '../../accessibilita.html',
  '../../pwa-common/gbprof-accessibility.css?v=1',
  '../../pwa-common/gbprof-accessibility.js?v=1',
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest?v=3.0.2",
  "./assets/css/style.css?v=3.0.2",
  "./assets/js/lessons-data.js?v=3.0.2",
  "./assets/js/app.js?v=3.0.2",
  "./assets/images/icon-192.png",
  "./assets/images/icon-512.png",
  "./assets/images/il_romanticismo_un_viaggio_interattivo.png"
];

const OPTIONAL = [
  "./assets/images/mappa_del_romanticismo_un_viaggio_visivo.png",
  "./assets/images/mappa_del_romanticismo_europeo.png",
  "./assets/images/mappa_del_romanticismo_nuclei_fondamentali.png",
  "./assets/images/mappa_delle_contraddizioni_romantiche.png",
  "./assets/images/mappa_del_romanticismo_italiano.png",
  "./assets/images/mappa_dei_principali_autori_romantici.png",
  "./assets/images/mappa_storica_del_romanzo_europeo.png",
  "./assets/images/mappa_storica_su_manzoni_e_romanticismo.png",
  "./assets/images/mappa_versale_leopardi_un_viaggio_romantico.png",
  "./assets/images/a_detailed_infographic_study_map_in_italian_abou.png",
  "./assets/images/a_polished_educational_infographic_poster_page_i.png",
  "./assets/images/a_highly_detailed_infographic_mind_map_style_pos.png",
  "./assets/images/a_detailed_infographic_mind_map_poster_style_ima.png",
  "./assets/docs/Dispensa_Romanticismo_gbprof_Libera.docx"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE);
    await Promise.allSettled(OPTIONAL.map(asset => cache.add(asset)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
        return response;
      } catch {
        return (await caches.match(event.request)) || (await caches.match("./index.html")) || caches.match("./offline.html");
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return new Response("", { status: 503, statusText: "Offline" });
    }
  })());
});
