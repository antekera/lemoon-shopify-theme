import { expect, test } from 'vitest';
import { renderAdoption } from '../helpers/component-adoption-renderer.mjs';
import { renderComponentSection } from '../helpers/component-library-renderer.mjs';

for (const pageType of ['blog', 'article']) {
  test(`${pageType} footer renders exactly one editorial newsletter with native customer fields and consent`, () => {
    const html = renderAdoption(`newsletter-${pageType}`);
    expect(html.match(/<section class="lemoon-newsletter\b/g)).toHaveLength(1);
    expect(html).toContain('lemoon-newsletter--editorial');
    expect(html).toContain('href="/assets/section-lemoon-editorial-newsletter.css"');
    expect(html).toContain('Una idea útil cada tanto.');
    expect(html).toContain('Lentes, estilo y claridad en tu correo.');
    expect(html).not.toContain('Novedades &lt;&amp;');
    expect(html).toContain('action="/contact#contact_form"');
    expect(html).toContain('name="form_type" value="customer"');
    expect(html).toContain('name="contact[tags]" value="newsletter"');
    expect(html).toContain('name="contact[email]"');
    const consent = html.match(/<input[^>]*type="checkbox"[^>]*>/)?.[0];
    expect(consent).toContain('name="contact[accepts_marketing]"');
    expect(consent).toContain('required');
    expect(consent).not.toContain('checked');
  });
}

test('ordinary pages retain configured newsletter copy and do not add editorial consent', () => {
  const html = renderAdoption('newsletter');
  expect(html).toContain('Novedades &lt;&amp;&#34;');
  expect(html).not.toMatch(/<section[^>]*lemoon-newsletter--editorial/);
  expect(html).not.toContain('Una idea útil cada tanto.');
  expect(html).not.toContain('name="contact[accepts_marketing]"');
});

test('editorial response states keep email association and per-section form identities', () => {
  const error = renderAdoption('newsletter-blog-error');
  expect(error).toContain('id="LemoonNewsletter-component-fixture"');
  expect(error).toContain('id="LemoonNewsletterEmail-component-fixture"');
  expect(error).toContain('aria-describedby="LemoonNewsletterError-component-fixture"');
  expect(error).toContain('aria-invalid="true"');
  expect(error).toContain('role="alert"');
  expect(error).toContain('value="test@example.test"');
  const success = renderAdoption('newsletter-blog-success');
  expect(success).toContain('aria-describedby="LemoonNewsletterSuccess-component-fixture"');
  expect(success).toMatch(/id="LemoonNewsletterSuccess-component-fixture"[^>]*tabindex="-1"/);
  expect(success).not.toContain('aria-invalid=');
  const first = renderComponentSection('footer', { id: 'one', settings: { newsletter_enable: true }, context: { request: { page_type: 'blog' } } });
  const second = renderComponentSection('footer', { id: 'two', settings: { newsletter_enable: true }, context: { request: { page_type: 'article' } } });
  expect(first).toContain('id="LemoonNewsletterEmail-one"');
  expect(second).toContain('id="LemoonNewsletterEmail-two"');
  expect(first).not.toContain('LemoonNewsletterEmail-two');
  expect(first).toContain('for="LemoonNewsletter-one-consent"');
  expect(second).toContain('for="LemoonNewsletter-two-consent"');
});

test.each(['index', 'product', 'collection', 'page', 'search', 'cart'])('%s keeps the configured noneditorial footer variant', pageType => {
  const html = renderComponentSection('footer', { settings: { newsletter_enable: true, newsletter_heading: 'Contenido existente' }, context: { request: { page_type: pageType } } });
  expect(html).toContain('Contenido existente');
  expect(html).not.toContain('href="/assets/section-lemoon-editorial-newsletter.css"');
  expect(html).not.toMatch(/<section[^>]*lemoon-newsletter--editorial/);
  expect(html).not.toContain('name="contact[accepts_marketing]"');
});

test.each(['blog', 'article'])('%s respects the existing newsletter editor enable switch', pageType => {
  const html = renderComponentSection('footer', { settings: { newsletter_enable: false }, context: { request: { page_type: pageType } } });
  expect(html).not.toContain('<section class="lemoon-newsletter');
  expect(html).not.toContain('name="contact[email]"');
});

test('Nosotros keeps the footer while suppressing its existing newsletter', () => {
  const options = { settings: { newsletter_enable: true, newsletter_heading: 'Contenido existente' } };
  const nosotros = renderComponentSection('footer', { ...options, context: { request: { page_type: 'page' }, page: { handle: 'nosotros' } } });
  const contact = renderComponentSection('footer', { ...options, context: { request: { page_type: 'page' }, page: { handle: 'contact' } } });
  expect(nosotros).not.toContain('<section class="lemoon-newsletter');
  expect(nosotros).not.toContain('name="contact[email]"');
  expect(nosotros).toContain('<footer class="lemoon-footer"');
  expect(nosotros.slice(nosotros.indexOf('<footer class="lemoon-footer"'))).toBe(contact.slice(contact.indexOf('<footer class="lemoon-footer"')));
});

test('ordinary CMS pages retain the same warm newsletter markup after the Nosotros guard', () => {
  const options = { settings: { newsletter_enable: true, newsletter_heading: 'Contenido existente' } };
  const ordinary = renderComponentSection('footer', { ...options, context: { request: { page_type: 'page' } } });
  const contact = renderComponentSection('footer', { ...options, context: { request: { page_type: 'page' }, page: { handle: 'contact' } } });
  expect(contact).toBe(ordinary);
  expect(contact).toContain('<section class="lemoon-newsletter"');
  expect(contact).not.toContain('href="/assets/section-lemoon-editorial-newsletter.css"');
});
