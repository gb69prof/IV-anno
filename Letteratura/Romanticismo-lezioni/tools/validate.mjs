import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
const app = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/css/styles.css"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
const problems = [];

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) problems.push(`ID duplicati: ${[...new Set(duplicates)].join(", ")}`);

for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) problems.push(`Collegamento interno senza destinazione: #${match[1]}`);
}

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\balt="[^"]*"/.test(match[0])) problems.push(`Immagine senza alt: ${match[0].slice(0, 90)}`);
}

const localReferences = new Set();
for (const match of html.matchAll(/\b(?:href|src)="(\.\/[^"#?]+)(?:[?#][^"]*)?"/g)) localReferences.add(match[1]);
for (const item of manifest.icons || []) localReferences.add(item.src.replace(/^\.\//, "./"));
for (const match of serviceWorker.matchAll(/"(\.\/[^"?]+)(?:\?[^"}]*)?"/g)) localReferences.add(match[1]);

for (const reference of localReferences) {
  const target = path.join(root, reference.slice(2));
  if (!fs.existsSync(target)) problems.push(`Risorsa locale mancante: ${reference}`);
}

const cached = [...serviceWorker.matchAll(/"(\.\/[^"?]+)(?:\?[^"}]*)?"/g)].map(match => match[1]);
const essential = [
  "./index.html",
  "./manifest.webmanifest",
  "./offline.html",
  "./assets/css/styles.css",
  "./assets/js/app.js",
  ...[...html.matchAll(/\bsrc="(\.\/assets\/(?:images|maps)\/[^"?]+)"/g)].map(match => match[1])
];
for (const item of essential) {
  if (!cached.includes(item)) problems.push(`Risorsa essenziale non precache: ${item}`);
}

if (!serviceWorker.includes("key.startsWith(CACHE_PREFIX)")) problems.push("La pulizia cache non è limitata al prefisso della PWA.");
if (!/id="notebookText"/.test(html) || !/id="notebookExport"/.test(html)) problems.push("Taccuino incompleto.");
if (!/id="saperi"/.test(html) || !/id="vocabolario"/.test(html) || !/id="verifica"/.test(html)) problems.push("Barra di sedimentazione incompleta.");

const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
const cssBalance = [...cssWithoutComments].reduce((total, character) => total + (character === "{" ? 1 : character === "}" ? -1 : 0), 0);
if (cssBalance !== 0) problems.push(`Parentesi CSS non bilanciate: ${cssBalance}`);

const quizMatch = app.match(/const quiz = (\[[\s\S]*?\n  \]);\n\n  const quizStart/);
if (!quizMatch) {
  problems.push("Dati del test non individuati.");
} else {
  const quiz = vm.runInNewContext(quizMatch[1]);
  const answerDistribution = [0, 0, 0];
  quiz.forEach((item, index) => {
    if (item.options.length !== 3) problems.push(`Domanda ${index + 1}: non ha tre opzioni.`);
    if (!Number.isInteger(item.correct) || item.correct < 0 || item.correct > 2) problems.push(`Domanda ${index + 1}: risposta corretta non valida.`);
    else answerDistribution[item.correct] += 1;
    if (!item.explanation?.trim()) problems.push(`Domanda ${index + 1}: spiegazione mancante.`);
    if (!Array.isArray(item.recovery) || item.recovery.length !== 5) problems.push(`Domanda ${index + 1}: recupero incompleto.`);
    const target = item.recovery?.[4];
    if (target && !ids.includes(target)) problems.push(`Domanda ${index + 1}: destinazione di recupero #${target} mancante.`);
  });
  if (Math.max(...answerDistribution) - Math.min(...answerDistribution) > 1) problems.push(`Risposte corrette non distribuite: ${answerDistribution.join("/")}.`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validazione superata: ${ids.length} ID univoci, ${localReferences.size} risorse locali presenti, ${cached.length} risorse in cache, test coerente.`);
}
