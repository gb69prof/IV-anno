const CACHE_NAME = 'romanticismo-pwa-v1';
const CORE_ASSETS = [
  './', './index.html', './manifest.webmanifest', './assets/css/style.css', './assets/js/app.js',
  './assets/images/il_romanticismo_un_viaggio_interattivo.png',
  './assets/images/mappa_del_romanticismo_un_viaggio_visivo.png',
  './assets/images/mappa_del_romanticismo_europeo.png',
  './assets/images/mappa_del_romanticismo_nuclei_fondamentali.png',
  './assets/images/mappa_delle_contraddizioni_romantiche.png',
  './assets/images/mappa_del_romanticismo_italiano.png',
  './assets/images/mappa_dei_principali_autori_romantici.png',
  './assets/images/mappa_storica_del_romanzo_europeo.png',
  './assets/images/mappa_storica_su_manzoni_e_romanticismo.png',
  './assets/images/mappa_versale_leopardi_un_viaggio_romantico.png',
  './assets/images/a_detailed_infographic_study_map_in_italian_abou.png',
  './assets/images/a_polished_educational_infographic_poster_page_i.png',
  './assets/images/a_highly_detailed_infographic_mind_map_style_pos.png',
  './assets/images/a_detailed_infographic_mind_map_poster_style_ima.png',
  './assets/images/icon-192.png', './assets/images/icon-512.png',
  './assets/docs/Dispensa_Romanticismo_gbprof_Libera.docx'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request).then(networkResp => {
    const copy = networkResp.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return networkResp;
  }).catch(() => caches.match('./index.html'))));
});