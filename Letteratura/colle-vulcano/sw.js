const CACHE = "leopardi-v8";
const CORE = [
  "./",
  "./index.html",
  "images/leopardi-map.png",
  "images/casa-leopardi.png",
  "images/collina-infinito.png",
  "images/recanati-borgo.png",
  "images/natura-indifferente.png",
  "images/bruto-saffo.png",
  "images/napoli-mare.png",
  "manifest.webmanifest",
];

async function cacheAppShell() {
  const cache = await caches.open(CACHE);
  await cache.addAll(CORE);

  const indexResponse = await fetch("./index.html", { cache: "reload" });
  if (!indexResponse.ok) return;
  await cache.put("./index.html", indexResponse.clone());

  const indexHtml = await indexResponse.text();
  const generatedAssets = [
    ...indexHtml.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);
  if (generatedAssets.length) await cache.addAll(generatedAssets);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const request = event.request;
  const url = new URL(request.url);
  event.respondWith(
    caches.match(request, { ignoreSearch: request.mode === "navigate" }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && url.origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() =>
          request.mode === "navigate"
            ? caches.match("./index.html")
            : Promise.reject(new Error("Risorsa non disponibile offline")),
        ),
    ),
  );
});
