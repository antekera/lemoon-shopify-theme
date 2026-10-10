// Exercise Shopify endpoints with the browser's actual first-party session.
// APIRequestContext is handled differently by this storefront's edge protection.
export function storefrontRequest(page) {
  const request = async (path, method, options = {}) => {
    if (page.url() === 'about:blank') {
      await page.goto(process.env.STOREFRONT_URL || 'http://127.0.0.1:9292');
    }
    const response = await page.evaluate(async ({ path, method, data }) => {
      const url = new URL(path, location.origin);
      if (url.origin !== location.origin) throw new Error('Storefront requests must stay on the current origin');
      const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        ...(data === undefined ? {} : {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      });
      return {
        status: response.status,
        challenge: response.headers.get('cf-mitigated') === 'challenge',
        body: await response.text(),
      };
    }, { path, method, data: options.data });
    if (response.challenge) throw new Error(`Shopify requires browser verification for ${path} (HTTP ${response.status})`);
    return {
      ok: () => response.status >= 200 && response.status < 300,
      status: () => response.status,
      json: async () => JSON.parse(response.body),
    };
  };
  return { get: path => request(path, 'GET'), post: (path, options) => request(path, 'POST', options) };
}
