import { renderComponentSection, contactErrors, renderComponentFixture } from './component-library-renderer.mjs';

export function waveOptions(scenario) {
  const form = scenario.endsWith('-error') ? { errors: contactErrors({ author: 'revisa el nombre', email: 'revisa el correo', body: 'revisa el mensaje' }), author: 'Nombre <&"', email: 'test@example.test', body: 'Texto <&"' } : scenario.endsWith('-success') ? { 'posted_successfully?': true } : {};
  if (scenario.startsWith('newsletter')) return ['footer', { settings: { newsletter_enable: true, newsletter_heading: 'Novedades <&"', newsletter_placeholder: 'Correo <&"', newsletter_button: 'Suscribirme', newsletter_success: 'Gracias <&"' }, form, context: { request: { page_type: 'page' }, shop: { name: 'Fixture' } } }];
  if (scenario.startsWith('article')) return ['main-article', { form, context: { article: { id: 42, url: '/blogs/journal/fixture', content: '<p>Fixture</p>', comments_count: 0 }, blog: { url: '/blogs/journal', title: 'Journal', 'comments_enabled?': true, 'moderated?': scenario.includes('moderated') }, comment: { status: 'unapproved' } } }];
  if (scenario.startsWith('legacy-faq')) return ['lemoon-faq', { context: { page: { title: 'Preguntas <&"' } }, blocks: [1, 2].map(n => ({ id: `q${n}`, shopify_attributes: `data-shopify-editor-block="q${n}"`, settings: { question: `Pregunta ${n} <&"${scenario.endsWith('-long') ? ' pregunta extensa'.repeat(20) : ''}`, answer: `<p>Respuesta ${n} ${scenario.endsWith('-long') ? 'Respuesta extensa '.repeat(100) : ''}<a href="#destination">Enlace</a></p>` } })) }];
  return ['lemoon-legal-page', { settings: { kind: scenario.replace('legal-', ''), contact_url: scenario === 'legal-terms' ? '/ayuda?x=1&y=2' : '' }, context: { page: { title: 'Legal <&"', content: '<p>CMS <strong>original</strong></p>' }, shop: { privacy_policy: { body: '<p>Privacidad nativa</p>', url: '/policies/privacy-policy' } } }, routes: { root_url: '/es/' } }];
}

export function renderWave(scenario, sourceRoot) {
  const [name, options] = waveOptions(scenario);
  return renderComponentSection(name, { ...options, ...(sourceRoot ? { sourceRoot } : {}) });
}

export function renderWaveFixture(scenario) {
  const shell = renderComponentFixture('controls');
  return shell.replace(/<body>[\s\S]*?<script>/, `<body>${renderWave(scenario)}<script>`);
}
