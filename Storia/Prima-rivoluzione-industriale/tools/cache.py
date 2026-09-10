from pathlib import Path
import json,hashlib
p=Path(__file__).resolve().parents[1]
files=sorted(str(x.relative_to(p)) for x in p.rglob('*') if x.is_file() and x.suffix in ['.html','.css','.js','.svg','.png','.webp','.webmanifest'] and x.name!='service-worker.js' and 'tools' not in x.parts)
assets=['./']+files+['ATTRIBUTIONS.md','README.md','../../privacy.html','../../accessibilita.html','../../pwa-common/gbprof-accessibility.css?v=1','../../pwa-common/gbprof-accessibility.js?v=1','../ui-focus/history-focus.css?v=1','../ui-focus/history-focus.js?v=1']
h=hashlib.sha256()
for f in files:h.update((p/f).read_bytes())
script="""/* Cache isolata; rigenerare con python tools/cache.py. */
const CACHE_PREFIX='prima-rivoluzione-industriale-';
const CACHE_NAME=CACHE_PREFIX+'VERSION';
const ASSETS=ASSET_LIST;
const URLS=new Set(ASSETS.map(p=>new URL(p,self.location.href).href));
const ROOT=new URL('./',self.location.href).href;
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE_NAME);await c.addAll(ASSETS.map(p=>new Request(new URL(p,self.location.href),{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;const own=r.url.startsWith(ROOT);if(!own&&!URLS.has(r.url))return;
e.respondWith((async()=>{const c=await caches.open(CACHE_NAME),cached=await c.match(r);if(cached)return cached;try{const response=await fetch(r);if(response.ok&&URLS.has(r.url))await c.put(r,response.clone());return response}catch{if(r.mode==='navigate'&&own)return await c.match(new URL('index.html',ROOT).href)||Response.error();return Response.error()}})());
});
""".replace('VERSION',h.hexdigest()[:12]).replace('ASSET_LIST',json.dumps(assets,indent=2))
(p/'service-worker.js').write_text(script)
print('Precache:',len(assets),'risorse; versione',h.hexdigest()[:12])
