import fs from 'node:fs';
import {Audit} from 'lighthouse/core/audits/audit.js';

export default class ThemeIdentity extends Audit {
  static get meta() {
    return {id:'lemoon-theme-identity', title:'Expected Shopify theme and route were measured',
      failureTitle:'Unexpected Shopify theme or route was measured', description:'Verifies the scored navigation, including password exclusion.',
      requiredArtifacts:['LemoonTheme']};
  }
  static audit({LemoonTheme: actual}) {
    const expected = JSON.parse(fs.readFileSync(process.env.LHCI_AUTH_CONTEXT, 'utf8'));
    const url = new URL(actual.url);
    const route = expected.urls.some(raw => {const u = new URL(raw); return u.origin === url.origin && u.pathname === url.pathname;});
    const theme = expected.mode === 'commercial' ? actual.role === 'main' && /^\d+$/.test(actual.id) : actual.id === String(expected.id) && actual.role === 'unpublished';
    return {score: Number(route && theme && !actual.passwordForm), numericValue:Number(actual.id) || 0, numericUnit:'unitless'};
  }
}
