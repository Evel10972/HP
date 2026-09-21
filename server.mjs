import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/api/assets') {
      const files = (await readdir(resolve(root, 'assets'), { withFileTypes: true }))
        .filter(file => file.isFile() && !['icon.png', 'contact.png'].includes(file.name.toLowerCase()) && /^\.(png|jpe?g|webp|gif|avif)$/i.test(extname(file.name)))
        .map(file => file.name)
        .sort((a, b) => a.localeCompare(b, 'ja', { numeric: true }));
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(files));
      return;
    }
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (file !== resolve(root, 'index.html') && !file.startsWith(root + sep)) throw new Error('Forbidden');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(8000, () => console.log('http://localhost:8000/'));
