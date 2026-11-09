// Freeze each rendered text/control size before mutation so inherited font sizes
// are doubled exactly once. Fixed px and rem text both participate; SVG objects,
// layout dimensions, viewport and browser zoom are not scaled.
export async function doubleRenderedText(root) {
  return root.evaluate(container => {
    const elements = [container, ...container.querySelectorAll('*')].filter(element => {
      if (!(element instanceof HTMLElement || element instanceof SVGTextElement)) return false;
      if (!element.getClientRects().length || getComputedStyle(element).visibility === 'hidden') return false;
      const hasDirectText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      return hasDirectText || element.matches('button, select, input, textarea');
    });
    const snapshots = elements.map(element => ({ element, before: parseFloat(getComputedStyle(element).fontSize) }));
    snapshots.forEach(({ element, before }) => element.style.setProperty('font-size', `${before * 2}px`, 'important'));
    return snapshots.map(({ element, before }) => ({
      tag: element.tagName,
      className: typeof element.className === 'string' ? element.className : element.className.baseVal,
      text: element.textContent.trim().slice(0, 70), before,
      after: parseFloat(getComputedStyle(element).fontSize),
    }));
  });
}

export async function clippedSvgLabels(root) {
  return root.locator('svg text').evaluateAll(elements => elements.flatMap(element => {
    const text = element.getBoundingClientRect(), viewport = element.ownerSVGElement.getBoundingClientRect();
    return text.left < viewport.left - 1 || text.right > viewport.right + 1 || text.top < viewport.top - 1 || text.bottom > viewport.bottom + 1
      ? [{ text: element.textContent, textBox: text.toJSON(), viewport: viewport.toJSON() }] : [];
  }));
}
