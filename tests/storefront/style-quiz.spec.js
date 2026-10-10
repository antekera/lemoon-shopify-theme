import { test, expect } from '@playwright/test';
const route = '/pages/buscar-mi-estilo?view=buscar-mi-estilo';
async function openQuiz(page) {
  const response = await page.goto(route);
  expect(response.status()).toBe(200);
  await expect(page).not.toHaveURL(/\/password/);
  const quiz = page.locator('[data-style-quiz]');
  await expect(quiz).toBeVisible();
  await expect(quiz.locator('[data-quiz-form]')).toBeVisible();
  return quiz;
}
async function choose(quiz,step,value) {
  await quiz.locator(`[data-step="${step}"] input[value="${value}"]`).check();
  await quiz.locator('[data-quiz-next]').click();
}
test('quiz validates, retains answers on back, reveals real available frames and resets', async ({page}) => {
  const quiz = await openQuiz(page);
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await quiz.locator('[data-quiz-next]').click();
  await expect(quiz.locator('[data-quiz-error]')).toBeVisible();
  const errorId = await quiz.locator('[data-quiz-error]').getAttribute('id');
  await expect(quiz.locator('[data-step="face"]')).toHaveAttribute('aria-describedby',errorId);
  await expect(quiz.locator('[data-step="face"]')).toHaveAttribute('aria-invalid','true');
  await expect(quiz.locator('[data-step="face"] input').first()).toBeFocused();
  await choose(quiz,'face','round');
  await expect(quiz.locator('[data-step="style"] legend')).toBeFocused();
  await expect(quiz.locator('[data-step="face"]')).not.toHaveAttribute('aria-invalid');
  await quiz.locator('[data-quiz-back]').click();
  await expect(quiz.locator('[data-step="face"] input[value="round"]')).toBeChecked();
  await quiz.locator('[data-quiz-next]').click();
  await choose(quiz,'style','minimal');
  await choose(quiz,'use','work');
  await choose(quiz,'budget','none');
  const results = quiz.locator('[data-quiz-results]');
  await expect(results).toBeVisible();
  await expect(results.locator('h2')).toBeFocused();
  const cards = results.locator('[data-quiz-product]:visible');
  expect(await cards.count()).toBeGreaterThanOrEqual(2);
  expect(await cards.count()).toBeLessThanOrEqual(3);
  const ids = await cards.evaluateAll(nodes => nodes.map(node=>node.dataset.id));
  expect(new Set(ids).size).toBe(ids.length);
  const rankedHandles = await cards.locator('a').evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname));
  expect(rankedHandles).toEqual(['/products/lemoon-estero','/products/lemoon-artico','/products/lemoon-genova']);
  const href = await cards.first().locator('a').getAttribute('href');
  expect(href).toMatch(/\/products\/[^?]+\?variant=\d+/);
  await expect(cards.first().locator('h3')).not.toBeEmpty();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await quiz.locator('[data-quiz-restart]').click();
  await expect(quiz.locator('[data-step="face"]')).toBeVisible();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
  await expect(results).toBeHidden();
  await page.goto(href);
  await expect(page.locator('#MainContent h1').first()).toBeVisible();
  await expect(page).toHaveURL(/\/products\//);
});
test('budget link uses the actual collection price parameter and preserves its cap', async ({page}) => {
  const quiz = await openQuiz(page);
  await expect(quiz).toHaveAttribute('data-price-parameter','filter.v.price.lte');
  await choose(quiz,'face','unsure');
  await choose(quiz,'style','minimal');
  await choose(quiz,'use','work');
  const budget = quiz.locator('[data-step="budget"] input').first();
  const cents = Number(await budget.getAttribute('value'));
  expect(Number.isFinite(cents)).toBe(true);
  await budget.check(); await quiz.locator('[data-quiz-next]').click();
  const cards = quiz.locator('[data-quiz-product]:visible');
  for (const price of await cards.evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.price)))) expect(price).toBeLessThanOrEqual(cents);
  const href = await quiz.locator('[data-quiz-catalogue]').getAttribute('href');
  const parameter = await quiz.getAttribute('data-price-parameter');
  expect(parameter).toBe('filter.v.price.lte');
  expect(new URL(href,'https://lemoon.cl').searchParams.get(parameter)).toBe(String(cents/100));
  await quiz.locator('[data-quiz-catalogue]').click();
  await expect(page).toHaveURL(/\/collections\/opticos\?/);
  await expect(page.locator('#MainContent h1')).toBeVisible();
});
test('without JavaScript visitors can browse the real editorial selection and catalogue', async ({browser,baseURL,viewport,storageState}) => {
  const context = await browser.newContext({ javaScriptEnabled:false, baseURL, viewport, storageState });
  const page = await context.newPage();
  try {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    const quiz = page.locator('[data-style-quiz]');
    await expect(quiz).toBeVisible();
    await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
    await expect(quiz.locator('noscript')).toBeVisible();
    expect(await quiz.locator('[data-quiz-product]').count()).toBeGreaterThan(0);
    await expect(quiz.locator('[data-quiz-restart]')).toBeHidden();
    await quiz.locator('[data-quiz-catalogue]').click();
    await expect(page).toHaveURL(/\/collections\/opticos$/);
  } finally { await context.close(); }
});
