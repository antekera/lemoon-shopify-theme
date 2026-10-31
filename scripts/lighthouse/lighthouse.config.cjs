const path = require('node:path');
module.exports = {
  extends: 'lighthouse:default',
  artifacts: [{id:'LemoonTheme', gatherer:path.join(__dirname,'theme-gatherer.mjs')}],
  audits: [path.join(__dirname,'theme-audit.mjs')],
  categories: {
    readiness: {title:'Storefront identity', description:'Checks the page measured by Lighthouse.', auditRefs:[
      {id:'lemoon-theme-identity',weight:1}, {id:'http-status-code',weight:0}
    ]}
  }
};
