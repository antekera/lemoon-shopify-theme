import { describe, it, expect } from 'vitest';
import { suggestPresence } from '../../assets/lemoon-style-quiz.js';

// Legacy embedded-ranking coverage was removed with the candidate dataset.
describe('optional measurement-based visual proportion suggestion', () => {
  it.each([
    [48, 18, 'compact'], [49, 19, 'compact'], [49, 20, 'medium'],
    [50, 18, 'medium'], [54, 20, 'medium'], [55, 19, 'oversize'], [58, 18, 'oversize'],
  ])('suggests a visual proportion for %s / %s mm', (lens_width, bridge, expected) => {
    expect(suggestPresence({ lens_width, bridge, temple: 140 })).toBe(expected);
  });

  it('requires three valid measurements and does not treat temple length as frontal width', () => {
    expect(suggestPresence({ lens_width: ' 50 ', bridge: '18', temple: '140' })).toBe('medium');
    for (const temple of [100, 140, 180]) expect(suggestPresence({ lens_width: 50, bridge: 18, temple })).toBe('medium');
    for (const missing of ['lens_width', 'bridge', 'temple']) {
      const measures = { lens_width: 50, bridge: 18, temple: 140 };
      delete measures[missing];
      expect(suggestPresence(measures)).toBeNull();
    }
    expect(suggestPresence()).toBeNull();
    expect(suggestPresence(null)).toBeNull();
  });

  it('does not classify malformed, fractional or out-of-range references', () => {
    for (const lens_width of ['', 'abc', '5e1', '50.5', -50, 0, 29, 81, Infinity]) {
      expect(suggestPresence({ lens_width, bridge: 18, temple: 140 })).toBeNull();
    }
    for (const bridge of [9, 36]) expect(suggestPresence({ lens_width: 50, bridge, temple: 140 })).toBeNull();
    for (const temple of [99, 181]) expect(suggestPresence({ lens_width: 50, bridge: 18, temple })).toBeNull();
  });
});
