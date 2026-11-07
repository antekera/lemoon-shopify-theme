// Shopify's controlled product metafield values; these are not translated UI labels.
const PRODUCT_VALUES = {
  shape: { round: 'redondo', rectangular: 'rectangular', 'cat-eye': 'ojo de gato', aviator: 'aviador', geometric: 'geométrico', square: 'cuadrado', oval: 'ovalado', panto: 'pantóstico' },
  material: { acetate: 'acetato', metal: 'metal', titanium: 'titanio', tr90: 'TR-90', wood: 'madera', mixed: 'mixto' },
};
const TRAIT_CODES = {
  color: ['bold', 'neutral', 'black', 'two_tone', 'silver'],
  finish: ['matte', 'glossy'], pattern: ['tortoise'], transparency: ['transparent'],
  use: ['work', 'everyday', 'going_out', 'outdoors'], presence: ['compact', 'medium', 'oversize'],
};
const AXES = ['category', 'shape', 'material', ...Object.keys(TRAIT_CODES)];
const fail = criterion => { throw new Error(`Invalid quiz filter configuration: ${criterion}`); };

/** Build a native collection URL. Never discard a selected, unmapped criterion. */
export function buildQuizCollectionURL(answers = {}, config) {
  if (!config || typeof config.collectionUrl !== 'string' || config.dictionaryComplete === false) fail('collection/dictionary');
  // A relative, unfiltered collection path works with localized Shopify routes too.
  if (!/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?collections\/[a-z0-9][a-z0-9-]*\/?$/i.test(config.collectionUrl)) fail('collection URL');
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) fail('answers');
  const params = new URLSearchParams();
  for (const [axis, values] of Object.entries(answers)) {
    if (!AXES.includes(axis) && (!Array.isArray(values) || values.length)) fail(axis);
  }
  for (const axis of AXES) {
    const selected = answers[axis] ?? [];
    if (!Array.isArray(selected) || selected.some(value => typeof value !== 'string')) fail(axis);
    if (!selected.length) continue;
    const values = [];
    for (const code of new Set(selected)) {
      if (axis === 'category') {
        if (!['optical', 'sun'].includes(code)) fail(axis);
        const types = config.categories?.[code];
        if (!Array.isArray(types) || !types.length || types.some(type => typeof type !== 'string' || !type.trim() || type.includes(','))) fail(axis);
        values.push(...types);
      } else if (PRODUCT_VALUES[axis]) {
        if (!Object.hasOwn(PRODUCT_VALUES[axis], code)) fail(axis);
        values.push(PRODUCT_VALUES[axis][code]);
      } else {
        if (!TRAIT_CODES[axis].includes(code) || !Array.isArray(config.traits)) fail(axis);
        // The existing neutral family includes legacy brown/light classifications.
        const codes = axis === 'color' && code === 'neutral' ? ['neutral', 'brown', 'light'] : [code];
        const matches = config.traits.filter(trait => trait?.group === axis && codes.includes(trait.code));
        if (codes.some(member => !matches.some(trait => trait.code === member))) fail(`${axis}/${code}`);
        for (const trait of matches) {
          if (!/^gid:\/\/shopify\/Metaobject\/[1-9]\d*$/.test(trait.id)) fail(`${axis}/${code}`);
          const sameCode = config.traits.filter(row => row?.group === axis && row.code === trait.code);
          const sameID = config.traits.filter(row => row?.id === trait.id);
          if (sameCode.length !== 1 || sameID.length !== 1) fail(`${axis}/${code}`);
          values.push(trait.id);
        }
      }
    }
    const parameter = axis === 'category' ? 'filter.p.product_type'
      : PRODUCT_VALUES[axis] ? `filter.p.m.custom.frame_${axis}` : `filter.v.m.custom.style_filter_${axis}`;
    if (!Array.isArray(config.availableFilters) || !config.availableFilters.includes(parameter)) fail(`unavailable ${parameter}`);
    params.set(parameter, [...new Set(values)].join(','));
  }
  const query = params.toString();
  return config.collectionUrl + (query ? `?${query}` : '');
}
