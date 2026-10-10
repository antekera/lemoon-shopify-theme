import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { Liquid } from 'liquidjs';

const source = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
const schemaOf = (liquid) => JSON.parse(liquid.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/)[1]);

test('hero renders its critical styles before the first image without a CSS network dependency', async () => {
  const [hero, styles] = await Promise.all([
    source('sections/lemoon-hero.liquid'),
    source('assets/lemoon-hero.css'),
  ]);
  // Shopify only permits inline assets smaller than 15 KB.
  expect(Buffer.byteLength(styles)).toBeLessThan(15 * 1024);
  const engine = new Liquid();
  engine.registerFilter('inline_asset_content', (name) => {
    expect(name).toBe('lemoon-hero.css');
    return styles;
  });
  engine.registerFilter('asset_url', (name) => `/assets/${name}`);
  engine.registerFilter('t', (key) => key);
  const html = await engine.parseAndRender(hero.split('{% schema %}')[0], {
    shop: { name: 'Lemoon' },
    section: { id: 'hero', settings: { autoplay_seconds: 4 }, blocks: [
      { id: 'first', settings: { desktop_asset: 'desktop.jpg', mobile_asset: 'mobile.jpg' } },
      { id: 'second', settings: { desktop_asset: 'second.jpg' } },
    ] },
  });
  expect(html).toContain(`<style>${styles}</style>`);
  expect(html.indexOf('</style>')).toBeLessThan(html.indexOf('<picture'));
  expect(html).not.toContain('href="/assets/lemoon-hero.css"');
  expect(html).toMatch(/src="\/assets\/desktop.jpg"[^>]*loading="eager"[^>]*fetchpriority="high"/);
  expect(html).toMatch(/src="\/assets\/second.jpg"[^>]*loading="lazy"/);
  expect(html).toContain('srcset="/assets/mobile.jpg"');
});

test('home benefits retain their shared layout without importing product-page styles', async () => {
  const [bar, sharedStyles, productStyles] = await Promise.all([
    source('sections/trust-bar.liquid'),
    source('assets/lemoon-components.css'),
    source('assets/lemoon-pdp-layout.css'),
  ]);
  expect(bar).not.toContain('lemoon-pdp-layout.css');
  expect(sharedStyles).toMatch(/\.lemoon-shared-benefits\s*\{\s*display:\s*contents;/);
  expect(productStyles).toMatch(/\.lemoon-shared-benefits--product\s*\{\s*display:\s*grid;/);
});

test('home critical header styles render inline while other pages retain cached stylesheets', async () => {
  const layout = await source('layout/theme.liquid');
  const criticalStyles = layout.match(/\{%- if request.page_type == 'index' -%\}([\s\S]*?)\{%- endif -%\}/)[0];
  const names = [...criticalStyles.matchAll(/'([^']+\.css)' \| inline_asset_content/g)].map((match) => match[1]);
  expect(names).toHaveLength(5);
  const assets = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await source(`assets/${name}`)])));
  for (const styles of Object.values(assets)) expect(Buffer.byteLength(styles)).toBeLessThan(15 * 1024);
  const engine = new Liquid();
  engine.registerFilter('inline_asset_content', (name) => assets[name]);
  engine.registerFilter('asset_url', (name) => `/assets/${name}`);
  engine.registerFilter('stylesheet_tag', (url) => `<link rel="stylesheet" href="${url}">`);
  const home = await engine.parseAndRender(criticalStyles, { request: { page_type: 'index' } });
  const product = await engine.parseAndRender(criticalStyles, { request: { page_type: 'product' } });
  expect(home).not.toContain('<link');
  for (const [name, styles] of Object.entries(assets)) {
    expect(home).toContain(styles);
    expect(product).toContain(`href="/assets/${name}"`);
  }
});

test('about copy shares the same page-width container as featured product carousels', async () => {
  const [about, featured, styles] = await Promise.all([
    source('sections/lemoon-about.liquid'),
    source('sections/lemoon-featured-products.liquid'),
    source('assets/lemoon-components.css'),
  ]);

  expect(about).toMatch(/class="lemoon-about page-width"/);
  expect(about).toMatch(/class="lemoon-about__inner"/);
  expect(featured).toMatch(/class="lemoon-featured-products page-width/);
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
