import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docsDir = path.dirname(fileURLToPath(import.meta.url));
const literatureDir = path.resolve(docsDir, "../..");
const registryPath = path.join(literatureDir, "rete-pwa", "links.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const failures = [];
const appIds = new Set(registry.apps.map((app) => app.id));

async function assertExactPath(relativePath, label) {
  const clean = relativePath.replace(/[?#].*$/, "").replace(/\/$/, "/index.html");
  let cursor = literatureDir;
  for (const segment of clean.split("/").filter(Boolean)) {
    const entries = await readdir(cursor);
    if (!entries.includes(segment)) {
      failures.push(`${label}: percorso o maiuscole non validi: ${relativePath}`);
      return;
    }
    cursor = path.join(cursor, segment);
  }
  try {
    await access(cursor);
  } catch {
    failures.push(`${label}: destinazione assente: ${relativePath}`);
  }
}

const seenRuleIds = new Set();
for (const app of registry.apps) {
  await assertExactPath(app.path, `app ${app.id}`);
}

for (const [sourceId, relatedIds] of Object.entries(registry.related)) {
  if (!appIds.has(sourceId)) failures.push(`related: app sorgente sconosciuta: ${sourceId}`);
  for (const relatedId of relatedIds) {
    if (!appIds.has(relatedId)) failures.push(`related ${sourceId}: app sconosciuta: ${relatedId}`);
    if (relatedId === sourceId) failures.push(`related ${sourceId}: auto-collegamento non ammesso`);
  }
}

for (const rule of registry.bridges) {
  if (seenRuleIds.has(rule.id)) failures.push(`regola duplicata: ${rule.id}`);
  seenRuleIds.add(rule.id);
  if (!appIds.has(rule.source?.app)) failures.push(`${rule.id}: app sorgente sconosciuta`);
  if (!rule.source?.selector) failures.push(`${rule.id}: selettore sorgente assente`);
  const sourceApp = registry.apps.find((app) => app.id === rule.source?.app);
  const sourceBase = sourceApp?.path.endsWith("/") ? sourceApp.path : "";
  await assertExactPath(`${sourceBase}${rule.source?.page || "index.html"}`, `${rule.id} sorgente`);
  if (!Array.isArray(rule.destinations) || rule.destinations.length === 0) {
    failures.push(`${rule.id}: nessuna destinazione`);
  }
  for (const destination of rule.destinations || []) {
    await assertExactPath(destination.path, `${rule.id} destinazione`);
    if (!destination.label) failures.push(`${rule.id}: etichetta destinazione assente`);
  }
}

if (failures.length) {
  console.error(`Verifica fallita (${failures.length} problemi):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Verifica superata: ${registry.apps.length} PWA, ${registry.bridges.length} ponti contestuali, percorsi e relazioni coerenti.`);
}
