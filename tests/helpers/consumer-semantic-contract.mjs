// Attribute order, UI marker classes and action-label spans are presentational.
// Keep native attributes, local classes, text, control order and associations.
export function consumerSemanticContract(root) {
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ').trim() || null;
    if (node.nodeType !== Node.ELEMENT_NODE || ['STYLE', 'SCRIPT', 'LINK'].includes(node.tagName)) return null;
    if (node.tagName === 'SPAN' && node.attributes.length === 0) return [...node.childNodes].map(walk).flat().filter(Boolean);
    const attrs = Object.fromEntries([...node.attributes].filter(a => a.name !== 'class').map(a => [a.name, a.value]));
    const classes = [...node.classList].filter(c => !c.startsWith('lemoon-ui-')).sort();
    if (classes.length) attrs.class = classes.join(' ');
    const geometry = node.tagName.toLowerCase() === 'svg' ? { geometry: node.innerHTML.replace(/\s+/g, ' ').trim() } : {};
    return { tag: node.tagName.toLowerCase(), attrs, ...geometry, children: node.tagName.toLowerCase() === 'svg' ? [] : [...node.childNodes].map(walk).flat().filter(Boolean) };
  }
  return [...root.childNodes].map(walk).flat().filter(Boolean);
}
