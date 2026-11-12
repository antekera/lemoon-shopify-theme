/* Shopify Customer Events > custom pixel. Prepared locally; NOT a theme asset.
 * Install once after the approved release, with Analytics permission required.
 * This subscriber forwards only the four guide events. Google & YouTube keeps
 * ownership of automatic page views and ecommerce events.
 */
(() => {
  if (window.__lemoonMeasurementGuideGA4Ready || typeof analytics === 'undefined' ||
      typeof analytics.subscribe !== 'function' || typeof init === 'undefined' ||
      typeof api === 'undefined' || typeof api.customerPrivacy?.subscribe !== 'function') return;
  window.__lemoonMeasurementGuideGA4Ready = true;

  // Public measurement ID verified in the storefront Google app configuration.
  const measurementId = 'G-QD3MYEBH5F';
  const eventNames = {
    'lemoon:size_guide_view': 'size_guide_view',
    'lemoon:size_guide_step_view': 'size_guide_step_view',
    'lemoon:size_guide_step_click': 'size_guide_step_click',
    'lemoon:size_guide_catalog_click': 'size_guide_catalog_click',
  };
  const paths = new Set(['/pages/como-medir-tus-anteojos', '/en/pages/como-medir-tus-anteojos']);
  const seen = new Set();
  let privacy = init.customerPrivacy;
  let started = false;
  const allowed = () => privacy?.analyticsProcessingAllowed === true;
  function gtag() { window.dataLayer.push(arguments); }

  const updateConsent = () => {
    if (!started) return;
    gtag('consent', 'update', {
      analytics_storage: allowed() ? 'granted' : 'denied',
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    });
  };
  api.customerPrivacy.subscribe('visitorConsentCollected', event => {
    privacy = event.customerPrivacy;
    updateConsent();
  });

  function initializeGoogle(pageLocation) {
    if (started) return;
    window.dataLayer = window.dataLayer || [];
    started = true;
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    updateConsent();
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, page_location: pageLocation,
      page_referrer: '', page_title: 'Measurement guide',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function forward(event, eventName) {
    if (!allowed() || typeof event.id !== 'string' || !event.id || event.id.length > 200 || seen.has(event.id)) return;
    const data = event.customData;
    if (data?.guide_type !== 'measurements' || !['es', 'en'].includes(data.guide_language)) return;
    let location;
    try { location = new URL(event.context?.document?.location?.href); } catch { return; }
    const path = location.pathname.replace(/\/$/, '');
    if (location.protocol !== 'https:' || !['lemoon.cl', 'www.lemoon.cl'].includes(location.hostname) ||
        !paths.has(path) || location.searchParams.has('preview_theme_id')) return;
    const language = path.startsWith('/en/') ? 'en' : 'es';
    if (data.guide_language !== language) return;
    const params = { guide_type: 'measurements', guide_language: language };
    if (eventName === 'size_guide_step_view' || eventName === 'size_guide_step_click') {
      if (![1, 2, 3].includes(data.step_number)) return;
      params.step_number = data.step_number;
    }
    if (eventName === 'size_guide_catalog_click') params.link_destination = 'catalogue';

    // Allowlisted values only; never forward customData, titles, queries or PII.
    initializeGoogle(`https://lemoon.cl${path}`);
    gtag('event', eventName, {
      ...params,
      send_to: measurementId,
      page_location: `https://lemoon.cl${path}`,
      page_referrer: '',
      page_title: 'Measurement guide',
    });
    seen.add(event.id);
    if (seen.size > 256) seen.delete(seen.values().next().value);
  }
  for (const [name, eventName] of Object.entries(eventNames)) {
    analytics.subscribe(name, event => forward(event, eventName));
  }
})();
