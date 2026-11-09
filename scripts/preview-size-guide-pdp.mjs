/** Local-only PDP modal replacement over an authorized native HTML snapshot.
 * Product context must be supplied from a separate read-only Shopify snapshot.
 * No product mutations, remote uploads or purchase markup replacement occur.
 */
import { createComponentEngine } from '../tests/helpers/component-library-renderer.mjs';
import { previewAssetPrefix } from './preview-size-guide-page.mjs';

export function overlaySizeGuidePdp(html, { pathname, product, settings = {} }) {
  if (pathname !== `/products/${product?.handle}`) return html;
  const dialogs = [...html.matchAll(/<dialog\b[^>]*class="[^"]*\blemoon-size-drawer\b[^"]*"[^>]*>[\s\S]*?<\/dialog>/g)];
  if (dialogs.length !== 1) throw new Error(`Expected one native size drawer; found ${dialogs.length}`);
  const dialog = dialogs[0];
  const marker = dialog[0].match(/aria-labelledby="([^"]+)"/);
  if (!marker) throw new Error('Native size drawer has no accessible title');
  const instanceId = `${marker[1]}-local`;
  const rendered = createComponentEngine({ globals: { settings } }).renderFileSync('lemoon-size-guide-content', {
    product, presentation: 'dialog', instance_id: instanceId, routes: { root_url: '/' },
  });
  const open = dialog[0].indexOf('<lemoon-size-guide');
  const end = dialog[0].lastIndexOf('</lemoon-size-guide>');
  if (open < 0 || end < open) throw new Error('Native size drawer content is unavailable');
  const replacement = dialog[0].slice(0, open) + rendered + dialog[0].slice(end + '</lemoon-size-guide>'.length);
  let document = html.slice(0, dialog.index) + replacement + html.slice(dialog.index + dialog[0].length);
  for (const name of ['component-lemoon-size-guide.css', 'lemoon-pdp-layout.css', 'lemoon-pdp-tools.js', 'lemoon-eyewear-product.js']) {
    const escaped = name.replaceAll('.', '\\.');
    document = document.replace(new RegExp(`((?:href|src)=["'])(?:/cdn/shop/t/\\d+/assets/|/assets/)${escaped}(?:\\?[^"']*)?(["'])`, 'g'),
      (_, prefix, quote) => `${prefix}${previewAssetPrefix}${name}${quote}`);
  }
  return document;
}
