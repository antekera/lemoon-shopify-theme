// Shopify Admin > Settings > Customer events > Custom pixel (JavaScript only).
// Requires Analytics permission. Install only after review; never load in the theme.
// Sends the guide's custom clicks only. Google & YouTube keeps native commerce events.
(() => {
  if (window.lemoonFaceGuidePixelReady) return;
  window.lemoonFaceGuidePixelReady = true;
  const privacyAPI = typeof api === 'object' && api !== null ? api.customerPrivacy : undefined;
  // Custom Pixels expose this API under api.customerPrivacy. An initial consent
  // snapshot alone cannot observe revocation, so a missing listener fails closed.
  if (typeof privacyAPI?.subscribe !== 'function') return;
  const measurementId = 'G-QD3MYEBH5F'; // Public stream ID observed 2026-11-08; verify before activation.
  const actions = new Set(['face_index', 'frame_shape', 'family_catalogue', 'measure', 'catalogue', 'quiz']);
  const positions = new Set(['index', 'family', 'fit', 'closing']);
  const destinations = new Set(['face_family', 'filtered_catalogue', 'catalogue', 'measure_guide', 'style_quiz', 'custom']);
  const families = new Set(['oval', 'round', 'square', 'heart', 'diamond', 'long']);
  const shapes = new Set(['round', 'rectangular', 'geometric', 'oval', 'aviator', 'cat-eye']);
  let permission = typeof init === 'object' ? init.customerPrivacy : undefined;
  let initialized = false;
  let onGuidePage = false;
  const allowed = () => permission?.analyticsProcessingAllowed === true;
  const gtag = function () { window.dataLayer.push(arguments); };

  function eventParameters(data) {
    if (!data || data.guide_id !== 'face_shape' || !actions.has(data.action) || !positions.has(data.link_position) || !destinations.has(data.destination)) return null;
    const parameters = { guide_id: 'face_shape', action: data.action, link_position: data.link_position, destination: data.destination };
    if (data.face_family !== undefined) {
      if (!families.has(data.face_family)) return null;
      parameters.face_family = data.face_family;
    }
    if (data.frame_shape !== undefined) {
      if (!shapes.has(data.frame_shape)) return null;
      parameters.frame_shape = data.frame_shape;
    }
    if (data.selected_shapes !== undefined) {
      if (!Array.isArray(data.selected_shapes) || ![2, 3].includes(data.selected_shapes.length) || data.selected_shapes.some(shape => !shapes.has(shape)) || new Set(data.selected_shapes).size !== data.selected_shapes.length) return null;
      parameters.selected_shapes = data.selected_shapes.join('|');
    }
    return parameters;
  }

  function initializeTag() {
    if (initialized) return;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: 'https://lemoon.cl/pages/elegir-lentes-segun-tu-rostro',
      page_referrer: '',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    initialized = true;
  }

  try {
    const subscription = privacyAPI.subscribe('visitorConsentCollected', event => {
      permission = event.customerPrivacy;
      try {
        if (initialized) gtag('consent', 'update', { analytics_storage: allowed() ? 'granted' : 'denied' });
        else if (onGuidePage && allowed()) initializeTag();
      } catch {
        // A blocked SDK never changes permission or storefront behavior.
      }
    });
    subscription?.catch?.(() => {
      permission = undefined;
      if (initialized) gtag('consent', 'update', { analytics_storage: 'denied' });
    });
  } catch {
    return;
  }
  // Prepare the SDK before an outbound click can unload this page. This does
  // not forward page_viewed or emit a GA4 page_view; other pages stay untouched.
  const pageSubscription = analytics.subscribe('page_viewed', event => {
    onGuidePage = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?pages\/elegir-lentes-segun-tu-rostro\/?$/i.test(event.context?.document?.location?.pathname || '');
    if (!onGuidePage || !allowed()) return;
    try { initializeTag(); } catch { /* Blocked SDK: leave native navigation alone. */ }
  });
  pageSubscription?.catch?.(() => {});
  const subscription = analytics.subscribe('lemoon:face_guide_click', event => {
    if (!allowed()) return;
    const parameters = eventParameters(event.customData);
    if (!parameters) return;
    try {
      initializeTag();
      gtag('event', 'face_guide_click', { ...parameters, send_to: measurementId });
    } catch {
      // A blocked vendor SDK must not affect storefront navigation.
    }
  });
  subscription?.catch?.(() => {});
})();
