import BaseGatherer from 'lighthouse/core/gather/base-gatherer.js';

// Runs after sensitive performance instrumentation has stopped, on the scored page.
export default class LemoonTheme extends BaseGatherer {
  meta = {supportedModes: ['navigation']};
  getArtifact({driver}) {
    return driver.executionContext.evaluate(() => ({
      id: String(window.Shopify?.theme?.id || ''),
      role: window.Shopify?.theme?.role || '',
      url: window.location.href,
      passwordForm: !!document.querySelector('form[action*="password"] input[type="password"]'),
    }), {args:[],useIsolation:false});
  }
}
