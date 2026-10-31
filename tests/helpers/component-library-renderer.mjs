import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid, AssignTag, Drop } from 'liquidjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFileSync(path, 'utf8');
const json = path => { const raw = read(path); return JSON.parse(raw.slice(raw.indexOf('{'))); };
const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// Only Shopify-owned tags are adapted. Controls and nested render/include calls
// always come from real Liquid files; this does not model Shopify delivery.
function prepare(source) {
  return source.replace(/{%-?\s*(schema|doc)\s*-?%}[\s\S]*?{%-?\s*end\1\s*-?%}/g, '')
    .replace(/{%-?\s*style\s*-?%}/g, '<style>').replace(/{%-?\s*endstyle\s*-?%}/g, '</style>')
    .replace(/{%-?\s*form\s+'contact',\s*id:\s*contact_form_id,\s*class:\s*'lemoon-contact__form'\s*-?%}/g,
      '<form method="post" action="/contact#contact_form" id="{{ contact_form_id }}" class="lemoon-contact__form" data-shopify-form-fixture><input type="hidden" name="form_type" value="contact"><input type="hidden" name="utf8" value="✓">')
    .replace(/{%-?\s*form\s+'customer',\s*id:\s*newsletter_form_id,\s*class:\s*'([^']+)'\s*-?%}/g,
      '<form method="post" action="/contact#contact_form" id="{{ newsletter_form_id }}" class="$1" data-shopify-form-fixture><input type="hidden" name="form_type" value="customer"><input type="hidden" name="utf8" value="✓">')
    .replace(/{%-?\s*form\s+'new_comment',\s*article\s*-?%}/g,
      '<form method="post" action="{{ article.url }}/comments#comment_form" id="article-{{ article.id }}-comment-form" data-shopify-form-fixture><input type="hidden" name="form_type" value="new_comment"><input type="hidden" name="utf8" value="✓">')
    .replace(/{%-?\s*(?:paginate [^%]+|endpaginate)\s*-?%}/g, '')
    .replace(/{%-?\s*endform\s*-?%}/g, '</form>');
}

export function createComponentEngine({ language = 'es', sourceRoot = root } = {}) {
  const messages = json(resolve(root, `locales/${language === 'es' ? 'es' : 'en.default'}.json`));
  const fs = { ...new Liquid().options.fs, readFileSync: path => prepare(read(path)), readFile: async path => prepare(read(path)) };
  const engine = new Liquid({ fs, root: [resolve(sourceRoot, 'sections'), resolve(sourceRoot, 'snippets'), resolve(root, 'snippets')], partials: [resolve(sourceRoot, 'snippets'), resolve(root, 'snippets')], extname: '.liquid', strictFilters: true });
  // LiquidJS 10.30.0 retains a NullDrop on `assign x = nil`; its lhs
  // equality wrongly treats x != blank as true. Shopify nil is blank. Model
  // only assigned nil as native null, retaining all other AssignTag behavior.
  engine.registerTag('assign', class ShopifyFixtureAssign extends AssignTag {
    *render(ctx) {
      yield* super.render(ctx);
      const value = ctx.bottom()[this.key];
      if (value instanceof Drop && value.valueOf() === null) ctx.bottom()[this.key] = null;
    }
  });
  // Apply Shopify tag adaptation on every file read, including nested snippets.
  for (const filter of ['handleize', 'image_url', 'image_tag', 'time_tag', 'payment_type_svg_tag']) engine.registerFilter(filter, () => { throw new Error(`${filter} is outside second-wave fixture scope`); });
  engine.registerFilter('structured_data', () => '{}');
  engine.registerFilter('money', () => { throw new Error('Money is outside component fixture scope'); });
  engine.registerFilter('asset_url', value => `/assets/${value}`);
  engine.registerFilter('stylesheet_tag', value => `<link rel="stylesheet" href="${escape(value)}">`);
  engine.registerFilter('inline_asset_content', value => read(resolve(root, 'assets', value)));
  engine.registerFilter('t', (key, ...args) => {
    let value = String(key).split('.').reduce((obj, part) => obj?.[part], messages);
    const count = args.find(arg => Array.isArray(arg) && arg[0] === 'count')?.[1];
    if (value && typeof value === 'object' && count !== undefined) value = value[count === 1 ? 'one' : 'other'];
    if (typeof value !== 'string') throw new Error(`Missing translation: ${key}`);
    return args.reduce((text, arg) => Array.isArray(arg) ? text.replaceAll(new RegExp(`{{\\s*${arg[0]}\\s*}}`, 'g'), String(arg[1])) : text, value);
  });
  // Explicit deterministic stand-in for Shopify's errors Drop/filter.
  engine.registerFilter('default_errors', errors => `<ul class="errors">${Object.entries(errors.messages ?? {}).map(([key, value]) => `<li>${escape(errors.translated_fields?.[key] ?? key)} ${escape(value)}</li>`).join('')}</ul>`);
  return engine;
}

export function renderComponent(name, params = {}) {
  const engine = createComponentEngine();
  return engine.renderFileSync(name.startsWith('lemoon-ui-') ? name : `lemoon-ui-${name}`, params);
}

export function renderComponentSection(name, options = {}) {
  const { language = 'es', sourceRoot = root, id = 'component-fixture', settings = {}, blocks = [], form = {}, customer = null, routes = {}, context = {} } = options;
  const engine = createComponentEngine({ language, sourceRoot });
  const html = engine.renderFileSync(name, {
    section: { id, settings: { padding_top: 36, padding_bottom: 36, guide_kind: 'measurements', ...settings }, blocks },
    settings: { animations_reveal_on_scroll: false, predictive_search_enabled: false },
    routes: { root_url: '/', all_products_collection_url: '/collections/all', account_login_url: '/account/login', search_url: '/search', ...routes },
    form, customer, ...context,
  });
  return `<section id="shopify-section-${escape(id)}">${html}</section>`;
}

export function contactErrors(messages = { email: 'no es válido' }) {
  return Object.assign(Object.keys(messages), { messages, translated_fields: { email: 'correo' } });
}

export function searchFixtureOptions(overrides = {}) {
  return {
    settings: { enable_sorting: true, enable_filtering: false, filter_type: 'vertical' },
    context: { show_all_products: false, has_results: false, search_url: '/search?q=Round', paginate: { pages: 1 }, search: {
      terms: 'Round "<&', performed: true, results_count: 0, results: [], products_count: 0, all_products_count: 0,
      filters: [{ type: 'list', values: [], active_values: [], label: 'Fixture', param_name: 'filter.fixture' }],
      sort_by: 'title-descending', default_sort_by: 'relevance', sort_options: [{ value: 'relevance', name: 'Relevance' }, { value: 'title-descending', name: 'Title <&' }], ...overrides,
    } },
  };
}

export function renderComponentFixture(scenario = 'controls') {
  let content;
  if (scenario === 'contact' || scenario === 'contact-error' || scenario === 'contact-success') {
    content = renderComponentSection('lemoon-contact-page', { form: scenario === 'contact-error' ? { errors: contactErrors() } : scenario === 'contact-success' ? { 'posted_successfully?': true } : {} });
  } else if (scenario === 'faq' || scenario === 'long') {
    content = renderComponentSection('lemoon-faq-page', { blocks: scenario === 'long' ? [{ id: 'long', shopify_attributes: 'data-shopify-editor-block="fixture"', settings: { group: 'choosing', question: 'Pregunta extensa '.repeat(25), answer: `<p>${'Respuesta extensa con información '.repeat(50)}</p>` } }] : [] });
  } else if (scenario === 'guide') {
    content = renderComponentSection('lemoon-guide-page');
  } else if (scenario === 'search') {
    content = renderComponentSection('main-search-results', searchFixtureOptions());
  } else if (scenario === 'gallery') {
    content = renderComponentSection('lemoon-design-system');
  } else {
    content = '<main class="page-width"><h1>Component fixture</h1>' +
      renderComponent('action', { id: 'enabled-action', label: 'Fixture action' }) +
      renderComponent('action', { id: 'enabled-link', element: 'a', label: 'Fixture link', href: '#target' }) +
      renderComponent('action', { id: 'disabled-link', element: 'a', label: 'Disabled link', href: '/blocked', disabled: true }) +
      renderComponent('action', { id: 'loading-action', label: 'Loading action', loading: true }) +
      '<form id="fixture-controls">' + renderComponent('field', { id: 'fixture-email', name: 'email', type: 'email', label: 'Fixture email', placeholder: ' ', required: true, hint: 'Fixture help', hint_id: 'fixture-help' }) +
      '<label for="fixture-select">Fixture selection</label>' + renderComponent('select', { id: 'fixture-select', name: 'choice', options_html: '<option value="one">One</option><option value="two">Two</option>' }) + '</form>' +
      renderComponent('field', { id: 'disabled-field', name: 'disabled', label: 'Disabled fixture', disabled: true, placeholder: ' ' }) +
      renderComponent('field', { id: 'invalid-field', name: 'invalid', label: 'Invalid fixture', invalid: true, error: 'Fixture error', error_id: 'fixture-error', placeholder: ' ' }) +
      renderComponent('faq-item', { id: 'fixture-open', question: 'Initially open', open: true, answer_html: '<p>Visible answer</p>' }) +
      '<div id="target">Fixture destination</div></main>';
  }
  // Theme.liquid's variable block is modeled explicitly. No component CSS is
  // copied; load actual theme styles in production order. Fonts stay offline.
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Component library fixture</title><style>:root{--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:26,26,26;--color-button:11,31,58;--color-button-text:255,255,255;--color-secondary-button:255,255,255;--color-secondary-button-text:11,31,58;--color-shadow:11,31,58;--inputs-shadow-opacity:0;--inputs-border-opacity:1;--buttons-border-opacity:1;--buttons-border-width:1px;--buttons-radius:9999px;--buttons-radius-outset:9999px}html{font-size:62.5%}body{margin:0;font-size:1.6rem}</style><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-components.css">${scenario === 'search' ? '<link rel="stylesheet" href="/assets/component-facets.css"><link rel="stylesheet" href="/assets/component-search.css">' : ''}</head><body>${content}<script>document.addEventListener('submit',event=>{event.preventDefault();document.body.dataset.fixtureSubmit='prevented'});document.addEventListener('change',event=>{document.body.dataset.fixtureChanged=event.target.name;});document.addEventListener('click',event=>{if(event.target.closest('#enabled-action'))document.body.dataset.fixtureClicks=String(Number(document.body.dataset.fixtureClicks||0)+1)});</script></body></html>`;
}
