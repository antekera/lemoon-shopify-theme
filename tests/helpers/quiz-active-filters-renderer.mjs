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
    { param_name: 'filter.v.m.custom.style_filter_color', label: 'Color', type: 'list', active_values: selection.brown ? [{ value: 'gid://shopify/Metaobject/101', label: 'Cafés', url_to_remove: '/collections/all?sort_by=price-ascending' }] : [] },
    { param_name: 'filter.v.m.custom.style_filter_transparency', label: 'Transparencia', type: 'list', active_values: [] },
    { param_name: 'filter.v.m.custom.style_filter_pattern', label: 'Patrón', type: 'list', active_values: [] },
  ] },
  metaobjects: { lemoon_style_trait: { values: dictionary, values_count: selection.incomplete ? 51 : dictionary.length } },
  sort_by: 'price-ascending',
});
process.stdout.write(`<collection-component><div class="lemoon-plp" data-collection-url="/collections/all"><select id="SortBy"><option value="price-ascending">Price</option></select><span data-applied-filter-count></span><a data-clear-filters>Reset</a><div id="ProductGridContainer">${html}<span id="ProductCount" data-product-count="0">0</span><div class="collection collection--empty">No products</div></div></div></collection-component>`);
