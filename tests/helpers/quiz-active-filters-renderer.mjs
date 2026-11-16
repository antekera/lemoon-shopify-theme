import { createQuizEngine, quizTrait } from './style-quiz-renderer.mjs';

const selection = JSON.parse(process.argv[2] || '{}');
const trait = (id, group, code, label) => ({ system: { id }, ...quizTrait(group, code, label) });
const dictionary = [
  trait(101, 'color', 'brown', 'Cafés'), trait(102, 'color', 'light', 'Claros'),
  trait(103, 'color', 'neutral', 'Neutros'), trait(104, 'color', 'black', selection.unsafeLabel ? '<img src=x onerror="window.injected=true">' : 'Negros'),
  trait(105, 'transparency', 'transparent', 'Transparentes'),
  trait(106, 'color', 'bold', 'Colores'), trait(107, 'color', 'two_tone', 'Bicolor'),
  trait(108, 'color', 'silver', 'Plateados'), trait(109, 'pattern', 'tortoise', 'Carey'),
];
const engine = createQuizEngine();
const html = engine.renderFileSync('lemoon-active-filters', {
  collection: { url: '/collections/all', filters: [
    { param_name: 'filter.p.m.custom.frame_shape', label: 'Forma', type: 'list', active_values: selection.shape ? [{ value: 'redondo', label: 'redondo', url_to_remove: '/collections/all?sort_by=manual' }] : [] },
    { param_name: 'filter.v.m.custom.style_filter_color', label: 'Color', type: 'list', active_values: selection.brown ? [{ value: 'gid://shopify/Metaobject/101', label: 'Cafés', url_to_remove: '/collections/all?sort_by=price-ascending' }] : [] },
    { param_name: 'filter.v.m.custom.style_filter_transparency', label: 'Transparencia', type: 'list', active_values: [] },
    { param_name: 'filter.v.m.custom.style_filter_pattern', label: 'Patrón', type: 'list', active_values: [] },
  ] },
  metaobjects: { lemoon_style_trait: { values: dictionary, values_count: selection.incomplete ? 51 : dictionary.length } },
  sort_by: 'price-ascending',
});
const pipeline = selection.pipeline ? '<menu-drawer><facet-filters-form><form id="FacetFiltersFormMobile"></form></facet-filters-form></menu-drawer>' : '';
const shapeInput = selection.shape ? '<input type="checkbox" name="filter.p.m.custom.frame_shape" value="redondo" checked>' : '';
const sorting = selection.sorting ? `<div class="facets-container" data-hidden-filter-params="filter.v.m.custom.style_filter_color,filter.v.m.custom.style_filter_transparency"><facet-filters-form><form id="FacetFiltersForm">${shapeInput}</form></facet-filters-form></div><div class="sorting"><facet-filters-form><form id="FacetSortForm"><select id="SortBy" name="sort_by"><option value="manual"${selection.sortBy === 'price-ascending' ? '' : ' selected'}>Manual</option><option value="price-ascending"${selection.sortBy === 'price-ascending' ? ' selected' : ''}>Price</option></select><details data-sort-menu><summary><span data-sort-label></span></summary><div data-sort-options></div></details></form></facet-filters-form></div>` : '<select id="SortBy"><option value="price-ascending">Price</option></select>';
process.stdout.write(`<collection-component><div class="lemoon-plp" data-collection-url="/collections/all">${pipeline}${sorting}<span data-applied-filter-count></span><a data-clear-filters>Reset</a><div id="ProductGridContainer">${html}<span id="ProductCount" data-product-count="0">0</span><div id="product-grid" data-id="quiz-active" class="collection collection--empty">No products</div></div></div></collection-component>`);
