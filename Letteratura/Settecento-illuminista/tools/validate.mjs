import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname,"..");
const failures = [];
const exists = rel => fs.existsSync(path.join(root,rel));
const html = fs.readFileSync(path.join(root,"index.html"),"utf8");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id,index) => ids.indexOf(id) !== index);
if (duplicates.length) failures.push("ID duplicati: " + [...new Set(duplicates)].join(", "));

for (const match of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
  const target = match[1].split("?")[0];
  if (/^(?:https?:|mailto:|\.\.\/)/.test(target)) continue;
  if (!exists(target)) failures.push("Risorsa HTML assente: " + target);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root,"manifest.webmanifest"),"utf8"));
for (const icon of manifest.icons || []) if (!exists(icon.src)) failures.push("Icona manifest assente: " + icon.src);

const sw = fs.readFileSync(path.join(root,"service-worker.js"),"utf8");
const coreBlock = sw.match(/const CORE = \[([\s\S]*?)\];/)?.[1] || "";
for (const match of coreBlock.matchAll(/"([^"]+)"/g)) {
  const target = match[1] === "./" ? "index.html" : match[1];
  if (!exists(target)) failures.push("Risorsa cache assente: " + target);
}

const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"assets/data.js"),"utf8"),context);
const data = context.window.SETTECENTO_DATA;
if (!data || data.lessons.length !== 4) failures.push("Le lezioni devono essere quattro.");

for (const lesson of data.lessons) {
  if (!exists(lesson.source)) failures.push("Testo assente: " + lesson.source);
  if (!exists(lesson.map) || !exists(lesson.mapPreview)) failures.push("Mappa assente per " + lesson.id);
  if (lesson.quiz.length < 5) failures.push("Meno di 5 domande per " + lesson.id);
  const answers = new Set();
  for (const q of lesson.quiz) {
    if (q.options.length !== 3) failures.push("Opzioni non pari a 3: " + q.id);
    if (![0,1,2].includes(q.correct)) failures.push("Risposta corretta non valida: " + q.id);
    if (!q.explanation || !q.recovery?.anchor || !q.recovery?.q) failures.push("Recupero incompleto: " + q.id);
    answers.add(q.correct);
  }
  if (answers.size < 3) failures.push("Risposte A/B/C non distribuite in " + lesson.id);
}

if (data.finalQuiz.length < 6) failures.push("Verifica finale troppo breve.");
const allFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(full); else allFiles.push(full);
  }
}
walk(root);
for (const file of allFiles.filter(file => /\.(?:html|css|js|mjs|md|txt|webmanifest|svg)$/.test(file))) {
  const content = fs.readFileSync(file,"utf8");
  if (/\/(?:workspace|home|Users)\//.test(content)) failures.push("Percorso locale in " + path.relative(root,file));
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("VALIDAZIONE OK");
console.log("4 lezioni · 20 quesiti di sezione · " + data.finalQuiz.length + " quesiti finali");
console.log("Manifest, cache, risorse, ID e percorsi verificati.");

