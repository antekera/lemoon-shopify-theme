const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const {collectionConfig} = require('../core.cjs');
const {selectRepresentativeReports} = require('../median.cjs');
const lab={mode:'lab',origin:'https://lab.myshopify.com',product:'frame',collection:'frames'};

test('pinned actual LHCI engine passes baseline, fails controlled performance/a11y regressions and uses median run', t => {
  const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'lhci-engine-'));
  t.after(() => fs.rmSync(cwd,{recursive:true,force:true}));
  fs.mkdirSync(path.join(cwd,'.lighthouseci'));
  const config=collectionConfig(lab,'123','/chrome');
  fs.writeFileSync(path.join(cwd,'lighthouserc.json'),JSON.stringify(config));
  function run(scores) {
    scores.forEach(([performance,accessibility],i) => fs.writeFileSync(path.join(cwd,`.lighthouseci/lhr-${i}.json`),JSON.stringify({requestedUrl:lab.origin,finalUrl:lab.origin,lighthouseVersion:'11.4.0',categories:{performance:{id:'performance',score:performance},accessibility:{id:'accessibility',score:accessibility}},audits:{'first-contentful-paint':{numericValue:1000+i*100},interactive:{numericValue:2000+i*100}}})));
    const assertionDir=path.join(cwd,'assert');fs.rmSync(assertionDir,{recursive:true,force:true});
    assert.deepEqual(selectRepresentativeReports(path.join(cwd,'.lighthouseci'),assertionDir),['lhr-1.json']);
    return spawnSync(process.execPath,[require.resolve('@lhci/cli/src/cli.js'),'assert',`--config=${path.join(cwd,'lighthouserc.json')}`],{cwd:assertionDir,encoding:'utf8'});
  }
  assert.equal(require('@lhci/cli/package.json').version,'0.13.0');assert.equal(require('lighthouse/package.json').version,'11.4.0');
  for (const [scores,code] of [[[[0.7,0.9],[0.6,0.8],[0.5,0.7]],0],[[[0.9,0.9],[0.59,0.9],[0.9,0.9]],1],[[[0.9,0.9],[0.9,0.79],[0.9,0.9]],1]]) {
    const result=run(scores);assert.equal(result.status,code,result.stderr);
    const assertions=JSON.parse(fs.readFileSync(path.join(cwd,'assert/.lighthouseci/assertion-results.json')));
    assert.equal(assertions.length,2);assert.equal(assertions.find(a => a.auditProperty === 'performance').actual,scores[1][0]);assert.equal(assertions.find(a => a.auditProperty === 'accessibility').actual,scores[1][1]);
  }
});
test('Lighthouse 11.4.0 resolves the custom scored-page identity gatherer/audit and preserves performance/a11y', async () => {
  const {initializeConfig}=await import('lighthouse/core/config/config.js');
  const config=require('../lighthouse.config.cjs');
  const {resolvedConfig}=await initializeConfig('navigation',config,{onlyCategories:['performance','accessibility','readiness']});
  for (const category of ['performance','accessibility','readiness']) assert.ok(resolvedConfig.categories[category]);
  assert.ok(resolvedConfig.artifacts.some(a => a.id === 'LemoonTheme'));
  assert.ok(resolvedConfig.audits.some(a => a.implementation.meta.id === 'lemoon-theme-identity'));
  assert.ok(resolvedConfig.audits.some(a => a.implementation.meta.id === 'http-status-code'));
});
test('scored-page identity audit fails wrong theme, password and redirected route', async t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lhci-identity-'));
  const previous=process.env.LHCI_AUTH_CONTEXT;
  t.after(() => {if (previous === undefined) delete process.env.LHCI_AUTH_CONTEXT;else process.env.LHCI_AUTH_CONTEXT=previous;fs.rmSync(dir,{recursive:true,force:true});});
  process.env.LHCI_AUTH_CONTEXT=path.join(dir,'auth.json');
  fs.writeFileSync(process.env.LHCI_AUTH_CONTEXT,JSON.stringify({mode:'lab',id:'123',urls:[lab.origin+'/']}));
  const {default:Audit}=await import('../theme-audit.mjs');
  const good={id:'123',role:'unpublished',url:lab.origin+'/',passwordForm:false};
  assert.equal(Audit.audit({LemoonTheme:good}).score,1);
  for (const change of [{id:'456'},{role:'main'},{passwordForm:true},{url:lab.origin+'/password'},{url:'https://different.test/'}]) assert.equal(Audit.audit({LemoonTheme:{...good,...change}}).score,0);
});

test('image verification accepts metadata/recompression and rejects changed pixels', () => {
  const {PNG}=require('pngjs');
  const {verifyImage,manifest,fixtureDir}=require('../fixture.cjs');
  const expected=manifest.products[0].image;
  const bytes=fs.readFileSync(path.join(fixtureDir,expected.file));
  verifyImage(bytes,expected);
  const decoded=PNG.sync.read(bytes);
  const recompressed=PNG.sync.write(decoded,{deflateLevel:1});
  assert.notDeepEqual(recompressed,bytes);verifyImage(recompressed,expected);
  decoded.data[0] ^= 1;
  assert.throws(() => verifyImage(PNG.sync.write(decoded),expected),/pixels mismatch/);
});

test('median selector supports Lighthouse 11 missing interactive but rejects missing FCP', t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lhci-fcp-'));
  t.after(() => fs.rmSync(dir,{recursive:true,force:true}));
  const raw=path.join(dir,'raw');fs.mkdirSync(raw);
  for (let i=0;i<3;i++) fs.writeFileSync(path.join(raw,`lhr-${i}.json`),JSON.stringify({finalUrl:lab.origin,audits:{'first-contentful-paint':{numericValue:1000+i*100}}}));
  assert.deepEqual(selectRepresentativeReports(raw,path.join(dir,'assert')),['lhr-1.json']);
  fs.writeFileSync(path.join(raw,'lhr-0.json'),JSON.stringify({finalUrl:lab.origin,audits:{}}));
  assert.throws(() => selectRepresentativeReports(raw,path.join(dir,'bad')),/finite first-contentful-paint/);
});

test('scored-page gatherer supplies the required Lighthouse 11 evaluation argument array', async () => {
  const {default:Gatherer}=await import('../theme-gatherer.mjs');
  const expected={id:'123',role:'unpublished',url:lab.origin,passwordForm:false};
  const result=await new Gatherer().getArtifact({driver:{executionContext:{evaluate:async (fn,options) => {
    assert.ok(Array.isArray(options.args));assert.equal(options.useIsolation,false);return expected;
  }}}});
  assert.deepEqual(result,expected);
});
