import { readFileSync } from 'node:fs';
import { Liquid } from 'liquidjs';
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
export function renderDefaultPage(page, language = 'es') {
  const source=read('sections/main-page.liquid')
    .replace(/{% schema %}[\s\S]*?{% endschema %}/,'')
    .replace(/{%-?\s*style\s*-?%}/g,'<style>')
    .replace(/{%-?\s*endstyle\s*-?%}/g,'</style>');
  const raw=read(`locales/${language==='es'?'es':'en.default'}.json`);
  const messages=JSON.parse(raw.slice(raw.indexOf('{')));
  const engine=new Liquid({strictFilters:true});
  engine.registerFilter('asset_url',name=>`/assets/${name}`);
  engine.registerFilter('stylesheet_tag',href=>`<link rel="stylesheet" href="${href}">`);
  engine.registerFilter('t',key=>{
    const value=key.split('.').reduce((node,part)=>node?.[part],messages);
    if(typeof value!=='string') throw new Error(`Missing translation: ${key}`);
    return value;
  });
  const html=engine.parseAndRenderSync(source,{page,section:{id:'default-page-fixture',settings:{padding_top:36,padding_bottom:36}},settings:{animations_reveal_on_scroll:false}});
  // Shopify supplies this wrapper around sections; preserve it in the fixture.
  return `<section id="shopify-section-default-page-fixture">${html}</section>`;
}
