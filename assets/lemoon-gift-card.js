(() => {
  function initGiftCard() {
    const root = document.querySelector('.gift-card');
    if (!root) return;
    const copy = root.querySelector('.gift-card__copy-button');
    const code = root.querySelector('#gift-card-code');
    const status = root.querySelector('.gift-card__copy-success');
    if (copy && code && status) {
      copy.hidden = false;
      copy.addEventListener('click', async () => {
        if (copy.disabled) return;
        copy.disabled = true;
        status.textContent = '';
        try {
          const value = code.textContent.replace(/\s/g, '');
          if (!value || !navigator.clipboard?.writeText) throw new Error('clipboard_unavailable');
          await navigator.clipboard.writeText(value);
          status.textContent = root.dataset.copySuccess;
          status.dataset.state = 'success';
        } catch {
          status.textContent = root.dataset.copyError;
          status.dataset.state = 'error';
        } finally {
          copy.disabled = false;
        }
      });
    }
    const print = root.querySelector('.gift-card__print-button');
    if (print) {
      print.hidden = false;
      print.addEventListener('click', () => window.print());
    }
    const qr = root.querySelector('.gift-card__qr-code');
    if (qr?.dataset.identifier && typeof window.QRCode === 'function') {
      try {
        new window.QRCode(qr, { text: qr.dataset.identifier, width: 120, height: 120, imageAltText: qr.dataset.alt });
      } catch {
        qr.hidden = true;
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGiftCard, { once: true });
  else initGiftCard();
})();
