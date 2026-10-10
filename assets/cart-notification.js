class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = this.querySelector('#cart-notification');
    this.productName = this.querySelector('#cart-notification-product');
    this.dismissTimer = null;
    this.header = document.querySelector('sticky-header');

    this.querySelectorAll('.cart-notification__close').forEach((button) => {
      button.addEventListener('click', () => this.close());
    });
  }

  open() {
    if (!this.notification) return;

    window.clearTimeout(this.dismissTimer);
    this.notification.setAttribute('aria-hidden', 'false');
    this.notification.getBoundingClientRect();
    this.notification.classList.add('active');
    this.dismissTimer = window.setTimeout(() => this.close(), 4500);
  }

  close() {
    if (!this.notification) return;

    window.clearTimeout(this.dismissTimer);
    this.notification.classList.remove('active');
    this.notification.setAttribute('aria-hidden', 'true');
  }

  // Keep the cart count in sync while leaving the custom header markup intact.
  dispatchCartViewEvent(cart) {
    const { CartViewEvent } = window.StandardEvents || {};
    if (!CartViewEvent || !cart?.currency) return;

    this.dispatchEvent(
      new CartViewEvent({
        context: 'dialog',
        cart: CartViewEvent.createCartFromAjaxResponse(cart),
      })
    );
  }

  renderContents(parsedState) {
    this.renderProductName(parsedState);

    const cartPromise = this.updateCartCount();
    if (typeof this.header?.reveal === 'function') this.header.reveal();
    this.open();
    cartPromise.then((cart) => this.dispatchCartViewEvent(cart));
  }

  renderProductName(parsedState) {
    if (!this.productName) return;

    const sectionHtml = parsedState.sections?.['cart-notification-product'];
    if (!sectionHtml) return;

    const section = new DOMParser()
      .parseFromString(sectionHtml, 'text/html')
      .querySelector('[data-cart-item-key="' + CSS.escape(String(parsedState.key)) + '"]');
    const name = section?.querySelector('.cart-notification-product__name')?.textContent?.trim();

    if (name) this.productName.textContent = name;
  }

  async updateCartCount() {
    try {
      const root = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${root}cart.js`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return null;

      const cart = await response.json();
      this.updateCartBadge(cart.item_count);
      return cart;
    } catch (error) {
      return null;
    }
  }

  updateCartBadge(itemCount) {
    ['cart-icon-bubble', 'cart-icon-bubble-mobile'].forEach((id) => {
      const cartLink = document.getElementById(id);
      if (!cartLink) return;

      let badge = cartLink.querySelector('.lemoon-header__cart-count');
      let accessibleCount = cartLink.querySelector('[data-cart-count-accessible]');
      if (itemCount > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'lemoon-header__cart-count';
          badge.setAttribute('aria-hidden', 'true');
          cartLink.append(badge);
        }
        badge.textContent = itemCount;
        badge.classList.remove('is-popping');
        void badge.offsetWidth;
        badge.classList.add('is-popping');
        badge.addEventListener('animationend', () => badge.classList.remove('is-popping'), { once: true });

        if (!accessibleCount) {
          accessibleCount = document.createElement('span');
          accessibleCount.className = 'visually-hidden';
          accessibleCount.dataset.cartCountAccessible = '';
          cartLink.append(accessibleCount);
        }
        accessibleCount.textContent = (cartLink.dataset.cartCountLabel || '[count] items')
          .replace('[count]', itemCount);
      } else {
        badge?.remove();
        accessibleCount?.remove();
      }
    });
  }

  getSectionsToRender() {
    return [{ id: 'cart-notification-product' }];
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
