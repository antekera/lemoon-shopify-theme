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
      this.updateHeight ||= this.updateHeight.bind(this);
      this.updateCurrent ||= this.updateCurrent.bind(this);
      this.onScrollEnd ||= this.onScrollEnd.bind(this);
      this.onBlockSelect ||= this.onBlockSelect.bind(this);
      this.syncAutoplay ||= this.syncAutoplay.bind(this);
      this.onNavigationClick ||= this.onNavigationClick.bind(this);
      this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.updateHeight();
      this.heightObserver = new ResizeObserver(this.updateHeight);
      const header = document.querySelector('.section-header');
      const trustBar = this.closest('.shopify-section')?.nextElementSibling?.querySelector('.lemoon-trust-bar');
      if (header) this.heightObserver.observe(header);
      if (trustBar) this.heightObserver.observe(trustBar);
      window.addEventListener('resize', this.updateHeight);
      window.addEventListener('load', this.updateHeight);
      window.visualViewport?.addEventListener('resize', this.updateHeight);
      document.addEventListener('visibilitychange', this.syncAutoplay);
      this.motionPreference.addEventListener('change', this.syncAutoplay);
      this.track.addEventListener('scroll', this.updateCurrent, { passive: true });
      this.track.addEventListener('scrollend', this.onScrollEnd);
      this.addEventListener('click', this.onNavigationClick);
      this.addEventListener('shopify:block:select', this.onBlockSelect);
      this.syncAutoplay();
    }

    disconnectedCallback() {
      clearInterval(this.autoplayTimer);
      this.heightObserver?.disconnect();
      window.removeEventListener('resize', this.updateHeight);
      window.removeEventListener('load', this.updateHeight);
      window.visualViewport?.removeEventListener('resize', this.updateHeight);
      document.removeEventListener('visibilitychange', this.syncAutoplay);
      this.motionPreference?.removeEventListener('change', this.syncAutoplay);
      this.track?.removeEventListener('scroll', this.updateCurrent);
      this.track?.removeEventListener('scrollend', this.onScrollEnd);
      this.removeEventListener('click', this.onNavigationClick);
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

      const trustBar = this.closest('.shopify-section')?.nextElementSibling?.querySelector('.lemoon-trust-bar');
      const reserve = window.matchMedia('(min-width: 990px)').matches ? trustBar?.getBoundingClientRect().height || 0 : 0;
      this.style.setProperty('--hero-bottom-reserve', `${Math.ceil(reserve)}px`);

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
      if (this.targetOffset !== null && this.targetOffset !== undefined) {
        if (Math.abs(this.track.scrollLeft - this.targetOffset) > 1) return;
        this.targetOffset = null;
      }
      if (this.loopClone && this.track.scrollLeft >= this.slides.length * this.track.clientWidth - 1) {
        this.track.scrollLeft = 0;
      }
      this.currentIndex = Math.min(this.slides.length - 1, Math.max(0, Math.round(this.track.scrollLeft / this.track.clientWidth)));
      this.updateSlideState();
    }

    onScrollEnd() {
      this.targetOffset = null;
      this.updateCurrent();
    }

    updateSlideState() {
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

    goTo(index, useLoop = true) {
      if (!this.slides.length) return;
      const nextIndex = (index + this.slides.length) % this.slides.length;
      const scrollIndex = useLoop && this.loopClone && this.currentIndex === this.slides.length - 1 && nextIndex === 0
        ? this.slides.length
        : nextIndex;
      this.targetOffset = scrollIndex * this.track.clientWidth;
      this.currentIndex = nextIndex;
      this.updateSlideState();
      this.track.scrollTo({
        left: this.targetOffset,
        behavior: this.motionPreference.matches ? 'instant' : 'smooth'
      });
      this.updateCurrent();
    }

    onNavigationClick(event) {
      const control = event.target.closest('[data-hero-previous], [data-hero-next], [data-hero-index]');
      if (!control || !this.contains(control)) return;
      if (control.hasAttribute('data-hero-previous')) this.goTo(this.currentIndex - 1, false);
      else if (control.hasAttribute('data-hero-next')) this.goTo(this.currentIndex + 1, false);
      else this.goTo(Number(control.dataset.heroIndex), false);
      this.syncAutoplay();
    }

    onBlockSelect(event) {
      const index = this.slides.indexOf(event.target.closest('.lemoon-hero__slide'));
      if (index >= 0) this.goTo(index);
    }
  });
}
