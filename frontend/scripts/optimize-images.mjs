// Usage: node scripts/optimize-images.mjs <src-dir> <out-dir> [width]
// Writes .avif and .webp next to each other for every jpg/png in src-dir.
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [src, out, width = '1600'] = process.argv.slice(2);
if (!src || !out) {
  console.error('usage: optimize-images.mjs <src> <out> [width]');
  process.exit(1);
}
await mkdir(out, { recursive: true });

for (const file of await readdir(src)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const name = file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const img = sharp(path.join(src, file)).rotate().resize({ width: Number(width), withoutEnlargement: true });
  await img.clone().webp({ quality: 74 }).toFile(path.join(out, `${name}.webp`));
  await img.clone().avif({ quality: 52 }).toFile(path.join(out, `${name}.avif`));
  console.log(name);
}
