import { test, expect } from 'vitest';
import { overlayDrawerPresentation } from '../../scripts/preview-drawer-presentation.mjs';
const shell = '<head><link href="/cdn/shop/t/66/assets/lemoon-mobile-nav.css?v=1"><script src="/cdn/shop/t/66/assets/lemoon-mobile-nav.js?v=1" type="module"></script></head><body><header>unchanged</header><div class="lemoon-mobile-nav" data-lemoon-nav data-lemoon-nav-section="header"><div data-lemoon-nav-root><a href="/collections/all">Existing links</a></div></div><form>purchase unchanged</form></body>';
test('native-shell local preview uses current drawer assets and canonical controls without replacing content', () => {
  const html = overlayDrawerPresentation(shell);
  expect(html).toContain('/__lem129_preview/component-lemoon-drawer.css');
  expect(html).toContain('/__lem129_preview/lemoon-mobile-nav.js');
  expect(html).toContain('data-lemoon-nav-close');
  expect(html).toContain('data-lemoon-nav-back');
  expect(html).toContain('<a href="/collections/all">Existing links</a>');
  expect(html).toContain('<form>purchase unchanged</form>');
  expect(overlayDrawerPresentation(html)).toBe(html);
});
test('drawer controls preserve locale and ambiguous native wrappers fail closed', () => {
  expect(overlayDrawerPresentation(shell, { language: 'en' })).toContain('Back to main menu');
  expect(() => overlayDrawerPresentation(shell + shell)).toThrow('Expected one native mobile navigation drawer');
});
