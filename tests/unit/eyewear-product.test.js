import { expect, test } from 'vitest';
import { findEyewearVariant, validatePrescription } from '../../assets/lemoon-eyewear-product.js';

test('charges the exact combination and does not substitute an unavailable combination', () => {
  const variants = [{ id: 1, options: ['Carey', 'Solo armazón', 'Estándar 1.50'], available: true }, { id: 2, options: ['Carey', 'Monofocal', 'Delgado 1.67'], available: false }];
  expect(findEyewearVariant(variants, ['Carey', 'Monofocal', 'Delgado 1.67'])?.id).toBe(2);
  expect(findEyewearVariant(variants, ['Carey', 'Solar', 'Delgado 1.67'])).toBeUndefined();
});

test('manual prescription needs both eyes and pupillary distance', () => {
  expect(validatePrescription({ od_sph: '', oi_sph: '', pd: '' }, false)).toContain('od_sph');
  expect(validatePrescription({ od_sph: '0', oi_sph: '-1.25', pd: '62' }, false)).toEqual([]);
});

test('rejects incomplete cylinder/axis pairs and non-quarter prescription values', () => {
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62', od_cyl: '-0.50' }, false)).toContain('od_axis');
  expect(validatePrescription({ od_sph: '0.13', oi_sph: '0', pd: '62' }, false)).toContain('od_sph');
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62', od_cyl: '-0.50', od_axis: '90' }, false)).toEqual([]);
});

test('progressive lenses require addition for both eyes', () => {
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62' }, true)).toContain('od_add');
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62', od_add: '1.50', oi_add: '1.50' }, true)).toEqual([]);
});
