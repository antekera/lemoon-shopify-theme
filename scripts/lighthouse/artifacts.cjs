'use strict';
const fs = require('node:fs');
const path = require('node:path');
function sanitize(value, secrets = []) {
  if (typeof value === 'string') {
    for (const secret of secrets.filter(Boolean).sort((a,b) => b.length - a.length)) {
      for (const encoded of new Set([secret,encodeURIComponent(secret),new URLSearchParams({v:secret}).toString().slice(2),
        JSON.stringify(secret).slice(1,-1),Buffer.from(secret).toString('base64'),Buffer.from(secret).toString('base64url')])) {
        value = value.split(encoded).join('[REDACTED]');
      }
    }
    return value.replace(/https?:\/\/[^\s"<>]+/g, raw => {
      try {const u = new URL(raw); u.username = ''; u.password = ''; u.search = ''; u.hash = ''; return u.href;} catch {return '[URL]';}
    });
  }
  if (Array.isArray(value)) return value.map(v => sanitize(v,secrets));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !/cookie|header|authorization|token|password|secret|snippet|source|sample/i.test(key))
    .map(([key,v]) => [sanitize(key,secrets),sanitize(v,secrets)]));
  return value;
}
function minimizedLhr(data) {
  // Keep machine-readable scores/metrics and category audit references. Drop arbitrary page
  // text, DOM, network tables, debug data and config entirely; these can contain credentials.
  const audits = Object.fromEntries(Object.entries(data.audits || {}).map(([id,a]) => [id,{
    id, score:typeof a.score === 'number' ? a.score : null,
    ...(Number.isFinite(a.numericValue) ? {numericValue:a.numericValue} : {})
  }]));
  const categories = Object.fromEntries(Object.entries(data.categories || {}).map(([id,c]) => [id,{
    id, score:typeof c.score === 'number' ? c.score : null,
    auditRefs:(c.auditRefs || []).map(r => ({id:r.id,weight:r.weight}))
  }]));
  return {lighthouseVersion:data.lighthouseVersion, requestedUrl:data.requestedUrl,
    finalUrl:data.finalUrl,finalDisplayedUrl:data.finalDisplayedUrl,fetchTime:data.fetchTime,
    audits,categories, sanitized:true};
}
function exportArtifacts(rawDir, output, secrets) {
  fs.mkdirSync(output, {recursive:true});
  for (const name of fs.existsSync(rawDir) ? fs.readdirSync(rawDir).sort() : []) {
    if (!/^lhr-\d+\.json$/.test(name) && name !== 'assertion-results.json') continue;
    const file = path.join(rawDir,name);
    if (!fs.lstatSync(file).isFile()) throw Error('Refusing artifact symlink');
    const data = JSON.parse(fs.readFileSync(file,'utf8'));
    const allowed = name.startsWith('lhr-') ? minimizedLhr(data) : data.map(a => Object.fromEntries(
      ['name','auditId','auditProperty','values','level','url','actual','expected','operator','passed','aggregationMethod'].filter(k => k in a).map(k => [k,a[k]])));
    fs.writeFileSync(path.join(output,name),JSON.stringify(sanitize(allowed,secrets),null,2));
  }
}
module.exports = {sanitize,exportArtifacts,minimizedLhr};
