'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {execFile} = require('node:child_process');
const {randomUUID} = require('node:crypto');
const {config, routes, collectionConfig, ownedThemes, stageTheme, hash} = require('./core.cjs');
const {exportArtifacts} = require('./artifacts.cjs');
const {selectRepresentativeReports} = require('./median.cjs');
const {verifyRemoteFixture, fixtureDir, manifest} = require('./fixture.cjs');

const BIN = name => path.join(__dirname, 'node_modules/.bin', name);
const stateDir = process.env.HARNESS_STATE || '/state';
const outputDir = process.env.HARNESS_OUTPUT || '/reports';
const workDir = path.join(stateDir, 'work');
const stateFile = path.join(stateDir, 'theme.json');
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2), {mode:0o600});
let currentChild;
let interrupted = false;
function command(file, args, options = {}) {
  if (interrupted && !options.cleanup) return Promise.reject(Error('Audit interrupted'));
  return new Promise((resolve, reject) => {
    const child = execFile(file, args, {cwd: options.cwd || workDir, env: process.env, timeout: options.timeout || 600000,
      maxBuffer: 32 * 1024 * 1024}, (error, stdout) => {
      if (currentChild === child) currentChild = undefined;
      if (error) reject(Error(`Command failed: ${path.basename(file)} ${args[0]} (output withheld; may contain credentials)`));
      else resolve(stdout.trim());
    });
    currentChild = child;
  });
}
async function token(c) {
  if (c.token) return c.token;
  const response = await fetch(`${c.origin}/admin/oauth/access_token`, {method:'POST', redirect:'error',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'client_credentials',client_id:c.clientId,client_secret:c.clientSecret}),
    signal:AbortSignal.timeout(60000)});
  if (!response.ok) throw Error('Lab client-credentials authentication failed');
  const json = await response.json();
  if (!json.access_token || typeof json.access_token !== 'string') throw Error('Access token absent');
  // GitHub logs are masked too, though command output is never printed.
  if (process.env.GITHUB_ACTIONS) console.log(`::add-mask::${json.access_token}`);
  return json.access_token;
}
async function graphql(c, query, variables) {
  const response = await fetch(`${c.origin}/admin/api/2026-10/graphql.json`, {method:'POST', redirect:'error',
    headers:{'Content-Type':'application/json','X-Shopify-Access-Token':process.env.SHOPIFY_CLI_THEME_TOKEN},
    body:JSON.stringify({query,variables}), signal:AbortSignal.timeout(60000)});
  if (!response.ok) throw Error('Fixture API request failed');
  const json = await response.json();
  if (json.errors || !json.data) throw Error('Fixture API returned errors');
  return json.data;
}
async function list(c, execute = command) {
  const result = JSON.parse(await execute(BIN('shopify'), ['theme','list','--store',c.store,'--json'], {cleanup:true}));
  if (!Array.isArray(result)) throw Error('Unexpected Shopify theme list response');
  return result;
}
async function cleanup(c, execute = command) {
  if (!fs.existsSync(stateFile)) return;
  const state = JSON.parse(fs.readFileSync(stateFile));
  if (state.store !== c.store) throw Error('Cleanup store identity mismatch');
  write(path.join(outputDir,'cleanup.json'),{...state,confirmed:false,temporaryTheme:true});
  const targets = ownedThemes(await list(c,execute), state);
  for (const t of targets) await execute(BIN('shopify'), ['theme','delete','--store',c.store,'--theme',String(t.id),'--force'], {cleanup:true,timeout:120000});
  if (ownedThemes(await list(c,execute), state).length) throw Error('Temporary theme deletion not confirmed');
  fs.unlinkSync(stateFile);
  write(path.join(outputDir,'cleanup.json'),{...state,confirmed:true,temporaryTheme:true});
}
// Always attempt cleanup and export, preserving failure of any phase (including cleanup).
async function lifecycle(steps) {
  let failure;
  const result = {auditPassed:false, cleanupPassed:false};
  try {await steps.audit(); result.auditPassed = true;} catch (error) {failure = error;}
  try {await steps.cleanup(); result.cleanupPassed = true;} catch (error) {failure = failure ? new AggregateError([failure,error], 'Audit and cleanup failed') : error;}
  try {await steps.export(result);} catch (error) {failure = failure ? new AggregateError([failure,error], 'Audit or cleanup and export failed') : error;}
  if (failure) throw failure;
}
async function verifyReports(rawDir, c, id) {
  const names = fs.readdirSync(rawDir).filter(n => /^lhr-\d+\.json$/.test(n));
  const expected = routes(c,id), counts = new Map(expected.map(u => [u,0]));
  for (const name of names) {
    const r = JSON.parse(fs.readFileSync(path.join(rawDir,name)));
    if (['performance','accessibility'].some(k => !Number.isFinite(r.categories?.[k]?.score) || r.categories[k].score < 0 || r.categories[k].score > 1)) throw Error('Missing or invalid category score on a measured run');
    if (r.lighthouseVersion !== '11.4.0' || r.runtimeError || !counts.has(r.requestedUrl)) throw Error('Invalid Lighthouse report/version/route');
    const want = new URL(r.requestedUrl), got = new URL(r.finalDisplayedUrl || r.finalUrl);
    if (got.origin !== want.origin || got.pathname !== want.pathname || r.audits['http-status-code']?.score !== 1 || r.audits['lemoon-theme-identity']?.score !== 1) throw Error('Lighthouse measured an unexpected route or HTTP error');
    counts.set(r.requestedUrl, counts.get(r.requestedUrl)+1);
  }
  if ([...counts.values()].some(n => n !== 3)) throw Error('Expected exactly three measured runs per route');
}
async function main() {
  fs.mkdirSync(workDir, {recursive:true}); fs.mkdirSync(outputDir, {recursive:true});
  const c = config(process.env);
  if (c.mode === 'lab') process.env.SHOPIFY_CLI_THEME_TOKEN = await token(c);
  process.env.SHOPIFY_FLAG_STORE = c.store;
  if (process.argv.includes('--cleanup')) {if (c.mode === 'lab') await cleanup(c); return;}
  if (fs.existsSync(stateFile)) throw Error('Unfinished cleanup record exists; run --cleanup before a new audit');
  const chrome = require('playwright').chromium.executablePath();
  const versions = {
    node:process.version, platform:process.platform, arch:process.arch,
    image:'mcr.microsoft.com/playwright:v1.63.0-noble@sha256:bc6ab0d6d44ff4826e4cb8c1e6d801e185bfc42bb0753f8e2a30efc70db054c7',
    browser:await command(chrome,['--version']),
    lhci:require('@lhci/cli/package.json').version, lighthouse:require('lighthouse/package.json').version,
    shopify:require('@shopify/cli/package.json').version, puppeteer:require('puppeteer/package.json').version,
    lockSha256:hash(fs.readFileSync(path.join(__dirname,'package-lock.json'))),
    sha:process.env.GITHUB_SHA || 'local', harnessSha:process.env.HARNESS_SHA || 'local', fixture:c.mode === 'lab' ? manifest : null, mode:c.mode
  };
  write(path.join(outputDir,'versions.json'),versions);
  if (versions.lighthouse !== '11.4.0' || versions.lhci !== '0.13.0' || versions.shopify !== '4.8.5' || !versions.browser.includes('153.0.8010.12')) throw Error('Pinned runtime version mismatch');
  let phase = 'fixture';
  const rawDir = path.join(workDir,'.lighthouseci');
  await lifecycle({
    audit:async () => {
      let id;
      if (c.mode === 'lab') {
        await verifyRemoteFixture(c, (q,v) => graphql(c,q,v));
        phase = 'upload';
        const themeDir = path.join(workDir,'theme');
        stageTheme('/theme',themeDir,path.join(fixtureDir,'settings.json'));
        const state = {store:c.store, name:`lemoon-lhci-${randomUUID()}`};
        if ((await list(c)).some(t => t.name === state.name)) throw Error('Theme name collision');
        write(stateFile,state); // Written BEFORE upload; survives partial push and workflow cancellation.
        write(path.join(outputDir,'cleanup.json'),{...state,confirmed:false,temporaryTheme:true});
        const push = JSON.parse(await command(BIN('shopify'), ['theme','push','--store',c.store,
          '--unpublished','--theme',state.name,'--path',themeDir,'--json']));
        const created = ownedThemes(await list(c),state);
        if (created.length !== 1) throw Error('Temporary theme creation not confirmed');
        state.id = String(created[0].id); write(stateFile,state);
        if (String(push.theme?.id) !== state.id || push.theme?.role !== 'unpublished' || push.errors?.length) throw Error('Theme push result mismatch');
        id = state.id;
      }
      phase = 'collect';
      const authPath = path.join(stateDir,'auth.json');
      write(authPath,{urls:routes(c,id),password:c.password,id,mode:c.mode});
      process.env.LHCI_AUTH_CONTEXT = authPath;
      const configFile = path.join(workDir,'lighthouserc.json');
      write(configFile,collectionConfig(c,id,chrome,path.relative(workDir,path.join(__dirname,'auth.cjs'))));
      await command(BIN('lhci'), ['collect',`--config=${configFile}`], {timeout:1200000});
      phase = 'reports';
      await verifyReports(rawDir,c,id);
      phase = 'assert';
      const assertionDir = path.join(workDir,'assert');
      versions.selectedMedianReports = selectRepresentativeReports(rawDir,assertionDir);
      write(path.join(outputDir,'versions.json'),versions);
      try {await command(BIN('lhci'), ['assert',`--config=${configFile}`], {cwd:assertionDir});}
      finally {
        const assertions = path.join(assertionDir,'.lighthouseci/assertion-results.json');
        if (fs.existsSync(assertions)) fs.copyFileSync(assertions,path.join(rawDir,'assertion-results.json'));
      }
      phase = 'passed';
    },
    cleanup: async () => {
      if (c.mode === 'lab') await cleanup(c);
      if (!fs.existsSync(path.join(outputDir,'cleanup.json'))) write(path.join(outputDir,'cleanup.json'),{confirmed:true,temporaryTheme:false});
    },
    export: async result => {
      exportArtifacts(rawDir,outputDir,[c.password,c.clientSecret,c.token,process.env.SHOPIFY_CLI_THEME_TOKEN]);
      write(path.join(outputDir,'status.json'),{phase, ...result, passed:result.auditPassed && result.cleanupPassed && !interrupted});
    }
  });
  if (interrupted) throw Error('Audit interrupted');
}
if (require.main === module) {
  for (const signal of ['SIGTERM','SIGINT']) process.on(signal, () => {interrupted = true; if (currentChild) currentChild.kill('SIGTERM');});
  main().catch(error => {
    // Print controlled messages only: no dependency output, request bodies or stack traces.
    if (!fs.existsSync(path.join(outputDir,'status.json'))) write(path.join(outputDir,'status.json'),{phase:'configuration-or-runtime',passed:false});
    console.error(error instanceof AggregateError ? error.message : /^Missing |^Store must |^The Lighthouse lab |^Invalid /.test(error.message) ? error.message : 'Lighthouse harness failed; inspect sanitized phase/status artifacts and confirm cleanup.');
    process.exitCode = 1;
  });
}
module.exports = {lifecycle, verifyReports, cleanup, main};
