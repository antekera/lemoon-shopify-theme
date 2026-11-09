import { readFileSync } from 'node:fs';
// Reuse the theme's exact font loading markup; fixtures do not package new fonts.
const layout = readFileSync(new URL('../../layout/theme.liquid', import.meta.url), 'utf8');
export const themeFontLinks = layout.match(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]+>/)?.[0] || '';
