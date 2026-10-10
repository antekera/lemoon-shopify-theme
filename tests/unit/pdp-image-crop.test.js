import { expect, test } from 'vitest';
import { whiteCanvasBounds } from '../../assets/lemoon-pdp-tools.js';

const canvas = (background, subject) => {
  const pixels = new Uint8ClampedArray(100 * 100 * 4);
  for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) {
    const color = subject && x >= 20 && x < 80 && y >= 40 && y < 60 ? [20, 35, 45, 255] : background;
    pixels.set(color, (y * 100 + x) * 4);
  }
  return pixels;
};

test('finds frame bounds on a white canvas with padding around the whole frame', () => {
  expect(whiteCanvasBounds(canvas([255, 255, 255, 255], true), 100, 100)).toEqual({ x: .17, y: .37, width: .66, height: .26 });
});

test('retains full lifestyle images and avoids cropping an empty white canvas', () => {
  expect(whiteCanvasBounds(canvas([50, 90, 80, 255], true), 100, 100)).toBeNull();
  expect(whiteCanvasBounds(canvas([255, 255, 255, 255], false), 100, 100)).toBeNull();
});

test('supports transparent product photos without counting transparent pixels as the frame', () => {
  expect(whiteCanvasBounds(canvas([0, 0, 0, 0], true), 100, 100)?.width).toBe(.66);
});
