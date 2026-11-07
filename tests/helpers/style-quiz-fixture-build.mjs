import { renderQuizFixture } from './style-quiz-renderer.mjs';

// Run outside Playwright's CommonJS transform so the repository's existing
// Liquid renderer keeps its native import.meta URL semantics.
const scenario = process.argv[2] || 'default';
if (!['default', 'empty', 'unsafe', 'malformed', 'paginated', 'categories', 'colors', 'missing-media'].includes(scenario)) throw new Error('Unknown quiz fixture scenario');
process.stdout.write(renderQuizFixture(scenario));
