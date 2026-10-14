const purposes = ['analytics', 'marketing', 'preferences'];

export async function loadCustomerPrivacy(environment = window, timeoutMs = 4000) {
  const started = Date.now();
  while (typeof environment.Shopify?.loadFeatures !== 'function' && !environment.Shopify?.customerPrivacy) {
    if (Date.now() - started >= timeoutMs) throw new Error('privacy_service_unavailable');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!environment.Shopify.customerPrivacy) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('privacy_service_unavailable')), timeoutMs);
      environment.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], error => {
        clearTimeout(timer);
        error ? reject(new Error('privacy_service_unavailable')) : resolve();
      });
    });
  }
  const api = environment.Shopify.customerPrivacy;
  if (typeof api?.currentVisitorConsent !== 'function' || typeof api?.setTrackingConsent !== 'function') throw new Error('privacy_service_unavailable');
  return api;
}

export function privacyChoices(consent) {
  return Object.fromEntries(purposes.map(purpose => [purpose, consent[purpose] === 'yes']));
}

export function savePrivacyChoices(api, choices, timeoutMs = 4000) {
  const selection = Object.fromEntries(purposes.map(purpose => [purpose, choices[purpose] === true]));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('privacy_save_failed')), timeoutMs);
    try {
      api.setTrackingConsent(selection, result => {
        clearTimeout(timer);
        if (result?.error) { reject(new Error('privacy_save_failed')); return; }
        const consent = api.currentVisitorConsent();
        purposes.every(purpose => consent[purpose] === (selection[purpose] ? 'yes' : 'no'))
          ? resolve() : reject(new Error('privacy_save_failed'));
      });
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

if (typeof document !== 'undefined' && !document.documentElement.dataset.lemoonCookiePreferencesReady) {
  document.documentElement.dataset.lemoonCookiePreferencesReady = 'true';
  const openers = new WeakMap();
  const initialize = () => {
    const footerControl = document.querySelector('[data-lemoon-footer] [data-cookie-preferences][aria-controls]');
    document.querySelectorAll('[data-cookie-preferences]').forEach(button => {
      if (!button.hasAttribute('aria-controls') && footerControl) button.setAttribute('aria-controls', footerControl.getAttribute('aria-controls'));
      button.hidden = !button.hasAttribute('aria-controls');
    });
    document.querySelectorAll('[data-cookie-dialog]').forEach(dialog => {
      if (dialog.dataset.ready) return;
      dialog.dataset.ready = 'true';
      dialog.addEventListener('close', () => openers.get(dialog)?.focus());
    });
  };
  initialize();
  document.addEventListener('shopify:section:load', initialize);
  document.addEventListener('click', async event => {
    if (!(event.target instanceof Element)) return;
    const opener = event.target.closest('[data-cookie-preferences]');
    if (opener) {
      if (opener.getAttribute('aria-busy') === 'true') return;
      const status = opener.closest('[data-cookie-preferences-control]')?.querySelector('[data-cookie-preferences-status]');
      if (status) status.textContent = '';
      opener.setAttribute('aria-busy', 'true');
      try {
        const api = await loadCustomerPrivacy();
        const dialog = document.getElementById(opener.getAttribute('aria-controls'));
        if (!dialog) throw new Error('privacy_service_unavailable');
        if (dialog.getAttribute('aria-busy') === 'true') return;
        const selection = privacyChoices(api.currentVisitorConsent());
        dialog.querySelectorAll('[data-cookie-purpose]').forEach(input => { input.checked = selection[input.dataset.cookiePurpose]; });
        dialog.querySelector('[data-cookie-error]').textContent = '';
        openers.set(dialog, opener);
        dialog.showModal();
      } catch {
        if (status) status.textContent = status.dataset.unavailable;
      } finally {
        opener.removeAttribute('aria-busy');
      }
      return;
    }
    const dialog = event.target.closest('[data-cookie-dialog]');
    if (!dialog) return;
    if (event.target.closest('[data-cookie-close]')) { dialog.close(); return; }
    const action = event.target.closest('[data-cookie-action]');
    if (!action || dialog.getAttribute('aria-busy') === 'true') return;
    const inputs = [...dialog.querySelectorAll('[data-cookie-purpose]')];
    const selection = Object.fromEntries(inputs.map(input => [input.dataset.cookiePurpose, action.dataset.cookieAction === 'save' ? input.checked : action.dataset.cookieAction === 'accept']));
    const error = dialog.querySelector('[data-cookie-error]');
    error.textContent = '';
    dialog.setAttribute('aria-busy', 'true');
    dialog.querySelectorAll('[data-cookie-action], [data-cookie-purpose]').forEach(control => { control.disabled = true; });
    try {
      const api = await loadCustomerPrivacy();
      await savePrivacyChoices(api, selection);
      dialog.close();
    } catch {
      error.textContent = error.dataset.message;
    } finally {
      dialog.removeAttribute('aria-busy');
      dialog.querySelectorAll('[data-cookie-action], [data-cookie-purpose]').forEach(control => { control.disabled = false; });
    }
  });
}
