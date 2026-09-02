#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const output = execFileSync("find", ["Letteratura", "Storia", "-type", "f", "(", "-name", "sw.js", "-o", "-name", "service-worker.js", ")", "-print0"], { cwd: root });
const files = output.toString().split("\0").filter(Boolean);
const arrayPattern = /(const\s+(?:LOCAL_ASSETS|CORE_ASSETS|APP_SHELL|CORE|ASSETS|FILES)\s*=\s*\[)/;
let changed = 0;
const required = [
  "../../pwa-common/gbprof-accessibility.css?v=1",
  "../../pwa-common/gbprof-accessibility.js?v=1",
  "../../privacy.html",
  "../../accessibilita.html"
];

for (const relative of files) {
  const file = path.join(root, relative);
  const original = fs.readFileSync(file, "utf8");
  if (!arrayPattern.test(original)) continue;
  const missing = required.filter((asset) => !original.includes(asset));
  if (!missing.length) continue;
  const additions = `\n${missing.map((asset) => `  '${asset}',`).join("\n")}`;
  const source = original.replace(arrayPattern, `$1${additions}`);
  fs.writeFileSync(file, source);
  changed += 1;
}

console.log(`Risorse comuni aggiunte alla cache di ${changed} service worker.`);
