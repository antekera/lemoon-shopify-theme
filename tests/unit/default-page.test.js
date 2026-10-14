import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderDefaultPage } from '../helpers/default-page-renderer.mjs';
test('default page never adds scaffold content to a native CMS page',()=>{
 const template=JSON.parse(readFileSync(new URL('../../templates/page.json',import.meta.url),'utf8'));
 const serialized=JSON.stringify(template);
 expect(serialized).not.toMatch(/Título de sección|Comparte información|Columna 1|Describe tu servicio/);
 expect(template.order).toEqual(['main']);
});
test('CMS title is escaped and original editorial HTML and links remain intact',()=>{
 const content='<h2>Servicio y atención</h2><p>Contenido aprobado en el CMS.</p><a href="/pages/contact">Contactar</a>';
 const html=renderDefaultPage({title:'Información <script>alert(1)</script>',content});
 expect(html).toContain('Información &lt;script&gt;alert(1)&lt;/script&gt;');
 expect(html).toContain(content);
 expect(html).not.toContain('<script>alert(1)</script>');
 expect(html.match(/<h1\b/g)).toHaveLength(1);
 expect(html).not.toContain('Esta página está en preparación.');
});
test('empty native content has a localized honest state instead of sample business copy',()=>{
 for(const content of ['',null,'   ']) {
   expect(renderDefaultPage({title:'Información',content})).toContain('Esta página está en preparación.');
   expect(renderDefaultPage({title:'Information',content},'en')).toContain('This page is being prepared.');
 }
});
