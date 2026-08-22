class LemoonLensConfigurator {
  constructor(root) {
    this.root = root;
    this.step = 1;
    this.steps = [...root.querySelectorAll('[data-step]')];
    this.next = root.querySelector('[data-configurator-next]');
    this.back = root.querySelector('[data-configurator-back]');
    this.summary = root.querySelector('[data-configurator-summary]');
    if (this.next) {
      this.next.addEventListener('click', (event) => {
        if (this.step < 5) {
          event.preventDefault();
          this.go(this.step + 1);
        }
      });
    }
    this.back.addEventListener('click', () => this.go(this.step - 1));
    root.querySelectorAll('.lemoon-configurator__choice').forEach((choice) => choice.addEventListener('change', () => {
      choice.closest('.lemoon-configurator__choices').querySelectorAll('.lemoon-configurator__choice').forEach((item) => item.classList.remove('is-selected'));
      choice.classList.add('is-selected');
    }));
  }
  go(step) {
    this.step = Math.min(5, Math.max(1, step));
    this.steps.forEach((item) => { item.hidden = Number(item.dataset.step) !== this.step; item.classList.toggle('is-active', Number(item.dataset.step) === this.step); });
    this.root.querySelectorAll('.lemoon-configurator__steps li').forEach((item, index) => item.classList.toggle('is-active', index + 1 <= this.step));
    this.back.hidden = this.step === 1;
    if (this.next) {
      this.next.type = this.step === 5 ? 'submit' : 'button';
      this.next.textContent = this.step === 5 ? 'Agregar al carrito →' : 'Continuar →';
    }
    if (this.step === 5) this.summary.textContent = `Tipo: ${this.root.querySelector('[name="lens_type"]:checked')?.value || 'sin selección'} · Índice: ${this.root.querySelector('[name="index"]:checked')?.value || 'por definir'}`;
  }
}
document.querySelectorAll('[data-lens-configurator]').forEach((root) => new LemoonLensConfigurator(root));
