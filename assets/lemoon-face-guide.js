import './lemoon-face-frame-preview.js';

// Theme publisher only. The separately configured Shopify pixel owns GA4 delivery.
export const FACE_GUIDE_EVENT = 'lemoon:face_guide_click';
const TRACKING_KEY = Symbol.for('lemoon.faceGuideTracking');
const FAMILIES = new Set(['oval', 'round', 'square', 'heart', 'diamond', 'long']);
const SHAPES = Object.freeze({
  redondo: 'round', rectangular: 'rectangular', 'geométrico': 'geometric',
  ovalado: 'oval', aviador: 'aviator', 'ojo de gato': 'cat-eye',
});
const ACTIONS = Object.freeze({
  face_index: { position: 'index', destinations: ['face_family'], family: true },
  frame_shape: { position: 'family', destinations: ['filtered_catalogue'], family: true },
  family_catalogue: { position: 'family', destinations: ['filtered_catalogue', 'catalogue', 'custom'], family: true },
  measure: { position: 'fit', destinations: ['measure_guide', 'custom'] },
  catalogue: { position: 'closing', destinations: ['catalogue', 'custom'] },
  quiz: { position: 'closing', destinations: ['style_quiz', 'custom'] },
});

// Read only controlled editorial codes. Never read href, labels or visitor data.
export function buildFaceGuidePayload(anchor) {
  const root = anchor?.closest?.('[data-face-guide]');
  const metadata = anchor?.closest?.('[data-face-guide-action]');
  if (!root || !metadata || !root.contains(metadata) || !anchor.matches('a[href]')) return null;
  const { faceGuideAction: action, faceGuidePosition: position, faceGuideDestination: destination } = metadata.dataset;
  const contract = Object.hasOwn(ACTIONS, action) ? ACTIONS[action] : null;
  if (!contract || position !== contract.position || !contract.destinations.includes(destination)) return null;
  const payload = { guide_id: 'face_shape', action, link_position: position, destination };
  if (contract.family) {
    const familyElement = anchor.closest('[data-face-guide-family]');
    const family = familyElement?.dataset.faceGuideFamily;
    if (!familyElement || !root.contains(familyElement) || !FAMILIES.has(family)) return null;
    payload.face_family = family;
  }
  if (action === 'frame_shape') {
    const value = metadata.dataset.faceGuideFrame;
    if (!Object.hasOwn(SHAPES, value)) return null;
    payload.frame_shape = SHAPES[value];
  }
  if (action === 'family_catalogue' && destination === 'filtered_catalogue') {
    const values = (metadata.dataset.faceGuideShapes || '').split('|');
    if (![2, 3].includes(values.length) || new Set(values).size !== values.length || !values.every(value => Object.hasOwn(SHAPES, value))) return null;
    payload.selected_shapes = values.map(value => SHAPES[value]);
  }
  return payload;
}

// A true result means attempted publication, not delivery to Shopify or GA4.
export function publishFaceGuideClick(anchor, environment = window) {
  try {
    const shopify = environment.Shopify;
    if (typeof shopify?.customerPrivacy?.analyticsProcessingAllowed !== 'function'
      || shopify.customerPrivacy.analyticsProcessingAllowed() !== true
      || typeof shopify.analytics?.publish !== 'function') return false;
    const payload = buildFaceGuidePayload(anchor);
    if (!payload) return false;
    Promise.resolve(shopify.analytics.publish(FACE_GUIDE_EVENT, payload)).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function initializeFaceGuideTracking(environment = window) {
  const doc = environment.document;
  if (!doc?.querySelector('[data-face-guide]') || doc[TRACKING_KEY]) return false;
  const state = { privacyRequested: false };
  const loadPrivacy = () => {
    try {
      const shopify = environment.Shopify;
      if (typeof shopify?.customerPrivacy?.analyticsProcessingAllowed === 'function'
        || state.privacyRequested || typeof shopify?.loadFeatures !== 'function') return;
      state.privacyRequested = true;
      shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.2' }], () => {});
    } catch {
      // Unknown permission stays untracked. No queue, retries or consent replay.
    }
  };
  const onInteraction = event => {
    if (event.defaultPrevented
      || (event.type === 'click' && event.button != null && event.button !== 0)
      || (event.type === 'auxclick' && event.button !== 1)) return;
    const target = event.target?.closest ? event.target : event.target?.parentElement;
    const anchor = target?.closest?.('a[href]');
    if (!anchor?.closest('[data-face-guide]')) return;
    try {
      if (typeof environment.Shopify?.customerPrivacy?.analyticsProcessingAllowed !== 'function') {
        loadPrivacy();
        return;
      }
    } catch {
      return;
    }
    publishFaceGuideClick(anchor, environment);
  };
  doc[TRACKING_KEY] = state;
  doc.addEventListener('click', onInteraction);
  doc.addEventListener('auxclick', onInteraction);
  doc.addEventListener('shopify:section:load', () => {
    if (doc.querySelector('[data-face-guide]')) loadPrivacy();
  });
  loadPrivacy();
  return true;
}

if (typeof window !== 'undefined') initializeFaceGuideTracking(window);
