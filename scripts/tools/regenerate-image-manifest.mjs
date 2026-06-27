#!/usr/bin/env node
/**
 * Regenera scripts/data/apartment-image-manifest.js a partir das pastas em
 * assets/images/apartamentos/boa-viagem/apt-*
 *
 * Uso: node scripts/tools/regenerate-image-manifest.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const BV = './assets/images/apartamentos/boa-viagem';
const PINA = './assets/images/apartamentos/pina';

const FOLDERS = {
  'apartamento-2-quartos-boa-viagem': { base: BV, dir: 'apt-105', label: 'Apartamento 105 Boa Viagem' },
  'flat-golden-view-1006': { base: BV, dir: 'apt-1006', label: 'Flat Golden View 1006' },
  'studio-203-boa-viagem': { base: BV, dir: 'apt-203', label: 'Studio 203 Boa Viagem' },
  'apartamento-804-pina': { base: PINA, dir: 'apt-804', label: 'Apartamento 804 Pina' },
};

function normalizeBase(filename) {
  let base = filename.replace(/\.(webp|avif)$/i, '');
  base = base.replace(/\.avif$/i, '');
  return base.replace(/_opt$/, '');
}

function listImages(relativeDir) {
  const full = path.join(ROOT, relativeDir);
  if (!fs.existsSync(full)) return [];

  const files = fs.readdirSync(full);
  const chosen = new Map();

  for (const f of files) {
    if (f.endsWith('.md') || f.startsWith('teste_')) continue;
    if (!/\.(webp|avif)$/i.test(f)) continue;

    const key = normalizeBase(f);
    const ext = f.endsWith('.webp') ? 'webp' : 'avif';
    const existing = chosen.get(key);
    const score = (file, extension) => {
      let s = extension === 'webp' ? 2 : 1;
      if (file.includes('.avif.webp')) s = 1;
      return s;
    };

    if (!existing || score(f, ext) > score(existing.file, existing.ext)) {
      chosen.set(key, { file: f, ext });
    }
  }

  return [...chosen.values()].map((v) => v.file);
}

function sortKey(file) {
  const order = ['sala', 'quarto', 'cozinha', 'banheiro', 'area', 'piscina', 'estacionamento', 'lavanderia', 'omo', 'utensilios', 'portao', 'rua', 'entrada'];
  const lower = file.toLowerCase();
  for (let i = 0; i < order.length; i++) {
    if (lower.startsWith(order[i]) || lower.includes(`-${order[i]}`)) return i;
  }
  return 99;
}

function sortFiles(files) {
  return [...files].sort((a, b) => {
    const ka = sortKey(a);
    const kb = sortKey(b);
    if (ka !== kb) return ka - kb;
    return a.localeCompare(b, 'pt-BR');
  });
}

function toAlt(file, label) {
  const base = file.replace(/\.(webp|avif)$/i, '').replace(/_opt$/, '').replace(/\.avif$/, '');
  return `${label} — ${base.replace(/-/g, ' ')}`;
}

const manifest = {};

for (const [slug, { base, dir, label }] of Object.entries(FOLDERS)) {
  const files = sortFiles(listImages(`${base.replace(/^\.\//, '')}/${dir}`));
  manifest[slug] = files.map((file) => ({
    src: `${base}/${dir}/${file}`,
    alt: toAlt(file, label),
  }));
}

const out = `/**
 * Manifesto de fotos — gerado por scripts/tools/regenerate-image-manifest.mjs
 * Prefere .webp; inclui .avif quando não há webp equivalente.
 */

export const APARTMENT_IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};

/** @param {string} slug */
export function getManifestImages(slug) {
  return APARTMENT_IMAGE_MANIFEST[slug] || null;
}
`;

const target = path.join(ROOT, 'scripts/data/apartment-image-manifest.js');
fs.writeFileSync(target, out);

for (const [slug, imgs] of Object.entries(manifest)) {
  console.log(`${slug}: ${imgs.length} fotos`);
}

console.log(`\nAtualizado: ${target}`);
