#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const ignored = new Set([".git", "node_modules", "dist"]);

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file, output);
    else output.push(file);
  }
  return output;
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const failures = [];
const warnings = [];

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const source = fs.readFileSync(file, "utf8");
  if (!/<html\b[^>]*\blang=["']it(?:-[A-Z]+)?["']/i.test(source)) failures.push(`${relative}: lingua pagina assente o diversa da it`);
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(source)) failures.push(`${relative}: title assente`);
  if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(source)) failures.push(`${relative}: zoom bloccato`);
  for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=/.test(match[0])) failures.push(`${relative}: immagine senza alt`);
  }
  for (const match of source.matchAll(/<iframe\b[^>]*>/gi)) {
    if (!/\btitle\s*=/.test(match[0])) failures.push(`${relative}: iframe senza title`);
    if (/(?:^|\s)src=["']https?:\/\//i.test(match[0])) failures.push(`${relative}: iframe remoto caricato automaticamente`);
  }
  if (!/<h1\b/i.test(source) && !/id=["'](?:app|root)["']/.test(source)) warnings.push(`${relative}: H1 non rilevato staticamente`);
}

const manifestFiles = files.filter((file) => /manifest.*\.(?:json|webmanifest)$/i.test(file));
for (const file of manifestFiles) {
  const relative = path.relative(root, file);
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    failures.push(`${relative}: JSON non valido (${error.message})`);
    continue;
  }
  for (const key of ["name", "short_name", "start_url", "display"]) {
    if (!manifest[key]) failures.push(`${relative}: proprietà ${key} assente`);
  }
  if (!Array.isArray(manifest.icons) || !manifest.icons.length) failures.push(`${relative}: icone assenti`);
  for (const icon of manifest.icons || []) {
    if (!icon.src) continue;
    const iconFile = path.resolve(path.dirname(file), decodeURIComponent(icon.src.split(/[?#]/)[0]));
    if (!fs.existsSync(iconFile)) failures.push(`${relative}: icona non trovata (${icon.src})`);
  }
}

const codeFiles = files.filter((file) => /\.(?:html|js|mjs|ts|tsx)$/i.test(file) && !file.includes(`${path.sep}vendor${path.sep}`) && !file.includes(`${path.sep}tools${path.sep}`));
const trackerPattern = /google-analytics|googletagmanager|\bgtag\s*\(|\bfbq\s*\(|facebook\.net|matomo|plausible|hotjar|document\.cookie/i;
for (const file of codeFiles) {
  if (trackerPattern.test(fs.readFileSync(file, "utf8"))) failures.push(`${path.relative(root, file)}: possibile tracker/cookie`);
}

console.log(`HTML: ${htmlFiles.length} · manifest: ${manifestFiles.length}`);
console.log(`Errori: ${failures.length} · avvisi: ${warnings.length}`);
warnings.forEach((message) => console.log(`AVVISO ${message}`));
failures.forEach((message) => console.error(`ERRORE ${message}`));
process.exitCode = failures.length ? 1 : 0;
