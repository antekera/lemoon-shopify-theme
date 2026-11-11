import { renderComponentFixture, renderComponentSection, searchFixtureOptions } from './component-library-renderer.mjs';
const shell = renderComponentFixture('controls', { themeBoxSizing: true });
const search = renderComponentSection('main-search', searchFixtureOptions());
process.stdout.write(shell.replace(/<body>[\s\S]*?<script>/, `<body>${search}<script>`));
