import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname,"..");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full); else files.push(full);
  }
}
walk(root);
const errors=[];
const htmlFiles=files.filter(file=>file.endsWith(".html"));
for(const file of htmlFiles){
  const text=fs.readFileSync(file,"utf8");
  const ids=[...text.matchAll(/\bid=["']([^"']+)["']/g)].map(match=>match[1]);
  const duplicate=ids.filter((id,index)=>ids.indexOf(id)!==index);
  if(duplicate.length) errors.push(`${path.relative(root,file)}: ID duplicati ${[...new Set(duplicate)].join(", ")}`);
  for(const match of text.matchAll(/\b(?:src|href)=["']([^"'#?]+)["']/g)){
    const ref=match[1];
    if(/^(?:https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const target=path.resolve(path.dirname(file),ref);
    if(!fs.existsSync(target)) errors.push(`${path.relative(root,file)}: risorsa mancante ${ref}`);
  }
  if(/(?:^|["'])\/(?:Users|home|workspace|tmp)\//.test(text)) errors.push(`${path.relative(root,file)}: percorso locale assoluto`);
}
const sw=fs.readFileSync(path.join(root,"service-worker.js"),"utf8");
const cacheBlock=sw.match(/const LOCAL_ASSETS = \[([\s\S]*?)\];/)?.[1] || "";
for(const match of cacheBlock.matchAll(/["']\.\/([^"']*)["']/g)){
  const ref=match[1];
  if(!ref) continue;
  if(!fs.existsSync(path.join(root,ref))) errors.push(`service-worker.js: risorsa in cache mancante ./${ref}`);
}
const app=fs.readFileSync(path.join(root,"assets/js/app.js"),"utf8");
for(const id of ["introduzione","fratture","immagine-del-mondo","poetica","opere","capitoli","conclusione"]){
  if(!app.includes(`"${id}"`)) errors.push(`app.js: dati mancanti per ${id}`);
}
if(!app.includes("Rifai soltanto gli errori")) errors.push("app.js: recupero selettivo assente");
if(!app.includes("CITAZIONI DALLA LEZIONE")) errors.push("app.js: esportazione TXT incompleta");
if(errors.length){ console.error(errors.join("\n")); process.exit(1); }
console.log(`OK: ${htmlFiles.length} pagine HTML, ${files.length} file, collegamenti locali e cache coerenti.`);
