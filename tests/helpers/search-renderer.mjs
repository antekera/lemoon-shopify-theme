import { readFileSync } from 'node:fs';
import { createComponentEngine } from './component-library-renderer.mjs';

const engine = createComponentEngine();
engine.registerFilter('placeholder_svg_tag', () => '<svg></svg>');
engine.registerFilter('json', value => JSON.stringify(value));
const rendered = engine.renderFileSync('lemoon-mobile-search', {
  section: { id: 'fixture', settings: { mobile_search_show_wishlist: process.argv[2] === 'on' } }, request: { page_type: 'product' },
  routes: { search_url: '/search', predictive_search_url: '/search/suggest' }, collections: {}, settings: {}, product: null,
});
const form = rendered.match(/<form\b[^>]*data-lemoon-search-form[\s\S]*?<\/form>/)?.[0];
const information = rendered.match(/<section class="lemoon-mobile-search__information"[\s\S]*?<\/section>/)?.[0];
const shipping = rendered.match(/<a href="\/pages\/envios-y-entregas"[\s\S]*?<\/a>/)?.[0];
if (!form || !shipping || !information) throw new Error('Search form or shipping link not found');
const fixture = readFileSync('tests/fixtures/mobile-search.html', 'utf8')
  .replace(/<form\b[^>]*data-lemoon-search-form[\s\S]*?<\/form>/, form)
  .replace(/<section class="lemoon-mobile-search__information"[\s\S]*?<\/section>/, information)
  .replace('<link rel="stylesheet" href="/assets/base.css">', '<style>html{font-size:62.5%}</style><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-components.css">');
if (fixture.includes('data-lemoon-search-form') && fixture.includes(shipping)) process.stdout.write(fixture);
else throw new Error('Fixture replacement failed');
