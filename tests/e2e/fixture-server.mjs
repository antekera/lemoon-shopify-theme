import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { renderNotification, notificationContext } from '../helpers/gift-notification-renderer.mjs';
import { renderDefaultPage } from '../helpers/default-page-renderer.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fixtureFiles = new Map([
  ['/tests/fixtures/gift-card-purchase.html', 'tests/fixtures/gift-card-purchase.html'],
  ['/tests/fixtures/gift-card.html', 'tests/fixtures/gift-card.html'],
  ['/tests/fixtures/lens-configurator.html', 'tests/fixtures/lens-configurator.html'],
  ['/tests/fixtures/eyewear-product.html', 'tests/fixtures/eyewear-product.html'],
  ['/tests/fixtures/mobile-search.html', 'tests/fixtures/mobile-search.html'],
  ['/tests/fixtures/mobile-menu.html', 'tests/fixtures/mobile-menu.html'],
  ['/tests/fixtures/announcement-bar.html', 'tests/fixtures/announcement-bar.html'],
  ['/tests/fixtures/footer-accordion.html', 'tests/fixtures/footer-accordion.html'],
]);
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

  if (pathname === '/tests/fixtures/default-page.html') {
    const scenario = new URL(request.url, 'http://127.0.0.1:4173').searchParams.get('scenario');
    const content = scenario === 'empty' ? '' : '<h2>Servicio y atención</h2><p>Contenido de muestra para comprobar la presentación del CMS.</p><p><a href="/pages/contact">Contactar al equipo</a></p>';
    const html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-tokens.css"><title>Información</title></head><body>' + renderDefaultPage({ title: 'Información', content }) + '</body></html>';
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : html);
    return;
  }

  if (pathname === '/tests/fixtures/gift-card-email.html' || pathname === '/tests/fixtures/gift-card-receipt.html') {
    const context = notificationContext();
    const scenario = new URL(request.url, 'http://127.0.0.1:4173').searchParams.get('scenario');
    if (scenario === 'recipient' || scenario === 'scheduled') {
      Object.assign(context.gift_card, {
        recipient: { nickname: 'Sofi', name: 'Sofía', email: 'regalo@example.test' },
        customer: { name: 'Camila', email: 'persona@example.test' },
        message: 'Para tus próximos lentes.\nCon cariño.',
        send_on: scenario === 'scheduled' ? '2026-12-25' : null,
      });
    }
    if (scenario === 'unsafe-message') {
      Object.assign(context.gift_card, { recipient: { name: 'Persona de prueba' }, message: '<img src=x onerror=alert(1)>'.repeat(7) });
    }
    const name = pathname.endsWith('receipt.html') ? 'gift-card-receipt' : 'gift-card-created';
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : renderNotification(name, context));
    return;
  }

  let file;
  let contentType;
  if (fixtureFiles.has(pathname) || pathname === '/') {
    file = resolve(root, fixtureFiles.get(pathname) || fixtureFiles.get('/tests/fixtures/mobile-search.html'));
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
