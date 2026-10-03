import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fixtureRoutes = new Set(['/tests/fixtures/mobile-search.html', '/tests/fixtures/announcement-bar.html']);
const contentTypes = {
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
};

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1:4173').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  let file;
  let contentType;
  if (fixtureRoutes.has(pathname) || pathname === '/') {
    file = resolve(root, pathname === '/tests/fixtures/announcement-bar.html' ? 'tests/fixtures/announcement-bar.html' : 'tests/fixtures/mobile-search.html');
    contentType = 'text/html; charset=utf-8';
  } else if (/^\/assets\/[\w.-]+$/.test(pathname)) {
    file = resolve(root, pathname.slice(1));
    contentType = contentTypes[pathname.split('.').pop()] || 'application/octet-stream';
  } else {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500).end('Not found');
  }
});

server.listen(4173, '127.0.0.1', () => {
  console.log('Fixture ready at http://127.0.0.1:4173');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
