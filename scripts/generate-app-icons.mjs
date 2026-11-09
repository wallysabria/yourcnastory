import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const url = 'https://yourcnastory.org/wp-content/uploads/2025/09/cropped-favicon-270x270.png';
const original = 'public' + new URL(url).pathname;
fs.mkdirSync(path.dirname(original), { recursive: true });
if (!fs.existsSync(original)) {
  const response = await fetch(url);
  if (!response.ok) throw Error('Icon source ' + response.status);
  fs.writeFileSync(original, Buffer.from(await response.arrayBuffer()));
}
const bytes = fs.readFileSync(original);
const source = await sharp(bytes).metadata();
const outputs = [
  ['app/icon.png', 32],
  ['app/apple-icon.png', 180],
  ['public/images/icons/app-icon-192.png', 192],
  ['public/images/icons/app-icon-512.png', 512],
];
for (const [file, size] of outputs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await sharp(bytes)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file);
}
const sizes = [16, 32, 48];
const frames = await Promise.all(
  sizes.map((size) => sharp(bytes).resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (let i = 0; i < frames.length; i++) {
  const base = 6 + i * 16;
  header[base] = sizes[i];
  header[base + 1] = sizes[i];
  header.writeUInt16LE(1, base + 4);
  header.writeUInt16LE(32, base + 6);
  header.writeUInt32LE(frames[i].length, base + 8);
  header.writeUInt32LE(offset, base + 12);
  offset += frames[i].length;
}
fs.writeFileSync('app/favicon.ico', Buffer.concat([header, ...frames]));
const themeColor = fs
  .readFileSync('app/globals.css', 'utf8')
  .match(/--blue:\s*(#[0-9a-fA-F]{6})/)[1];
const record = {
  source: {
    url,
    path: new URL(url).pathname,
    width: source.width,
    height: source.height,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    vector: false,
  },
  themeColor,
  files: [
    { path: 'app/favicon.ico', sizes },
    ...outputs.map(([file, size]) => ({ path: file, width: size, height: size })),
  ],
  limitation:
    '_source/brand/ was absent. Approved fallback is 270×270; 512px output is upscaled. A larger or SVG source would give sharper large icons. No vector source was available, so no SVG was invented.',
};
fs.mkdirSync('content/brand', { recursive: true });
fs.writeFileSync('content/brand/icons.json', JSON.stringify(record, null, 2) + '\n');
console.log(record);
