import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { faceGuideSchema, faceGuideSection, faceGuideShapes, renderFaceGuide, shapeParam } from '../helpers/face-guide-renderer.mjs';

const readback = JSON.parse(readFileSync(new URL('../fixtures/face-guide-catalogue-links.json', import.meta.url)));
const articles = html => [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([article]) => article);
const links = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([markup, href, content]) => ({ markup, url: new URL(href.replaceAll('&amp;', '&'), 'https://fixture.test'), text: content.replace(/<[^>]*>/g, '').trim() }));
const catalogueLinks = html => links(html).filter(({ url, markup }) => url.pathname.endsWith('/collections/all') && /class="[^"]*lemoon-face-guide__cta/.test(markup));

describe('editable face guide rendered from actual Liquid', () => {
  it('labels only the two suggested shapes in each family', () => {
    for (const article of articles(renderFaceGuide())) {
      const choices = [...article.matchAll(/<button\b[^>]*class="lemoon-face-guide__choice"[^>]*>[\s\S]*?<\/button>/g)].map(([choice]) => choice);
      expect(choices.length).toBeGreaterThanOrEqual(2);
      expect(choices.filter(choice => choice.includes('data-face-frame-suggested'))).toHaveLength(2);
      for (const choice of choices) {
        const badge = choice.match(/<span class="lemoon-face-guide__choice-tag[^>]*>([^<]*)<\/span>/);
        expect(badge).not.toBeNull();
        expect(badge[1].trim()).toBe(choice.includes('data-face-frame-suggested') ? 'Sugerida' : '');
      }
    }
  });

  it('renders six complete families, unique navigable anchors and one page heading', () => {
    const html = renderFaceGuide();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const families = articles(html);
    expect(families).toHaveLength(6);
    for (const [index, family] of families.entries()) {
      expect(family).toMatch(/<h[23]\b/);
      expect(family.match(/<li\b/g)?.length).toBeGreaterThanOrEqual(2);
      expect(catalogueLinks(family)).toHaveLength(1);
      expect(family).toContain(`data-editor-block="${faceGuideSection().blocks[index].id}"`);
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);
    expect(new Set(ids).size).toBe(ids.length);
    const anchors = links(html).filter(({ url }) => url.hash);
    expect(anchors.length).toBeGreaterThanOrEqual(6);
    for (const { url } of anchors) expect(ids).toContain(url.hash.slice(1));
    expect(html).not.toMatch(/role="tab/);
    for (const family of families) expect(family).not.toMatch(/^<article\b[^>]*\shidden(?:\s|>)/);
  });

  it('links every family to the two independent native OR values verified in the catalogue', () => {
    const families = articles(renderFaceGuide());
    for (const [index, evidence] of readback.entries()) {
      const [{ url }] = catalogueLinks(families[index]);
      const observed = new URL(evidence.relative_url, 'https://fixture.test');
      expect(url.pathname).toBe(observed.pathname);
      expect([...url.searchParams]).toEqual([...observed.searchParams]);
      expect(url.searchParams.getAll(shapeParam)).toEqual(evidence.shapes);
      expect([...new Set(url.searchParams.keys())]).toEqual([shapeParam]);
    }
    expect(catalogueLinks(families[1])[0].url.href).toContain('geom%C3%A9trico');
    expect(catalogueLinks(families[4])[0].url.searchParams.getAll(shapeParam)).toContain('ojo de gato');
  });

  it.each(faceGuideShapes)('falls back for the complete pair when the native value %s is absent', missing => {
    const section = faceGuideSection();
    const html = renderFaceGuide({ section, shapes: faceGuideShapes.filter(value => value !== missing) });
    for (const [index, family] of articles(html).entries()) {
      const [{ url, text }] = catalogueLinks(family);
      const pair = [section.blocks[index].settings.shape_1, section.blocks[index].settings.shape_2];
      if (pair.includes(missing)) {
        expect(url.search).toBe('');
        expect(text).toBe('Ver catálogo');
        expect(family).toContain('catálogo completo');
      } else expect(url.searchParams.getAll(shapeParam)).toEqual(pair);
    }
  });

  it.each([{ filters: [] }, { filters: [{ param_name: 'filter.p.m.custom.other', values: [] }] }, { filters: [{ param_name: shapeParam, values: [] }] }])('exposes a truthful unrestricted fallback for missing filter exposure %j', ({ filters }) => {
    for (const family of articles(renderFaceGuide({ filters }))) {
      const [{ url, text }] = catalogueLinks(family);
      expect(url.pathname).toBe('/collections/all');
      expect(url.search).toBe('');
      expect(text).toBe('Ver catálogo');
    }
  });

  it.each(['/', '/en', '/en/'])('preserves localized catalogue and page routes at root %s', root => {
    const prefix = root === '/' ? '' : '/en';
    const html = renderFaceGuide({ root });
    for (const { url } of catalogueLinks(html)) expect(url.pathname).toBe(`${prefix}/collections/all`);
    const pageLinks = links(html).filter(({ url }) => url.pathname.includes('/pages/'));
    expect(pageLinks.map(({ url }) => url.pathname)).toEqual(expect.arrayContaining([`${prefix}/pages/como-medir-tus-anteojos`, `${prefix}/pages/descubre-tu-estilo`]));
    for (const { url } of pageLinks) expect(url.pathname).not.toContain('//');
  });

  it('renders changed merchant text as escaped text and preserves image-free content', () => {
    const section = faceGuideSection();
    Object.assign(section.blocks[0].settings, { name_label: 'Mi contorno <img src=x onerror="alert(1)">', cue_1: '<script>unsafe()</script>', cue_2: 'Otra pista & referencia', reason: 'Razón propia de la tienda' });
    const first = articles(renderFaceGuide({ section }))[0];
    expect(first).toContain('Mi contorno &lt;img');
    expect(first).toContain('&lt;script&gt;unsafe()&lt;/script&gt;');
    expect(first).toContain('Otra pista &amp; referencia');
    expect(first).toContain('Razón propia de la tienda');
    expect(first).not.toMatch(/<img src=x|<script>/);
    expect(catalogueLinks(first)[0].url.searchParams.getAll(shapeParam)).toHaveLength(2);
  });

  it.each([['es', 'Ojo de gato'], ['en', 'Cat-eye']])('resolves spaced native shapes through upload-safe translation IDs (%s)', (language, label) => {
    const html = renderFaceGuide({ language });
    expect(html).toContain(label);
    expect(html).not.toMatch(/translation missing|sections\.lemoon_face_guide\.shapes/i);
    expect(catalogueLinks(articles(html)[4])[0].url.searchParams.getAll(shapeParam)).toContain('ojo de gato');
    const family = faceGuideSchema().blocks.find(({ type }) => type === 'family');
    for (const id of ['shape_1', 'shape_2']) {
      expect(family.settings.find(setting => setting.id === id).options.find(({ value }) => value === 'ojo de gato').label)
        .toBe('t:sections.lemoon_face_guide.shapes.ojo_de_gato');
    }
  });

  it.each([['es', 'Geométricos'], ['en', 'Geometric']])('resolves accented native shapes through ASCII translation IDs (%s)', (language, label) => {
    const html = renderFaceGuide({ language });
    expect(html).toContain(label);
    expect(html).not.toMatch(/translation missing|sections\.lemoon_face_guide\.shapes/i);
    expect(catalogueLinks(articles(html)[1])[0].url.searchParams.getAll(shapeParam)).toContain('geométrico');
    const family = faceGuideSchema().blocks.find(({ type }) => type === 'family');
    for (const id of ['shape_1', 'shape_2']) {
      expect(family.settings.find(setting => setting.id === id).options.find(({ value }) => value === 'geométrico').label)
        .toBe('t:sections.lemoon_face_guide.shapes.geometrico');
    }
  });

  it('keeps family content, images and destinations editable in the editor', () => {
    const schema = faceGuideSchema();
    const family = schema.blocks.find(({ type }) => type === 'family');
    expect(family.settings.find(({ id }) => id === 'image').type).toBe('image_picker');
    for (const id of ['name_label', 'cue_1', 'cue_2', 'reason', 'shape_1', 'shape_2']) expect(family.settings.some(setting => setting.id === id)).toBe(true);
    expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  });

  it.each(['bridge', 'cheek', 'temple'])('uses the merchant %s illustration instead of the raster fallback while preserving the other fit images and advice', kind => {
    const section = faceGuideSection();
    section.settings[`${kind}_image`] = { url: '/assets/lemoon-category-opticos-generic-v1.jpg', width: 1402, height: 1122, alt: 'Merchant image description' };
    const html = renderFaceGuide({ section });
    const figures = [...html.matchAll(/<figure\b[^>]*class="lemoon-face-guide__fit-hint"[^>]*>([\s\S]*?)<\/figure>/g)].map(([, figure]) => figure);
    expect(figures).toHaveLength(3);
    for (const [index, currentKind] of ['bridge', 'cheek', 'temple'].entries()) {
      expect(figures[index]).toMatch(/<figcaption>[\s\S]*<h3\b[\s\S]*<p>/);
      expect(figures[index]).not.toContain('<svg');
      if (currentKind === kind) {
        expect(figures[index]).toContain('src="/assets/lemoon-category-opticos-generic-v1.jpg?width=700"');
        expect(figures[index]).not.toContain(`lemoon-fit-${kind}-editorial-v1-`);
        expect(figures[index]).toMatch(/<img\b[^>]*alt=""[^>]*loading="lazy"/);
      } else {
        expect(figures[index]).toContain(`lemoon-fit-${currentKind}-editorial-v1-700.webp`);
        expect(figures[index]).not.toContain('lemoon-category-opticos-generic-v1.jpg');
      }
    }
  });

  it('honors a merchant destination and escapes its custom label without claiming the default pair', () => {
    const section = faceGuideSection();
    Object.assign(section.blocks[0].settings, { destination: '/en/collections/opticos?sort_by=title-ascending', custom_label: 'Mi selección <b>propia</b>' });
    const first = articles(renderFaceGuide({ section }))[0];
    const cta = links(first).find(({ markup }) => /class="[^"]*lemoon-face-guide__cta/.test(markup));
    expect(cta.url.pathname).toBe('/en/collections/opticos');
    expect([...cta.url.searchParams]).toEqual([['sort_by', 'title-ascending']]);
    expect(cta.text).toBe('Mi selección &lt;b&gt;propia&lt;/b&gt;');
    expect(cta.url.searchParams.has(shapeParam)).toBe(false);
  });

  it('does not present duplicate choices as a validated two-shape selection', () => {
    const section = faceGuideSection();
    section.blocks[0].settings.shape_2 = section.blocks[0].settings.shape_1;
    const first = articles(renderFaceGuide({ section }))[0];
    const [{ url, text }] = catalogueLinks(first);
    expect(url.search).toBe('');
    expect(text).toBe('Ver catálogo');
  });
});
