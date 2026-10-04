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
  expect(settings.contact_email).toBe('hola@lemon.cl');
  expect(settings.company_name).toBe('Servigoptic SpA');
});
