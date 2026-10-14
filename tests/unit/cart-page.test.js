import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, test, vi } from 'vitest';

function cartRuntime() {
  const elements = new Map();
  const context = vm.createContext({
    HTMLElement: class {},
    window: {
      StandardEvents: { createViewEventElement: (base) => base },
      quickOrderListStrings: { min_error: 'Minimum [min]', max_error: 'Maximum [max]', step_error: 'Step [step]' },
      cartStrings: { quantityInvalid: 'Enter a whole quantity' },
    },
    document: { activeElement: { getAttribute: () => 'updates[]' } },
    customElements: { define: (name, type) => elements.set(name, type), get: (name) => elements.get(name) },
  });
  vm.runInContext(readFileSync(new URL('../../assets/cart.js', import.meta.url), 'utf8'), context);
  const cart = Object.create(elements.get('cart-items').prototype);
  cart.updateQuantity = vi.fn();
  cart.setValidity = vi.fn();
  return cart;
}

const input = (value, overrides = {}) => ({
  value, dataset: { index: '1', min: '1', quantityVariantId: '123' }, max: '5', step: '1',
  setCustomValidity: vi.fn(), reportValidity: vi.fn(), ...overrides,
});

describe('cart quantity validation', () => {
  test.each(['', ' ', '1.5', '2items', 'NaN', '-1', '9007199254740992'])('does not send invalid quantity %j to Shopify', (value) => {
    const cart = cartRuntime();
    cart.validateQuantity({ target: input(value) });
    expect(cart.updateQuantity).not.toHaveBeenCalled();
    expect(cart.setValidity).toHaveBeenCalled();
  });
  test('preserves the server quantity rule and maximum', () => {
    const cart = cartRuntime();
    cart.validateQuantity({ target: input('6') });
    expect(cart.setValidity).toHaveBeenCalledWith(expect.anything(), '1', 'Maximum 5');
    cart.validateQuantity({ target: input('3', { step: '2' }) });
    expect(cart.setValidity).toHaveBeenLastCalledWith(expect.anything(), '1', 'Step 2');
    expect(cart.updateQuantity).not.toHaveBeenCalled();
  });
  test('updates a valid whole quantity with its line and variant', () => {
    const cart = cartRuntime();
    const event = { target: input('2') };
    cart.validateQuantity(event);
    expect(cart.updateQuantity).toHaveBeenCalledWith('1', 2, event, 'updates[]', '123');
  });
  test('ignores changes from other inputs in the cart form', () => {
    const cart = cartRuntime();
    cart.validateQuantity = vi.fn();
    cart.onChange({ target: { matches: () => false } });
    expect(cart.validateQuantity).not.toHaveBeenCalled();
  });
});
