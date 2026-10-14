import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { createLensCatalogue, chooseLens, lensSteps, resolveLensVariant, parseLensPackage } from '../../assets/lens-configurator.js';
const variants = [
 {id:1,options:['Carey','Solo armazón','1.50'],available:true,price:39900},
 {id:2,options:['Carey','Monofocal','1.50'],available:true,price:59900},
 {id:3,options:['Carey','Monofocal','1.67'],available:true,price:84900},
 {id:4,options:['Carey','Monofocal + filtro azul','1.50'],available:true,price:69900},
 {id:5,options:['Carey','Monofocal fotocromático','1.50'],available:true,price:84900},
 {id:6,options:['Carey','Progresivo','1.50'],available:false,price:119900},
 {id:7,options:['Carey','Solar sin receta','1.50'],available:true,price:59900},
 {id:8,options:['Azul','Monofocal','1.67'],available:true,price:90000},
];
const catalogue = () => createLensCatalogue(variants, ['Color','Lentes','Índice'], 1);

test('catalogue offers only available native packages for the selected frame colour', () => {
 expect(catalogue().rows.map(({variant}) => variant.id)).toEqual([2,3,4,5,7]);
 expect(parseLensPackage('Lectura + antirreflejo')).toBeNull();
 expect(createLensCatalogue(variants,['Color','Tamaño'],1).rows).toEqual([]);
});
test('lens decisions resolve an exact charged variant and never invent extra combinations', () => {
 const state = {use:'mono',crystal:'clear',index:'1.67',extra:'none'};
 expect(resolveLensVariant(catalogue(),state).id).toBe(3);
 expect(resolveLensVariant(catalogue(),{...state,extra:'blue'})).toBeUndefined();
 expect(resolveLensVariant(catalogue(),{...state,use:'progressive'})).toBeUndefined();
});
test('changing upstream decisions invalidates downstream values and resets prescription mode', () => {
 const state = {use:'mono',distance:'near',crystal:'clear',index:'1.67',extra:'blue',recipeMode:'upload'};
 const changed = chooseLens(catalogue(),state,'use','solar');
 expect(changed.recipeMode).toBe('manual');
 expect(changed.distance).toBeNull();
 expect(changed.crystal).toBeNull();
 expect(changed.extra).toBeNull();
});
test('solar skips prescription, single index and unavailable extras; optical flow retains prescription', () => {
 const solar = chooseLens(catalogue(),chooseLens(catalogue(),{},'use','solar'),'crystal','sun');
 expect(lensSteps(catalogue(),solar)).toEqual(['use','crystal','review']);
 const mono = chooseLens(catalogue(),chooseLens(catalogue(),{},'use','mono'),'crystal','clear');
 expect(lensSteps(catalogue(),mono)).toContain('prescription');
 expect(lensSteps(catalogue(),mono)).toContain('index');
 expect(resolveLensVariant(catalogue(),solar).id).toBe(7);
});
test('section submits real IDs with native multipart uploads and no invented product fallback', () => {
 const source = readFileSync(new URL('../../sections/lens-configurator.liquid',import.meta.url),'utf8');
 expect(source).toContain("form 'product', product");
 expect(source).toContain("enctype: 'multipart/form-data'");
 expect(source).toContain("name=\"properties[{{ 'lemoon_lens_flow.property_file' | t | escape }}]\"");
 expect(source).not.toMatch(/"default"\s*:\s*"Dalton"|Enviaré mi receta después/);
 expect(source.match(/<h1\b/g)).toHaveLength(1);
 expect(source).toContain('lemoon_lens_flow');
});


test('native property names are localized and escaped while Spanish keeps its existing cart labels', () => {
 const source = readFileSync(new URL('../../sections/lens-configurator.liquid',import.meta.url),'utf8');
 for (const key of ['property_recipe','property_use','property_file','property_pd','sphere','cylinder','axis','addition']) expect(source).toContain(`'lemoon_lens_flow.${key}' | t | escape`);
 for (const locale of ['en.default','es']) {
  const text = readFileSync(new URL(`../../locales/${locale}.json`,import.meta.url),'utf8');
  const labels = JSON.parse(text.slice(text.indexOf('{'))).lemoon_lens_flow;
  for (const key of ['property_recipe','property_use','property_file','property_pd']) expect(labels[key]).toBeTruthy();
  if (locale === 'es') expect(labels.property_pd).toBe('Distancia pupilar (mm)');
 }
});
