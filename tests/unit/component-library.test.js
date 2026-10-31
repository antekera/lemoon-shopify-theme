import { expect, test } from 'vitest';
import { renderComponent as render, renderComponentSection as section, contactErrors, createComponentEngine, searchFixtureOptions } from '../helpers/component-library-renderer.mjs';

const tag = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`))?.[0] ?? '';
const control = (html, name) => html.match(new RegExp(`<(?:input|textarea|select)\\b[^>]*name="${name.replaceAll('[', '\\[').replaceAll(']', '\\]')}"[^>]*>`))?.[0] ?? '';

test('action navigation escapes text/attributes once and preserves local CSS', () => {
  const html = render('action', { element: 'a', label: '<Contact "us"> &', href: '/help?q="<&', style_family: 'local', class: 'lemoon-guide__cta' });
  expect(tag(html, 'a')).toContain('href="/help?q=&#34;&lt;&amp;"');
  expect(html).toContain('&lt;Contact &#34;us&#34;&gt; &amp;');
  expect(html).not.toContain('&amp;lt;');
  expect(tag(html, 'a')).toContain('lemoon-guide__cta');
  expect(tag(html, 'a')).not.toMatch(/\bbutton\b/);
});
test.each(['primary', 'secondary', 'tertiary'])('base action %s uses existing variant', variant => {
  const html = render('action', { label: 'Action', variant });
  expect(tag(html, 'button')).toContain('button');
  if (variant !== 'primary') expect(html).toContain(`button--${variant}`);
});
test('action defaults to non-submitting button and preserves explicit native submit association', () => {
  expect(tag(render('action', { label: 'Test' }), 'button')).toContain('type="button"');
  const html = render('action', { label: 'Send', type: 'submit', form_id: 'contact-1', id: 'send', name: 'commit', value: 'save' });
  for (const attr of ['type="submit"', 'form="contact-1"', 'id="send"', 'name="commit"', 'value="save"']) expect(tag(html, 'button')).toContain(attr);
});
test('disabled and loading links cannot retain an activatable destination', () => {
  for (const params of [{ disabled: true }, { loading: true }]) {
    const html = render('action', { element: 'a', href: '/must-not-open', label: 'Wait', ...params });
    expect(tag(html, 'a')).not.toContain('href=');
    expect(tag(html, 'a')).toContain('aria-disabled="true"');
  }
});
test('loading action preserves label, direct shared spinner and native disabling', () => {
  const html = render('action', { label: 'Wait', loading: true });
  expect(tag(html, 'button')).toMatch(/\sdisabled(?:\s|>|=)/);
  expect(tag(html, 'button')).toContain('aria-busy="true"');
  expect(html).toMatch(/<span[^>]*>Wait<\/span>/);
  expect(html).toContain('loading__spinner');
  expect(html).toContain('<svg');
});
test('optional boolean and ARIA false values remain distinct from omission', () => {
  const html = render('action', { label: 'Toggle', disabled: false, aria_expanded: false, aria_pressed: false });
  expect(tag(html, 'button')).not.toMatch(/\sdisabled(?:\s|>|=)/);
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('aria-pressed="false"');
  expect(render('action', { label: 'Plain' })).not.toMatch(/aria-(expanded|pressed|busy|disabled)=/);
});
test('field renders escaped values, native attributes and associated help plus error', () => {
  const html = render('field', { id: 'email-one', name: 'contact[email]', label: 'Email <&', type: 'email', value: '"><script>x</script>&', required: true, spellcheck: false, autocapitalize: 'off', invalid: true, hint: 'Help <&', hint_id: 'email-hint', error: 'Bad <&', error_id: 'email-error', describedby: 'external' });
  for (const attr of ['id="email-one"', 'name="contact[email]"', 'type="email"', 'spellcheck="false"', 'aria-invalid="true"', 'autocapitalize="off"']) expect(tag(html, 'input')).toContain(attr);
  expect(tag(html, 'input')).toMatch(/\srequired(?:\s|>|=)/);
  expect(tag(html, 'input')).toContain('aria-describedby="external email-hint email-error"');
  expect(html).toContain('for="email-one"');
  expect(html).toContain('&#34;&gt;&lt;script&gt;x&lt;/script&gt;&amp;');
  expect(html).toContain('Help &lt;&amp;');
  expect(html).toContain('Bad &lt;&amp;');
  expect(html).not.toContain('<script>');
});
test('contact/base label order and local classes remain supported', () => {
  const params = { id: 'phone', name: 'contact[phone]', label: 'Phone', type: 'tel', wrapper_class: 'local-wrapper', control_class: 'local-input', label_class: 'local-label' };
  const local = render('field', { ...params, style_family: 'contact' });
  expect(local.indexOf('<label')).toBeLessThan(local.indexOf('<input'));
  for (const value of ['local-wrapper', 'local-input', 'local-label']) expect(local).toContain(value);
  const base = render('field', params);
  expect(base.indexOf('<input')).toBeLessThan(base.indexOf('<label'));
  expect(tag(local, 'input')).not.toMatch(/\srequired|pattern=/);
});
test('textarea escapes text including newline and preserves optional false booleans', () => {
  const html = render('field', { kind: 'textarea', id: 'body', name: 'body', label: 'Body', value: '</textarea>\n<&', rows: 6, required: false, disabled: false, readonly: true, spellcheck: false, form_id: 'owner' });
  expect(html).toContain('&lt;/textarea&gt;\n&lt;&amp;');
  const textarea = tag(html, 'textarea');
  for (const attr of ['rows="6"', 'spellcheck="false"', 'form="owner"']) expect(textarea).toContain(attr);
  expect(textarea).toMatch(/\sreadonly(?:\s|>|=)/);
  expect(textarea).not.toMatch(/\s(required|disabled)(?:\s|>|=)|value=/);
});
test('select preserves trusted option markup, selection, names, native states and caret', () => {
  const html = render('select', { id: 'SortBy', name: 'sort_by', class: 'facet-filters__sort select__select caption-large', wrapper_class: 'select', options_html: '<option value="a">A &amp; B</option><option value="b" selected>B</option>', describedby: 'refresh', disabled: false, required: true, show_caret: true });
  expect(tag(html, 'select')).toContain('name="sort_by"');
  expect(tag(html, 'select')).toContain('aria-describedby="refresh"');
  expect(html).toContain('<option value="b" selected>B</option>');
  expect(html).not.toContain('&lt;option');
  expect(tag(html, 'select')).not.toMatch(/\sdisabled(?:\s|>|=)/);
  expect(html).toContain('icon-caret');
});
test.each([1, 2, 3, 4, 5, 6])('heading supports semantic h%s with escaped attributes/text', level => {
  const html = render('heading', { level, text: '<Title>&', id: 'heading"one', class: 'local-heading' });
  expect(html.trim()).toBe(`<h${level} id="heading&#34;one" class="local-heading">&lt;Title&gt;&amp;</h${level}>`);
});
test('heading and message tag allowlists prevent arbitrary markup', () => {
  expect(render('heading', { level: 'script', text: 'Safe' })).not.toContain('<script');
  expect(render('heading', { level: 7, text: 'Safe' })).not.toContain('<h7');
  expect(render('message', { tag: 'script', text: 'Safe' })).not.toContain('<script');
});
test('message escapes plain strings but preserves trusted capture without default announcements', () => {
  const plain = render('message', { text: '<strong>Text</strong>&' });
  expect(plain).toContain('&lt;strong&gt;Text&lt;/strong&gt;&amp;');
  expect(plain).not.toMatch(/role=|aria-live=|autofocus/);
  const rich = render('message', { tag: 'div', content_html: '<p>Error</p><ul><li>Details</li></ul>', role: 'alert', live: 'assertive', tabindex: -1, autofocus: true });
  expect(rich).toContain('<p>Error</p><ul><li>Details</li></ul>');
  for (const attr of ['role="alert"', 'aria-live="assertive"', 'tabindex="-1"', 'autofocus']) expect(rich).toContain(attr);
});
test('FAQ item keeps native disclosure, rich answer, explicit open and editor ownership', () => {
  const html = render('faq-item', { id: 'FaqBlock-one-x', question: '<Question>&', question_level: 3, answer_html: '<p>Rich <strong>answer</strong> <a href="/help">Help</a></p>', class: 'lemoon-faq-page__question', answer_class: 'lemoon-faq-page__answer rte', editor_attributes: 'data-shopify-editor-block="fixture"', open: true, indicator: 'page-svg' });
  expect(tag(html, 'details')).toContain('data-shopify-editor-block="fixture"');
  expect(tag(html, 'details')).toMatch(/\sopen(?:\s|>|=)/);
  expect(html).toContain('<h3>&lt;Question&gt;&amp;</h3>');
  expect(html).toContain('<strong>answer</strong>');
  expect(html).toContain('lemoon-faq-page__plus-vertical');
  expect(html).not.toMatch(/role="button"|aria-expanded=/);
  expect(tag(render('faq-item', { id: 'closed', question: 'Q', open: false }), 'details')).not.toMatch(/\sopen(?:\s|>|=)/);
});
test('strict translation filter rejects unknown keys instead of hiding fixture mistakes', () => {
  expect(() => createComponentEngine().parseAndRenderSync("{{ 'missing.fixture.key' | t }}")).toThrow('Missing translation');
});
test('contact fixture presents native state branches without simulating delivery', () => {
  const ok = section('lemoon-contact-page', { form: { 'posted_successfully?': true } });
  expect(ok).toContain('role="status"');
  expect(ok).toContain('aria-live="polite"');
  expect(ok).not.toContain('role="alert"');
  const error = section('lemoon-contact-page', { form: { errors: contactErrors() } });
  expect(error).toContain('role="alert"');
  expect(error).toContain('aria-live="assertive"');
  expect(error).toContain('<ul class="errors">');
  expect(control(error, 'contact[email]')).toContain('aria-invalid="true"');
  expect(control(error, 'contact[email]')).toContain('aria-describedby="LemoonContact-component-fixture-email-error"');
});

test('multiple field instances retain unique IDs and independent feedback associations', () => {
  const html = ['one', 'two'].map(id => render('field', { id, name: id, label: id, hint: 'Help', hint_id: `${id}-hint`, error: 'Error', error_id: `${id}-error`, invalid: false, spellcheck: true })).join('');
  for (const id of ['one', 'two']) {
    const input = control(html, id);
    expect(input).toContain(`id="${id}"`);
    expect(input).toContain(`aria-describedby="${id}-hint ${id}-error"`);
    expect(input).toContain('spellcheck="true"');
    expect(input).toContain('aria-invalid="false"');
  }
  const omitted = render('field', { id: 'plain', name: 'plain', label: 'Plain' });
  expect(tag(omitted, 'input')).not.toMatch(/spellcheck=|aria-invalid=|aria-describedby=/);
});

test('select supports disabled/multiple/form association, false/absent flags and no caret', () => {
  const html = render('select', { id: 'multi', name: 'many[]', options_html: '<option value="a" selected>A</option>', multiple: true, disabled: true, required: false, form_id: 'external-form', labelledby: 'external-label', show_caret: false });
  const select = tag(html, 'select');
  for (const attr of ['form="external-form"', 'aria-labelledby="external-label"', 'multiple', 'disabled']) expect(select).toContain(attr);
  expect(select).not.toMatch(/\srequired(?:\s|>|=)/);
  expect(html).not.toContain('icon-caret');
  expect(tag(render('select', { disabled: false, multiple: false }), 'select')).not.toMatch(/\s(disabled|multiple)(?:\s|>|=)/);
});

test('message native hidden/autofocus false values do not become attributes', () => {
  expect(render('message', { text: 'Inert', hidden: false, autofocus: false })).not.toMatch(/\shidden|\sautofocus|role=|aria-live=/);
  expect(render('message', { text: 'Hidden', hidden: true })).toMatch(/\shidden/);
});

test('actual vertical search consumer preserves option selection, form names and escaped query context', () => {
  const options = searchFixtureOptions();
  const html = section('main-search-results', options);
  expect(control(html, 'sort_by')).toContain('id="SortBy"');
  expect(control(html, 'sort_by')).toContain('aria-describedby="a11y-refresh-page-message"');
  expect(html).toMatch(/<option[^>]*value="title-descending"[^>]*selected="selected"/);
  expect(html).toContain('Title &lt;&amp;');
  expect(html).toContain('value="Round &#34;&lt;&amp;"');
  expect(html).toContain('id="FacetSortForm"');
  const defaultHtml = section('main-search-results', searchFixtureOptions({ sort_by: null }));
  expect(defaultHtml).toMatch(/<option[^>]*value="relevance"[^>]*selected="selected"/);
  const allProducts = section('main-search-results', { ...options, context: { ...options.context, show_all_products: true, collections: { all: { products: [], products_count: 0 } } } });
  expect(allProducts).not.toContain('id="SortBy"');
});

test('loading preserves explicit spinner false and fields preserve floating whitespace placeholder', () => {
  const action = render('action', { label: 'Loading', loading: true, show_spinner: false });
  expect(tag(action, 'button')).toContain('aria-busy="true"');
  expect(action).not.toContain('loading__spinner');
  const html = render('field', { id: 'floating', name: 'floating', label: 'Persistent label', placeholder: ' ' });
  expect(tag(html, 'input')).toContain('placeholder=" "');
  expect(html).toContain('for="floating"');
});

test('Shopify fixture normalizes assigned nil so absent error has no empty feedback or association', () => {
  const engine = createComponentEngine();
  expect(engine.parseAndRenderSync("{% assign feedback = nil %}{% if feedback == blank %}blank{% endif %}")).toBe('blank');
  const html = section('lemoon-contact-page');
  expect(control(html, 'contact[email]')).not.toContain('aria-describedby');
  expect(html).not.toContain('<small');
});

test('action icon cannot inject attributes into canonical SVG class', () => {
  const html = render('action', { label: 'Icon', icon: 'help" onload="alert(1)' });
  expect(tag(html, 'svg')).not.toContain(' onload="');
  expect(tag(html, 'svg')).toContain('help&#34; onload=&#34;alert(1)');
});
