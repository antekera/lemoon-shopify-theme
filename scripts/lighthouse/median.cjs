const fs = require('node:fs');
const path = require('node:path');
// LHCI 0.13.0 category assertions accidentally aggregate all runs even for median-run.
// Select the engine's representative run first so category scores use that exact run.
function selectRepresentativeReports(rawDir, assertionDir) {
  const {computeRepresentativeRuns} = require('@lhci/utils/src/representative-runs.js');
  const groups = new Map();
  for (const name of fs.readdirSync(rawDir).sort().filter(n => /^lhr-\d+\.json$/.test(n))) {
    const lhr = JSON.parse(fs.readFileSync(path.join(rawDir,name)));
    // Lighthouse 11 removed the interactive audit; the pinned selector treats it as zero.
    // Require finite FCP so missing measurement cannot make an arbitrary first run win.
    if (!Number.isFinite(lhr.audits?.['first-contentful-paint']?.numericValue)) throw Error('Median selection requires finite first-contentful-paint');
    if (!groups.has(lhr.finalUrl)) groups.set(lhr.finalUrl,[]);
    groups.get(lhr.finalUrl).push([name,lhr]);
  }
  if (!groups.size || [...groups.values()].some(g => g.length !== 3)) throw Error('Median selection requires exactly three reports per route');
  const selected = computeRepresentativeRuns([...groups.values()]);
  const target = path.join(assertionDir,'.lighthouseci');
  fs.mkdirSync(target,{recursive:true});
  for (const name of selected) fs.copyFileSync(path.join(rawDir,name),path.join(target,name));
  return selected;
}
module.exports = {selectRepresentativeReports};
