import { describe, expect, test } from 'vitest';

const logic = () => import('../../assets/lemoon-mobile-nav-logic.js');

describe('mobile menu control', () => {
  test.each([
    ['closed', 'open'],
    ['root', 'close'],
    ['sub', 'back'],
  ])('requests %s state action correctly', async (level, action) => {
    const { getToggleAction } = await logic();
    expect(getToggleAction(level)).toBe(action);
  });

  test('ignores an unknown menu state', async () => {
    const { getToggleAction } = await logic();
    expect(getToggleAction('unknown')).toBeNull();
  });
});
