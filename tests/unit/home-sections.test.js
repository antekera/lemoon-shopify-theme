import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const source = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
const schemaOf = (liquid) => JSON.parse(liquid.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/)[1]);

test('about copy shares the same page-width container as featured product carousels', async () => {
  const [about, featured, styles] = await Promise.all([
    source('sections/lemoon-about.liquid'),
    source('sections/lemoon-featured-products.liquid'),
    source('assets/lemoon-components.css'),
  ]);

  expect(about).toMatch(/class="lemoon-about page-width"/);
  expect(about).toMatch(/class="lemoon-about__inner"/);
  expect(featured).toMatch(/class="lemoon-featured-products page-width"/);
  expect(styles).toMatch(/\.lemoon-about\s*\{[^}]*margin:\s*1\.6rem auto 5rem/);
});

test('purchase steps expose three configurable illustrations and supporting details', async () => {
  const [section, icon] = await Promise.all([
    source('sections/how-it-works.liquid'),
    source('snippets/lemoon-purchase-step-icon.liquid'),
  ]);
  const settings = schemaOf(section).blocks[0].settings;

  expect(section).toMatch(/render 'lemoon-purchase-step-icon'/);
  expect(section).toMatch(/lemoon-how-it-works__detail/);
  expect(settings.find(({ id }) => id === 'icon').options.map(({ value }) => value)).toEqual(['auto', 'frame', 'prescription', 'delivery']);
  expect(icon.match(/\{% when '/g)).toHaveLength(2);
  expect(icon).toMatch(/\{% else %\}/);
  expect(icon).toContain('prescription');
  expect(icon).toContain('delivery');
});

test('hero buttons keep their own fills and use matching darker hover colors', async () => {
  const [section, styles, script] = await Promise.all([
    source('sections/lemoon-hero.liquid'),
    source('assets/lemoon-hero.css'),
    source('assets/lemoon-hero.js'),
  ]);

  expect(section).toContain('lemoon-hero__button--primary');
  expect(section).toContain('lemoon-hero__button--secondary');
  expect(styles).toMatch(/\.lemoon-hero__button:hover\s*\{[^}]*background:\s*#dfcf00;[^}]*border-color:\s*#dfcf00/);
  expect(styles).toMatch(/\.lemoon-hero__button--secondary:hover\s*\{[^}]*background:\s*#e6e6e6/);
  expect(script).toMatch(/onNavigationClick/);
});

test('navigation indicator is shared across hover and focus instead of drawing per link', async () => {
  const [script, styles] = await Promise.all([
    source('assets/lemoon-header-nav.js'),
    source('assets/lemoon-header.css'),
  ]);

  expect(script).toMatch(/--nav-indicator-left/);
  expect(script).toMatch(/--nav-indicator-width/);
  expect(script).toMatch(/focusin/);
  expect(styles).toMatch(/\.lemoon-header__quick-nav--desktop\.lemoon-header__quick-nav--sliding::after[\s\S]*?transform:\s*translateX\(var\(--nav-indicator-left/);
  expect(styles).toMatch(/\.lemoon-header__quick-nav--sliding \.lemoon-header__quick-link::after\s*\{\s*content:\s*none/);
});


test('hero asset fallbacks come from block settings rather than literal block IDs', async () => {
  const [hero, home] = await Promise.all([
    source('sections/lemoon-hero.liquid'),
    source('templates/index.json'),
  ]);
  expect(hero).not.toMatch(/case block\.id/);
  expect(hero).toContain('block.settings.desktop_asset');
  expect(hero).toContain('block.settings.mobile_asset');
  const configuredHero = Object.values(JSON.parse(home).sections).find(({ type }) => type === 'lemoon-hero').blocks;
  for (const id of ['editorial_slide', 'youth_slide']) {
    expect(configuredHero[id].settings.desktop_asset).toMatch(/\.jpg$/);
    expect(configuredHero[id].settings.mobile_asset).toMatch(/\.jpg$/);
  }
});
