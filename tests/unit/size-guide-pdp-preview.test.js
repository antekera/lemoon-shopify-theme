import { test, expect } from 'vitest';
import { overlaySizeGuidePdp } from '../../scripts/preview-size-guide-pdp.mjs';
import { sizeGuideContext } from '../helpers/size-guide-renderer.mjs';
const product = { ...sizeGuideContext().product, handle: 'sample' };
const shell = '<header>unchanged</header><link href="/cdn/shop/t/66/assets/lemoon-pdp-layout.css?v=1"><script src="/cdn/shop/t/66/assets/lemoon-pdp-tools.js?v=2" type="module"></script><dialog class="lemoon-pdp__dialog lemoon-size-drawer" aria-labelledby="SizeTitle-main"><button>Close</button><h2 id="SizeTitle-main">Guide</h2><lemoon-size-guide>OLD</lemoon-size-guide></dialog><form id="purchase">unchanged purchase</form>';
test('local PDP overlay changes only measurement content and allowlisted assets', () => {
  const html = overlaySizeGuidePdp(shell, { pathname: '/products/sample', product });
  expect(html).toContain('<header>unchanged</header>');
  expect(html).toContain('<form id="purchase">unchanged purchase</form>');
  expect(html).toContain('<button>Close</button><h2 id="SizeTitle-main">Guide</h2>');
  expect(html).toContain('/__lem129_preview/lemoon-pdp-tools.js');
  expect(html).toContain('/__lem129_preview/lemoon-pdp-layout.css');
  expect(html).not.toContain('>OLD<');
  expect(html).toContain('140 mm');
});
test('other product paths remain unchanged and malformed native snapshots fail closed', () => {
  expect(overlaySizeGuidePdp(shell, { pathname: '/products/other', product })).toBe(shell);
  expect(() => overlaySizeGuidePdp('<main>no drawer</main>', { pathname: '/products/sample', product })).toThrow('Expected one native size drawer');
  expect(() => overlaySizeGuidePdp(shell + shell, { pathname: '/products/sample', product })).toThrow('found 2');
});
