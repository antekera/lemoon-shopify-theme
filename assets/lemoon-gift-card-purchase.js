export async function addGiftCard(formData, endpoint, fetcher = fetch) {
  const ids = formData.getAll('id');
  if (ids.length !== 1 || !/^[1-9]\d*$/.test(ids[0])) throw new Error('gift_variant_invalid');
  if (formData.getAll('quantity').length !== 1 || formData.get('quantity') !== '1') throw new Error('gift_quantity_invalid');
  if (!/^(?:\/[a-zA-Z0-9-]+)*\/cart\/add\.js$/.test(endpoint)) throw new Error('gift_cart_endpoint_invalid');
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: formData,
  });
  const item = await response.json();
  if (!response.ok || item.status) throw new Error('gift_cart_rejected');
  if (String(item.variant_id) !== ids[0] || !Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new Error('gift_cart_unconfirmed');
  return item;
}

const initialized = new WeakSet();

export function initializeGiftPurchase(root) {
  if (initialized.has(root)) return;
  const form = root.querySelector('[data-gift-form]');
  if (!form) return;
  initialized.add(root);
  root.querySelectorAll('[data-gift-price], [data-gift-summary]').forEach(element => { element.hidden = false; });
  const button = form.querySelector('[data-gift-submit]');
  const fields = form.querySelector('[data-recipient-fields]');
  const checkbox = form.querySelector('[data-recipient-checkbox]');
  const email = form.querySelector('[data-recipient-email]');
  const control = form.querySelector('[data-recipient-control]');
  const error = form.querySelector('[data-gift-error]');
  const syncRecipient = () => {
    fields.hidden = !checkbox.checked;
    fields.disabled = !checkbox.checked;
    email.required = checkbox.checked;
    control.value = 'true';
  };
  form.querySelector('[data-recipient-toggle]').hidden = false;
  checkbox.addEventListener('change', syncRecipient);
  syncRecipient();
  form.addEventListener('change', () => {
    const variant = form.querySelector('[data-gift-variant]:checked');
    if (variant) root.querySelectorAll('[data-gift-price]').forEach(price => {
      price.textContent = variant.dataset.formattedPrice;
    });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    const cartUrl = root.dataset.cartUrl;
    if (!/^(?:\/[a-zA-Z0-9-]+)*\/cart$/.test(cartUrl)) return;
    const label = button.textContent;
    button.disabled = true;
    button.textContent = button.dataset.loadingLabel;
    error.hidden = true;
    try {
      await addGiftCard(new FormData(form), root.dataset.cartAddUrl);
      window.location.assign(cartUrl);
    } catch {
      error.textContent = root.dataset.errorMessage;
      error.hidden = false;
      error.tabIndex = -1;
      error.focus();
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
}

if (typeof document !== 'undefined') {
  const initialize = () => document.querySelectorAll('[data-gift-purchase]').forEach(initializeGiftPurchase);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
  document.addEventListener('shopify:section:load', initialize);
}
