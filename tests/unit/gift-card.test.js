import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, test, vi } from 'vitest';

function card(clipboard) {
  const listeners = {};
  const copy = { hidden: true, disabled: false, addEventListener: (event, handler) => { listeners[event] = handler; } };
  const status = { textContent: '', dataset: {}, appendChild() {} };
  const code = { textContent: 'A1B2 3C4D 5E6F 7G8H', innerText: 'A1B2 3C4D 5E6F 7G8H' };
  const root = {
    dataset: { copySuccess: 'Copiado', copyError: 'Selecciona el código para copiarlo' },
    querySelector: (selector) => ({ '.gift-card__copy-button': copy, '.gift-card__copy-success': status, '#gift-card-code': code }[selector] || null),
  };
  const document = {
    readyState: 'complete',
    querySelector: (selector) => selector === '.gift-card' ? root : root.querySelector(selector),
    getElementById: () => code,
    getElementsByTagName: () => [{ content: { cloneNode: () => ({}) } }],
    addEventListener() {},
  };
  const file = 'assets/lemoon-gift-card.js';
  const script = readFileSync(file, 'utf8');
  runInNewContext(script, { document, navigator: { clipboard }, window: {}, setTimeout, clearTimeout });
  return { copy, status, click: () => listeners.click() };
}

test('a browser without clipboard access explains how to copy manually', async () => {
  const view = card(undefined);
  await expect(Promise.resolve().then(view.click)).resolves.toBeUndefined();
  expect(view.status.textContent).toBe('Selecciona el código para copiarlo');
  expect(view.copy.disabled).toBe(false);
});

test('copying uses the complete code without formatting spaces', async () => {
  const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
  const view = card(clipboard);
  await view.click();
  expect(clipboard.writeText).toHaveBeenCalledWith('A1B23C4D5E6F7G8H');
  expect(view.status.textContent).toBe('Copiado');
});
test('denied clipboard permission never reports success and permits a retry', async () => {
  const clipboard = { writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) };
  const view = card(clipboard);
  await view.click();
  expect(view.status.textContent).toBe('Selecciona el código para copiarlo');
  expect(view.copy.disabled).toBe(false);
  clipboard.writeText.mockResolvedValue(undefined);
  await view.click();
  expect(view.status.textContent).toBe('Copiado');
  expect(view.status.dataset.state).toBe('success');
});
test('a pending copy does not allow duplicate writes or announce success early', async () => {
  let finish;
  const clipboard = { writeText: vi.fn(() => new Promise(resolve => { finish = resolve; })) };
  const view = card(clipboard);
  const pending = view.click();
  expect(view.copy.disabled).toBe(true);
  expect(view.status.textContent).toBe('');
  await view.click();
  expect(clipboard.writeText).toHaveBeenCalledTimes(1);
  finish(); await pending;
  expect(view.copy.disabled).toBe(false);
  expect(view.status.textContent).toBe('Copiado');
});
