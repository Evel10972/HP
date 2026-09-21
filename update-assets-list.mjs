import { readdir, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const files = (await readdir(new URL('./assets/', import.meta.url), { withFileTypes: true }))
  .filter(file => file.isFile() && !['icon.png', 'contact.png'].includes(file.name.toLowerCase()) && /^\.(png|jpe?g|webp|gif|avif)$/i.test(extname(file.name)))
  .map(file => file.name)
  .sort((a, b) => a.localeCompare(b, 'ja', { numeric: true }));

await writeFile(new URL('./assets-list.js', import.meta.url), `window.assetFiles = ${JSON.stringify(files, null, 2)};\n`);
console.log(`${files.length}枚の画像を一覧に登録しました`);
