import { test, expect } from 'vitest';
import { overlayDrawerPresentation } from '../../scripts/preview-drawer-presentation.mjs';
const shell = '<head><link href="/cdn/shop/t/66/assets/lemoon-mobile-nav.css?v=1"><script src="/cdn/shop/t/66/assets/lemoon-mobile-nav.js?v=1" type="module"></script></head><body><header><button data-lemoon-nav-open aria-label="Menú">Menu</button></header><div class="lemoon-mobile-nav" data-lemoon-nav data-lemoon-nav-section="header"><div data-lemoon-nav-root><a href="/collections/all">Existing links</a></div></div><form>purchase unchanged</form></body>';
test('native-shell local preview preserves the header menu control without duplicating drawer controls', () => {
  const html = overlayDrawerPresentation(shell);
  expect(html).toContain('/__lem129_preview/component-lemoon-drawer.css');
  expect(html).toContain('/__lem129_preview/lemoon-mobile-nav.js');
  expect(html).toContain('data-lemoon-nav-open');
  expect(html).not.toContain('data-lemoon-nav-controls');
  expect(html).toContain('<a href="/collections/all">Existing links</a>');
  expect(html).toContain('<form>purchase unchanged</form>');
  expect(overlayDrawerPresentation(html)).toBe(html);
});
test('the header control is preserved and ambiguous native wrappers fail closed', () => {
  expect(overlayDrawerPresentation(shell, { language: 'en' })).toContain('data-lemoon-nav-open');
  expect(() => overlayDrawerPresentation(shell + shell)).toThrow('Expected one native mobile navigation drawer');
});
