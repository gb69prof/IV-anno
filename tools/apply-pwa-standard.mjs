#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const ignoredDirectories = new Set([".git", "node_modules", "dist"]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return entry.name.toLowerCase().endsWith(".html") ? [absolute] : [];
  });
}

function relativeRoot(file) {
  const value = path.relative(path.dirname(file), root).replaceAll(path.sep, "/");
  return value || ".";
}

function addStandardAssets(source, file) {
  if (/pwa-common\/gbprof-accessibility\.css/.test(source)) return source;
  const prefix = relativeRoot(file);
  const link = `  <link rel="stylesheet" href="${prefix}/pwa-common/gbprof-accessibility.css?v=1">\n`;
  const script = `  <script src="${prefix}/pwa-common/gbprof-accessibility.js?v=1"></script>\n`;
  source = source.replace(/<\/head>/i, `${link}</head>`);
  source = source.replace(/<\/body>/i, `${script}</body>`);
  return source;
}

function removeZoomBlocks(source) {
  return source
    .replace(/,?\s*user-scalable\s*=\s*no/gi, "")
    .replace(/,?\s*maximum-scale\s*=\s*1(?:\.0)?/gi, "")
    .replace(/content=(['"])([^'"]*?),\s*\1/gi, "content=$1$2$1");
}

function deferStaticYouTube(source) {
  return source.replace(
    /<iframe\b([^>]*?)\bsrc=(['"])(https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/[^'"]+)\2([^>]*)>/gi,
    (whole, before, quote, url, after) => {
      if (/\bdata-gbprof-src\s*=/.test(whole)) return whole;
      const safeUrl = url.replace("www.youtube.com", "www.youtube-nocookie.com");
      return `<iframe${before}data-gbprof-src=${quote}${safeUrl}${quote}${after}>`;
    }
  );
}

let changed = 0;
for (const file of walk(root)) {
  const original = fs.readFileSync(file, "utf8");
  let source = original;
  source = removeZoomBlocks(source);
  source = deferStaticYouTube(source);
  source = addStandardAssets(source, file);
  if (source !== original) {
    fs.writeFileSync(file, source);
    changed += 1;
  }
}

console.log(`Standard PWA applicato a ${changed} file HTML.`);
