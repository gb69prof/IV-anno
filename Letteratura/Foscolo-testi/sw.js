const CACHE_NAME = "biblioteca-foscolo-v2";

function localAssetsFrom(html) {
  return [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map(match => match[1])
    .filter(value => value && !value.startsWith("#") && !value.startsWith("http"))
    .map(value => new URL(value, self.registration.scope).href);
}

function cssAssetsFrom(css, stylesheetUrl) {
  return [...css.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/g)]
    .map(match => match[1])
    .filter(value => value && !value.startsWith("data:"))
    .map(value => new URL(value, stylesheetUrl).href);
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const pageResponse = await fetch("./index.html", { cache: "reload" });
    if (!pageResponse.ok) throw new Error("Impossibile preparare la biblioteca offline");
    const html = await pageResponse.clone().text();
    await cache.put("./index.html", pageResponse);
    await cache.put("./", await fetch("./", { cache: "reload" }));

    const assetUrls = [...new Set(localAssetsFrom(html))];
    await Promise.all(assetUrls.map(async url => {
      const response = await fetch(url, { cache: "reload" });
      if (!response.ok) return;
      await cache.put(url, response.clone());
      if (response.headers.get("content-type")?.includes("text/css")) {
        const css = await response.text();
        await Promise.all(cssAssetsFrom(css, url).map(async assetUrl => {
          const assetResponse = await fetch(assetUrl, { cache: "reload" });
          if (assetResponse.ok) await cache.put(assetUrl, assetResponse);
        }));
      }
    }));
  })());
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match("./index.html"));
      return cached || network;
    })
  );
});
