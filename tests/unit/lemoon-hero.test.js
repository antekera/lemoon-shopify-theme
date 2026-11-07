import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, test } from 'vitest';

// Invoke listeners with the browser's receiver, rather than calling hero methods
// directly: the hero, window, document, track and ResizeObserver differ.
class Target {
  listeners = new Map();
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(callback);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  emit(type, target = this) {
    for (const callback of this.listeners.get(type) || []) callback.call(this, { target });
  }
  count() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}
function element() {
  const attributes = new Map();
  return {
    attributes: [], inert: false,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
    getAttribute: name => attributes.get(name),
    classList: { toggle() {} },
    cloneNode: () => ({ ...element(), remove() {} }),
  };
}
function mount() {
  const track = Object.assign(new Target(), { clientWidth: 400, scrollLeft: 0, append() {}, scrollTo({ left }) { this.scrollLeft = left; } });
  const slides = [element(), element()], dots = [element(), element()];
  slides.forEach(slide => { slide.closest = () => slide; });
  const window = Object.assign(new Target(), { scrollY: 0, visualViewport: new Target() });
  const motion = Object.assign(new Target(), { matches: false });
  window.matchMedia = query => query.includes('reduced-motion') ? motion : { matches: false };
  const document = Object.assign(new Target(), { hidden: false, querySelector: () => ({}) });
  const properties = new Map(), timers = new Map(), observers = [];
  let Hero, timerId = 0;
  runInNewContext(readFileSync(new URL('../../assets/lemoon-hero.js', import.meta.url), 'utf8'), {
    HTMLElement: Target, customElements: { get() {}, define(name, constructor) { Hero = constructor; } },
    window, document,
    ResizeObserver: class {
      constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
      observe() {}
      disconnect() { this.disconnected = true; }
      deliver() { this.callback([], this); }
    },
    setInterval(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
    clearInterval(id) { timers.delete(id); },
  });
  const hero = Object.assign(new Hero(), {
    dataset: { autoplaySeconds: '4' },
    querySelector: () => track,
    querySelectorAll: selector => selector.includes('slide') ? slides : dots,
    closest: () => null,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 80 }),
    style: { setProperty: (name, value) => properties.set(name, value) },
  });
  hero.connectedCallback();
  return { hero, track, slides, dots, window, document, motion, properties, timers, observers };
}

test.each(['observer', 'resize', 'load', 'visualViewport'])('height callback keeps the hero receiver for %s', source => {
  const { hero, window, observers, properties } = mount();
  hero.getBoundingClientRect = () => ({ top: 120 });
  if (source === 'observer') observers[0].deliver();
  else if (source === 'visualViewport') window.visualViewport.emit('resize');
  else window.emit(source);
  expect(properties.get('--hero-top-offset')).toBe('120px');
});

test('scroll and scrollend update the current slide using the hero receiver', () => {
  const { hero, track, slides, dots } = mount();
  track.scrollLeft = 400;
  track.emit('scroll');
  expect(hero.currentIndex).toBe(1);
  expect(slides[0].inert).toBe(true);
  expect(slides[1].inert).toBe(false);
  expect(dots[1].getAttribute('aria-current')).toBe('true');
  hero.targetOffset = 300;
  track.scrollLeft = 0;
  track.emit('scrollend');
  expect(hero.currentIndex).toBe(0);
  expect(hero.targetOffset).toBe(null);
});

test('visibility and motion events pause and resume a single autoplay timer', () => {
  const { hero, document, motion, timers } = mount();
  expect(timers.size).toBe(1);
  expect([...timers.values()][0].delay).toBe(4000);
  document.hidden = true;
  document.emit('visibilitychange');
  expect(timers.size).toBe(0);
  document.hidden = false;
  document.emit('visibilitychange');
  expect(timers.size).toBe(1);
  motion.matches = true;
  motion.emit('change');
  expect(timers.size).toBe(0);
  motion.matches = false;
  motion.emit('change');
  expect(timers.size).toBe(1);
  [...timers.values()][0].callback();
  expect(hero.currentIndex).toBe(1);
});

test('click navigation and editor block selection keep slide navigation working', () => {
  const { hero, slides, timers } = mount();
  const next = { hasAttribute: name => name === 'data-hero-next' };
  hero.emit('click', { closest: () => next });
  expect(hero.currentIndex).toBe(1);
  expect(timers.size).toBe(1);
  hero.emit('shopify:block:select', slides[0]);
  expect(hero.currentIndex).toBe(0);
});

test('disconnect removes callbacks and timers, and reconnect registers each once', () => {
  const { hero, track, window, document, motion, timers, observers } = mount();
  const targets = [hero, track, window, window.visualViewport, document, motion];
  const counts = targets.map(target => target.count());
  hero.disconnectedCallback();
  expect(targets.map(target => target.count())).toEqual([0, 0, 0, 0, 0, 0]);
  expect(timers.size).toBe(0);
  expect(observers[0].disconnected).toBe(true);
  hero.connectedCallback();
  expect(targets.map(target => target.count())).toEqual(counts);
  expect(timers.size).toBe(1);
  window.emit('resize');
  track.scrollLeft = 400;
  track.emit('scroll');
  expect(hero.currentIndex).toBe(1);
  hero.disconnectedCallback();
  expect(targets.map(target => target.count())).toEqual([0, 0, 0, 0, 0, 0]);
  expect(timers.size).toBe(0);
});
