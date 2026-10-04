import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const themeFile = (path) => new URL(`../../${path}`, import.meta.url);

test('configures four footer link columns for desktop and mobile with accordions closed', async () => {
  const group = JSON.parse(await readFile(themeFile('sections/footer-group.json'), 'utf8'));
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
  expect(columns.every(({ settings }) => settings.open_mobile === false)).toBe(true);
  expect(group.sections.footer.block_order).toContain('information');
});

test('keeps the approved newsletter copy and footer social settings in the section config', async () => {
  const group = JSON.parse(await readFile(themeFile('sections/footer-group.json'), 'utf8'));
  const settings = group.sections.footer.settings;

  expect(settings.newsletter_heading).toBe('El camino para ver bien y verte bien comienza aquí.');
  expect(settings.newsletter_button).toBe('SUSCRIBIRME');
  expect(settings.follow_heading).toBe('Síguenos');
  expect(settings.payment_heading).toBe('PAGA SEGURO CON');
  expect(settings.contact_email).toBe('hola@lemoon.cl');
  expect(settings.email_label).toBe('hola@lemoon.cl');
  expect(settings.contact_link).toBe('/pages/contact');
  expect(settings.contact_link_label).toBe('Escríbenos un mensaje');
  expect(settings.company_name).toBe('Servigoptic SpA');
});

test('puts the configurable contact page link before email and targets the contact form page', async () => {
  const source = await readFile(themeFile('sections/footer.liquid'), 'utf8');
  const group = JSON.parse(await readFile(themeFile('sections/footer-group.json'), 'utf8'));
  const contactLinks = source.match(/<div class="lemoon-footer__contact-list">([\s\S]*?)<\/div>/)?.[1];
  const contactTemplate = JSON.parse(await readFile(themeFile('templates/page.contact.json'), 'utf8'));

  expect(contactLinks).toBeDefined();
  expect(contactLinks.indexOf('contact_link_label')).toBeLessThan(contactLinks.indexOf('email_label'));
  expect(source).toMatch(/"id": "contact_link", "label": "Enlace a contáctanos"/);
  expect(group.sections.footer.settings.contact_link).toBe('/pages/contact');
  expect(contactTemplate.sections.form.type).toBe('contact-form');
});
