import { renderComponentSection } from './component-library-renderer.mjs';
import { themeFontLinks } from './theme-fonts.mjs';

export function renderMeasurementGuideAnalyticsFixture({ consent = 'granted', language = 'es', kind = 'measurements', editor = false } = {}) {
  const locale = language === 'en' ? 'en' : 'es';
  const root = locale === 'en' ? '/en' : '';
  const content = renderComponentSection('lemoon-guide-page', {
    id: 'measurement-analytics-fixture', language: locale,
    settings: { guide_kind: kind, padding_top: 64, padding_bottom: 64 },
    routes: { root_url: root || '/', all_products_collection_url: `${root}/collections/all` },
    context: { page: { title: locale === 'en' ? 'How to measure your glasses' : 'Cómo medir tus lentes' }, request: { design_mode: editor, locale: { iso_code: locale } }, localization: { language: { iso_code: locale } } },
  });
  const mode = JSON.stringify(consent);
  const setup = `<script>
window.fixtureEvents=[];window.fixtureConsent=${mode}==='granted';
window.Shopify={designMode:${Boolean(editor)}};
if(${mode}!=='sdk-missing')Shopify.analytics={publish:(name,payload)=>{window.fixtureEvents.push({name,payload});return Promise.resolve(true)}};
if(${mode}!=='privacy-missing')Shopify.customerPrivacy={currentVisitorConsent:()=>({analytics:window.fixtureConsent?'yes':'no'}),setTrackingConsent:()=>{throw Error('Consent mutations are outside this fixture')},analyticsProcessingAllowed:()=>{if(${mode}==='privacy-throw')throw Error('Native service failure');return window.fixtureConsent}};
else Shopify.loadFeatures=(features,callback)=>callback(Error('Native service unavailable'));
window.fixtureSetConsent=allowed=>{window.fixtureConsent=allowed;document.dispatchEvent(new CustomEvent('visitorConsentCollected',{detail:{analyticsAllowed:allowed}}))};
</script>`;
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Measurement guide analytics · local fixture</title>${themeFontLinks}<style>:root{--font-body-family:var(--lemoon-font-body);--font-heading-family:var(--lemoon-font-heading);--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:26,26,26;--color-shadow:11,31,58}html{box-sizing:border-box;font-size:62.5%}*,*::before,*::after{box-sizing:inherit}body{margin:0;font-size:1.6rem}</style><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-components.css">${setup}</head><body><main>${content}</main></body></html>`;
}
