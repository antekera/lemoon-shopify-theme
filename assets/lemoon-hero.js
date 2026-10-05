if (!customElements.get('lemoon-hero')) {
  customElements.define('lemoon-hero', class extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('.lemoon-hero__track');
      this.slides = [...this.querySelectorAll('.lemoon-hero__slide')];
      this.dots = [...this.querySelectorAll('.lemoon-hero__dot')];
      if (this.slides.length > 1) {
        this.loopClone = this.slides[0].cloneNode(true);
        this.loopClone.removeAttribute('id');
        [...this.loopClone.attributes].forEach((attribute) => {
          if (attribute.name.startsWith('data-shopify')) this.loopClone.removeAttribute(attribute.name);
        });
        this.loopClone.setAttribute('aria-hidden', 'true');
        this.loopClone.inert = true;
        this.track.append(this.loopClone);
      }
      this.currentIndex = 0;
      this.updateHeight = this.updateHeight.bind(this);
      this.updateCurrent = this.updateCurrent.bind(this);
      this.onBlockSelect = this.onBlockSelect.bind(this);
      this.syncAutoplay = this.syncAutoplay.bind(this);
      this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.updateHeight();
      window.addEventListener('resize', this.updateHeight);
      window.addEventListener('load', this.updateHeight);
      window.visualViewport?.addEventListener('resize', this.updateHeight);
      document.addEventListener('visibilitychange', this.syncAutoplay);
      this.motionPreference.addEventListener('change', this.syncAutoplay);
      this.track.addEventListener('scroll', this.updateCurrent, { passive: true });
      this.addEventListener('shopify:block:select', this.onBlockSelect);
      this.querySelector('[data-hero-previous]')?.addEventListener('click', () => this.goTo(this.currentIndex - 1));
      this.querySelector('[data-hero-next]')?.addEventListener('click', () => this.goTo(this.currentIndex + 1));
      this.dots.forEach((dot, index) => dot.addEventListener('click', () => this.goTo(index)));
      this.syncAutoplay();
    }

    disconnectedCallback() {
      clearInterval(this.autoplayTimer);
      window.removeEventListener('resize', this.updateHeight);
      window.removeEventListener('load', this.updateHeight);
      window.visualViewport?.removeEventListener('resize', this.updateHeight);
      document.removeEventListener('visibilitychange', this.syncAutoplay);
      this.motionPreference?.removeEventListener('change', this.syncAutoplay);
      this.track?.removeEventListener('scroll', this.updateCurrent);
      this.removeEventListener('shopify:block:select', this.onBlockSelect);
      this.loopClone?.remove();
      this.loopClone = null;
    }

    syncAutoplay() {
      clearInterval(this.autoplayTimer);
      if (this.slides.length < 2 || document.hidden || this.motionPreference.matches) return;
      const seconds = Number.parseInt(this.dataset.autoplaySeconds, 10);
      const delay = (Number.isFinite(seconds) && seconds > 0 ? seconds : 4) * 1000;
      this.autoplayTimer = setInterval(() => this.goTo(this.currentIndex + 1), delay);
    }

    updateHeight() {
      const rect = this.getBoundingClientRect();
      const offset = rect.top + window.scrollY;
      this.style.setProperty('--hero-top-offset', `${Math.max(0, Math.ceil(offset))}px`);

      if (!window.matchMedia('(max-width: 749px)').matches) return;
      const viewport = window.visualViewport;
      const availableHeight = Math.max(0, Math.floor((viewport?.offsetTop || 0) + (viewport?.height || window.innerHeight) - rect.top));
      if (this.mobileViewportWidth !== window.innerWidth) {
        this.mobileViewportWidth = window.innerWidth;
        this.mobileHeight = availableHeight;
      } else if (window.scrollY === 0) {
        this.mobileHeight = Math.min(this.mobileHeight, availableHeight);
      }
      this.style.setProperty('--hero-visible-height', `${this.mobileHeight}px`);
    }

    updateCurrent() {
      if (!this.slides.length || !this.track.clientWidth) return;
      if (this.loopClone && this.track.scrollLeft >= this.slides.length * this.track.clientWidth - 1) {
        this.track.scrollLeft = 0;
      }
      this.currentIndex = Math.min(this.slides.length - 1, Math.max(0, Math.round(this.track.scrollLeft / this.track.clientWidth)));
      this.slides.forEach((slide, index) => {
        const inactive = index !== this.currentIndex;
        slide.inert = inactive;
        if (inactive) slide.setAttribute('aria-hidden', 'true');
        else slide.removeAttribute('aria-hidden');
      });
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === this.currentIndex);
        if (index === this.currentIndex) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }

    goTo(index) {
      if (!this.slides.length) return;
      const nextIndex = (index + this.slides.length) % this.slides.length;
      const scrollIndex = this.loopClone && this.currentIndex === this.slides.length - 1 && nextIndex === 0
        ? this.slides.length
        : nextIndex;
      this.track.scrollTo({
        left: scrollIndex * this.track.clientWidth,
        behavior: this.motionPreference.matches ? 'auto' : 'smooth'
      });
      this.currentIndex = nextIndex;
      this.updateCurrent();
    }

    onBlockSelect(event) {
      const index = this.slides.indexOf(event.target.closest('.lemoon-hero__slide'));
      if (index >= 0) this.goTo(index);
    }
  });
}
