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

test('accepts prescription values at the supported limits and increments', () => {
  expect(validatePrescription({
    od_sph: '-20', oi_sph: '10',
    od_cyl: '-6', od_axis: '0', oi_cyl: '6', oi_axis: '180',
    od_add: '0.25', oi_add: '4', pd: '40',
  }, true)).toEqual([]);
});

test.each([
  ['sphere below its minimum', { od_sph: '-20.25', oi_sph: '0', pd: '62' }, false, ['od_sph']],
  ['sphere above its maximum', { od_sph: '10.25', oi_sph: '0', pd: '62' }, false, ['od_sph']],
  ['cylinder outside its range', { od_sph: '0', oi_sph: '0', pd: '62', od_cyl: '6.25' }, false, ['od_cyl', 'od_axis']],
  ['axis outside its range', { od_sph: '0', oi_sph: '0', pd: '62', od_cyl: '-1', od_axis: '181' }, false, ['od_axis']],
  ['pupillary distance off its half millimeter increment', { od_sph: '0', oi_sph: '0', pd: '62.25' }, false, ['pd']],
  ['addition below its minimum', { od_sph: '0', oi_sph: '0', pd: '62', od_add: '0' }, true, ['od_add', 'oi_add']],
])('rejects %s', (_description, values, progressive, expectedErrors) => {
  expect(validatePrescription(values, progressive)).toEqual(expectedErrors);
});

test('requires axis for a non-zero cylinder and cylinder when an axis is entered', () => {
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62', od_cyl: '-0.25' }, false)).toEqual(['od_axis']);
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62', od_axis: '90' }, false)).toEqual(['od_cyl']);
  expect(validatePrescription({ od_sph: '0', oi_sph: '0', pd: '62', od_cyl: '0' }, false)).toEqual([]);
});

test('only validates ADD values for progressive prescriptions', () => {
  const values = { od_sph: '0', oi_sph: '0', pd: '62', od_add: '9', oi_add: 'invalid' };
  expect(validatePrescription(values, false)).toEqual([]);
  expect(validatePrescription(values, true)).toEqual(['od_add', 'oi_add']);
});
