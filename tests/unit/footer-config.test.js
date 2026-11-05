import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { renderComponentSection } from '../helpers/component-library-renderer.mjs';

const themeFile = (path) => new URL(`../../${path}`, import.meta.url);
const readThemeJson = async (path) => {
  const source = await readFile(themeFile(path), 'utf8');
  return JSON.parse(source.slice(source.indexOf('{')));
};

test('configures four footer link columns for desktop and mobile with the first accordion open on mobile', async () => {
  const group = await readThemeJson('sections/footer-group.json');
  const blocks = Object.values(group.sections.footer.blocks);
  const columns = blocks.filter((block) => block.type === 'navigation_column');
  const desktopColumns = columns.filter((block) => block.settings.mobile_only !== true);
  const mobileColumns = columns.filter((block) => block.settings.desktop_only !== true);

  expect(desktopColumns.map(({ settings }) => settings.heading)).toEqual([
    'Productos', 'Cómo comprar', 'Servicios', 'Información',
  ]);
  expect(mobileColumns.map(({ settings }) => settings.heading)).toEqual([
    'Productos', 'Cómo comprar', 'Servicios', 'Información',
  ]);
  expect(mobileColumns.map(({ settings }) => settings.open_mobile)).toEqual([true, false, false, false]);
  expect(group.sections.footer.block_order).toContain('information');
});

test('keeps the approved newsletter copy and footer social settings in the section config', async () => {
  const group = await readThemeJson('sections/footer-group.json');
  const settings = group.sections.footer.settings;

  expect(settings.newsletter_heading).toBe('El camino para ver bien y verte bien comienza aquí.');
  expect(settings.newsletter_button).toBe('SUSCRIBIRME');
  expect(settings.follow_heading).toBe('Síguenos');
  expect(settings.payment_heading).toBe('PAGA SEGURO CON');
  expect(settings.contact_email).toBe('hola@lemoon.cl');
  expect(settings.email_label).toBe('hola@lemoon.cl');
  expect(settings.contact_link).toBe('/pages/contact');
  expect(settings.contact_link_label).toBe('Escríbenos un mensaje');
  expect(settings.company_name).toBe('Servioptic SPA');
});

test('puts the configurable contact page link before email and targets the contact form page', async () => {
  const source = await readFile(themeFile('sections/footer.liquid'), 'utf8');
  const group = await readThemeJson('sections/footer-group.json');
  const contactLinks = source.match(/<div class="lemoon-footer__contact-list">([\s\S]*?)<\/div>/)?.[1];
  const contactTemplate = await readThemeJson('templates/page.contact.json');

  expect(contactLinks).toBeDefined();
  expect(contactLinks.indexOf('contact_link_label')).toBeLessThan(contactLinks.indexOf('email_label'));
  expect(source).toMatch(/"id": "contact_link", "label": "Enlace a contáctanos"/);
  expect(group.sections.footer.settings.contact_link).toBe('/pages/contact');
  expect(contactTemplate.sections.main.type).toBe('lemoon-contact-page');
});

for (const { pageType, handle, enabled, visible } of [
  { pageType: 'page', handle: 'nosotros', enabled: true, visible: false },
  { pageType: 'page', handle: 'contact', enabled: true, visible: false },
  { pageType: 'page', handle: 'terminos-y-condiciones', enabled: true, visible: false },
  { pageType: 'page', handle: 'una-pagina', enabled: true, visible: false },
  { pageType: 'policy', handle: undefined, enabled: true, visible: false },
  { pageType: 'index', handle: undefined, enabled: true, visible: true },
  { pageType: 'product', handle: 'nosotros', enabled: true, visible: true },
  { pageType: 'page', handle: 'contact', enabled: false, visible: false },
]) {
  test(`newsletter visibility for pages and policies: ${pageType}/${handle ?? 'home'}, enabled=${enabled}`, () => {
    const html = renderComponentSection('footer', {
      settings: { newsletter_enable: enabled, newsletter_heading: 'Novedades', newsletter_placeholder: 'Tu correo', newsletter_button: 'Suscribirme' },
      context: { request: { page_type: pageType }, page: { handle }, pages: {}, shop: { privacy_policy: { url: '/policies/privacy-policy' } } },
    });
    expect(html.includes('class="lemoon-newsletter"')).toBe(visible);
    expect(html.includes('name="contact[email]"')).toBe(visible);
    expect(html).toContain('data-lemoon-footer');
  });
}

test('shipping page hides newsletter by handle or template while preserving the footer', () => {
  const options = { settings: { newsletter_enable: true, newsletter_heading: 'Novedades', newsletter_placeholder: 'Tu correo', newsletter_button: 'Suscribirme' } };
  const page = (handle, suffix) => renderComponentSection('footer', {
    ...options,
    context: { request: { page_type: 'page' }, page: { handle }, template: { suffix }, pages: {}, shop: { privacy_policy: { url: '/policies/privacy-policy' } } },
  });
  const contact = page('otra-pagina', '');
  expect(contact).not.toContain('class="lemoon-newsletter"');
  expect(contact).not.toContain('name="contact[email]"');
  expect(page('contact', '')).not.toContain('class="lemoon-newsletter"');
  for (const shipping of [page('envios-y-entregas', ''), page('envios-y-entregas', 'envios-y-entregas'), page('other', 'envios-y-entregas'), page('terminos-y-condiciones', ''), page('other', 'terminos-y-condiciones')]) {
    expect(shipping).not.toContain('class="lemoon-newsletter"');
    expect(shipping).not.toContain('name="contact[email]"');
    expect(shipping).toContain('data-lemoon-footer');
    expect(shipping.slice(shipping.indexOf('<footer'))).toBe(contact.slice(contact.indexOf('<footer')));
  }
});

test('footer menus hide the two unavailable service links while preserving other links', () => {
  const links = [
    { title: 'Operativos por página', type: 'page_link', object: { handle: 'operativos-oftalmologicos' }, url: '/otro-destino' },
    { title: 'Isapres por página', type: 'page_link', object: { handle: 'isapres-y-fonasa' }, url: '/otro-destino' },
    { title: 'Operativos por URL', url: '/pages/operativos-oftalmologicos' },
    { title: 'Isapres por URL', url: '/pages/isapres-y-fonasa' },
    { title: 'Operativos absoluto', url: 'https://lemoon.cl/pages/operativos-oftalmologicos?view=operativos-oftalmologicos' },
    { title: 'Isapres localizado', url: '/es/pages/isapres-y-fonasa?view=isapres-y-fonasa#info' },
    { title: 'Operativos con barra', url: '/pages/operativos-oftalmologicos/' },
    { title: 'Página externa', url: 'https://ejemplo.cl/pages/isapres-y-fonasa' },
    { title: 'Colección homónima', type: 'collection_link', object: { handle: 'isapres-y-fonasa' }, url: '/collections/isapres-y-fonasa' },
    { title: 'Contacto', url: '/pages/contact', current: true },
    { title: 'Artículo relacionado', url: '/pages/isapres-y-fonasa-guia' },
  ];
  const blocks = [
    { id: 'desktop', type: 'navigation_column', settings: { heading: 'Servicios escritorio', menu: { links }, desktop_only: true } },
    { id: 'mobile', type: 'navigation_column', settings: { heading: 'Servicios móvil', menu: { links }, mobile_only: true } },
    { id: 'legal', type: 'legal_links', settings: { menu: { links } } },
  ];
  const html = renderComponentSection('footer', { blocks, context: { request: { page_type: 'page' }, page: { handle: 'contact' }, shop: { url: 'https://lemoon.cl' } } });
  for (const title of ['Operativos por página', 'Isapres por página', 'Operativos por URL', 'Isapres por URL', 'Operativos absoluto', 'Isapres localizado', 'Operativos con barra']) {
    expect(html).not.toContain(title);
  }
  expect(html.match(/>Contacto<\/a>/g)).toHaveLength(3);
  expect(html.match(/>Artículo relacionado<\/a>/g)).toHaveLength(3);
  expect(html.match(/>Colección homónima<\/a>/g)).toHaveLength(3);
  expect(html.match(/>Página externa<\/a>/g)).toHaveLength(3);
  expect(html.match(/aria-current="page"/g)).toHaveLength(2);
  expect(html).toContain('lemoon-footer__menu--desktop-only');
  expect(html).toContain('lemoon-footer__menu--mobile-only');
});

test('footer omits empty service accordions from storefront while keeping blocks selectable in theme editor', () => {
  const hiddenLinks = [
    { title: 'Operativos', type: 'page_link', object: { handle: 'operativos-oftalmologicos' }, url: '/pages/operativos-oftalmologicos' },
    { title: 'Isapres', type: 'page_link', object: { handle: 'isapres-y-fonasa' }, url: '/pages/isapres-y-fonasa' },
  ];
  const blocks = [
    { id: 'desktop', type: 'navigation_column', shopify_attributes: 'data-editor-block="desktop"', settings: { heading: 'Servicios escritorio', menu: { links: hiddenLinks }, desktop_only: true } },
    { id: 'mobile', type: 'navigation_column', shopify_attributes: 'data-editor-block="mobile"', settings: { heading: 'Servicios móvil', menu: { links: hiddenLinks }, mobile_only: true } },
  ];
  const render = designMode => renderComponentSection('footer', { blocks, context: { request: { page_type: 'page', design_mode: designMode }, page: { handle: 'contact' }, shop: {} } });
  const storefront = render(false);
  expect(storefront).not.toContain('Servicios escritorio');
  expect(storefront).not.toContain('Servicios móvil');
  expect(storefront).not.toContain('class="lemoon-footer__menu-content"');
  const editor = render(true);
  expect(editor).toContain('data-editor-block="desktop"');
  expect(editor).toContain('data-editor-block="mobile"');
  expect(editor).toContain('Servicios escritorio');
  expect(editor).toContain('Servicios móvil');
  expect(editor).not.toContain('>Operativos</a>');
  expect(editor).not.toContain('>Isapres</a>');
});

test('shows WhatsApp only when a number is configured', () => {
  const render = (number) => renderComponentSection('footer', { settings: { whatsapp_number: number, whatsapp_label: 'Contáctanos por WhatsApp' }, context: { request: { page_type: 'page' }, page: { handle: 'contact' }, shop: {} } });
  expect(render('')).not.toContain('Contáctanos por WhatsApp');
  expect(render('+56 (9) 1234-5678')).toContain('href="https://wa.me/56912345678"');
});
