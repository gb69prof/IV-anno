import { mkdir, cp, readFile, writeFile, readdir, rm } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { createHash } from "node:crypto";
const files = [
  "index.html",
  "styles.css",
  "src",
  "assets",
  "manifest.webmanifest",
];
const destination = resolve("dist");
if (!destination.startsWith(resolve(".") + sep))
  throw Error("Output non valido");
await rm(destination, { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const file of files) await cp(file, "dist/" + file, { recursive: true });
async function walk(dir) {
  let out = [];
  for (const f of await readdir(dir, { withFileTypes: true }))
    out.push(
      ...(f.isDirectory()
        ? await walk(dir + "/" + f.name)
        : [dir + "/" + f.name]),
    );
  return out;
}
const all = await walk("dist");
const hash = createHash("sha256");
for (const f of all.sort()) hash.update(await readFile(f));
const version = hash.digest("hex").slice(0, 12);
const urls = all.map((f) => "./" + f.slice(5)).filter((f) => f !== "./sw.js");
const sw = `const CACHE='foscolo-soglie-${version}';\nconst FILES=${JSON.stringify(["./", ...urls])};\nself.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});\nself.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('foscolo-soglie-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});\nself.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||new Response('Contenuto non disponibile offline',{status:503}))));});`;
await writeFile("dist/sw.js", sw);
await writeFile("sw.js", sw);
for (const name of [
  "assets/three.module.js",
  "assets/cover.webp",
  "assets/sky.webp",
  "assets/coastal-tree.glb",
  "assets/grass.glb",
  "assets/ground-color.jpg",
  "assets/ground-normal.jpg",
  "assets/stone-color.jpg",
  "assets/stone-normal.jpg",
])
  await readFile("dist/" + name);
console.log(`Build completo: ${all.length} file, cache ${version}.`);
