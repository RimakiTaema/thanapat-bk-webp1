#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const folders = ['exlist'];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function walkDir(dir, base) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(ent => {
    if (ent.name.startsWith('.')) return;
    const full = path.join(dir, ent.name);
    const rel = path.join(base, ent.name).split(path.sep).join('/');
    if (ent.isDirectory()) {
      results.push(...walkDir(full, rel));
    } else if (ent.isFile()) {
      results.push({ name: ent.name, rel });
    }
  });
  return results;
}

let html = '';

const indent = '        ';

folders.forEach(folder => {
  const dir = path.join(root, folder);
  const items = walkDir(dir, folder);
  const lines = [];
  lines.push(`<h3>${escapeHtml(folder)}</h3>`);
  if (items.length === 0) {
    lines.push(`<p><em>(no items)</em></p>`);
  } else {
    lines.push('<ul>');
    items.forEach(item => {
      const href = encodeURI(item.rel);
      lines.push(`<li><a href="${href}" target="right">${escapeHtml(item.rel)}</a></li>`);
    });
    lines.push('</ul>');
  }
  html += lines.map(l => indent + l).join('\n') + '\n';
});

const startMarker = '<!-- AUTO-GENERATED LIST START -->';
const endMarker = '<!-- AUTO-GENERATED LIST END -->';
const leftPath = path.join(root, 'left.html');
let left = fs.readFileSync(leftPath, 'utf8');

const fragment = `${startMarker}\n${html}\n${endMarker}`;

const si = left.indexOf(startMarker);
const ei = left.indexOf(endMarker, si >= 0 ? si : 0);
if (si >= 0 && ei >= 0) {
  const before = left.slice(0, si);
  const after = left.slice(ei + endMarker.length);
  left = before + fragment + after;
} else {
  left = left.replace(/<\/body>/i, fragment + '\n</body>');
}

fs.writeFileSync(leftPath, left, 'utf8');
console.log('Generated list inserted into left.html');
