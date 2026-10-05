import { readdir, readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const themePath = (path) => new URL(`../../${path}`, import.meta.url);

test('homepage section types resolve to Liquid files in sections', async () => {
  const homepage = JSON.parse(await readFile(themePath('templates/index.json'), 'utf8'));
  const sectionFiles = await readdir(themePath('sections'));

  for (const [sectionId, section] of Object.entries(homepage.sections)) {
    expect(sectionFiles, `Section "${sectionId}" requires sections/${section.type}.liquid`).toContain(
      `${section.type}.liquid`,
    );
  }
});
