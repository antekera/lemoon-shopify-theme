const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {config,routes,collectionConfig,ownedThemes,stageTheme} = require('../core.cjs');
const {authenticate,checkRoute} = require('../auth.cjs');
const {exportArtifacts,sanitize} = require('../artifacts.cjs');
const {lifecycle,verifyReports} = require('../run.cjs');
const {manifest,verifyFixture} = require('../fixture.cjs');
const lab = {mode:'lab',origin:'https://lab.myshopify.com',store:'lab.myshopify.com',product:'lighthouse-frame',collection:'lighthouse-frames'};
const env = {LIGHTHOUSE_STORE:lab.store,LIGHTHOUSE_PRODUCT_HANDLE:lab.product,LIGHTHOUSE_COLLECTION_HANDLE:lab.collection,LIGHTHOUSE_CLIENT_ID:'client',LIGHTHOUSE_CLIENT_SECRET:'secret',LIGHTHOUSE_STORE_PASSWORD:'password'};
function temp(t) {const dir = fs.mkdtempSync(path.join(os.tmpdir(),'lhci-test-')); t.after(() => fs.rmSync(dir,{recursive:true,force:true})); return dir;}

test('dedicated lab config never falls back to commercial credentials or aliases', () => {
  assert.throws(() => config({SHOPIFY_STORE:'commercial.myshopify.com',SHOPIFY_ACCESS_TOKEN:'commercial'}), /Missing LIGHTHOUSE_STORE/);
  assert.throws(() => config({...env,LIGHTHOUSE_STORE:'pzsrt4-1u.myshopify.com'}), /separate/);
  assert.throws(() => config({...env,LIGHTHOUSE_STORE:'https://lab.myshopify.com'}), /bare/);
  assert.throws(() => config({...env,LIGHTHOUSE_PRODUCT_HANDLE:'../password'}), /Invalid/);
  assert.equal(config(env).store,lab.store);
  assert.equal(config({AUDIT_MODE:'commercial',SHOPIFY_STORE:lab.store,SHOPIFY_STOREFRONT_ORIGIN:'https://lemoon.cl',SHOPIFY_PRODUCT_HANDLE:'frame',SHOPIFY_COLLECTION_HANDLE:'frames'}).mode,'commercial');
});
test('three runs and unchanged median thresholds; commercial URLs have no preview overrides', () => {
  const c = collectionConfig(lab,'123','/chrome');
  assert.equal(c.ci.collect.numberOfRuns,3);
  assert.deepEqual(c.ci.assert.assertions['categories:performance'], ['error',{minScore:0.6,aggregationMethod:'median-run'}]);
  assert.deepEqual(c.ci.assert.assertions['categories:accessibility'], ['error',{minScore:0.8,aggregationMethod:'median-run'}]);
  assert.ok(c.ci.collect.url.every(url => url.includes('preview_theme_id=123')));
  assert.ok(routes({...lab,mode:'commercial'}).every(url => !url.includes('?')));
});
test('cleanup refuses renamed, published, mismatched or ambiguous themes', () => {
  const state = {name:'lemoon-lhci-00000000-0000-0000-0000-000000000000',id:'123'};
  const theme = {name:state.name,id:123,role:'unpublished'};
  assert.deepEqual(ownedThemes([theme,{name:'other',id:456,role:'unpublished'}],state),[theme]);
  assert.deepEqual(ownedThemes([],state),[]);
  assert.throws(() => ownedThemes([{...theme,name:'renamed'}],state), /renamed/);
  assert.throws(() => ownedThemes([{...theme,role:'live'}],state), /role/);
  assert.throws(() => ownedThemes([{...theme,id:456}],state), /identity/);
  assert.throws(() => ownedThemes([theme,theme],state), /Ambiguous/);
});
test('cleanup and artifact export execute after upload, collect and assertion failures', async () => {
  for (const fail of ['upload','collect','assert']) {
    const calls = [];
    await assert.rejects(lifecycle({audit:async () => {calls.push(fail);throw Error(fail);},cleanup:async () => calls.push('cleanup'),export:async result => {calls.push('export');assert.equal(result.auditPassed,false);assert.equal(result.cleanupPassed,true);}}),new RegExp(fail));
    assert.deepEqual(calls,[fail,'cleanup','export']);
  }
});
test('cleanup failure fails a passing audit and status; export still runs', async () => {
  let result;
  await assert.rejects(lifecycle({audit:async () => {},cleanup:async () => {throw Error('cleanup');},export:async r => {result=r;}}),/cleanup/);
  assert.deepEqual(result,{auditPassed:true,cleanupPassed:false});
});
test('readiness rejects password, redirect, 404, and wrong theme', () => {
  const url = routes(lab,'123')[0];
  checkRoute(url,url,200,123,'123');
  for (const args of [[url,lab.origin+'/password',200,123,'123'],[url,url,404,123,'123'],[url,url,200,456,'123'],[url,'https://other.myshopify.com/',200,123,'123']]) assert.throws(() => checkRoute(...args),/readiness/);
});
test('password is passed as data and preview is re-established on every route', async () => {
  const urls = routes(lab,'123'), seen = [], password = "q'\\\"\n+secret";
  let current, initial = true, submitted, jsEnabled=true;
  const page = {setDefaultNavigationTimeout(){},async setJavaScriptEnabled(enabled){jsEnabled=enabled;},async type(selector,value){assert.equal(jsEnabled,false);submitted=value;},keyboard:{async press(){}},async goto(url) {seen.push(url);current = initial ? lab.origin+'/password' : url;initial=false;return {status:() => 200};},url:() => current,
    async waitForSelector(){},async $eval(selector,fn,value){if (value !== undefined) submitted=value;return lab.origin+'/password';},async setRequestInterception(){},on(){},off(){},async waitForNavigation(){current=lab.origin+'/';},async evaluate(){return {id:123,role:'unpublished'};},async $(){return null;},async close(){seen.push('closed');}};
  await authenticate({newPage:async () => page},{urls,password,id:'123'});
  assert.equal(submitted,password);assert.equal(jsEnabled,true); assert.deepEqual(seen,[urls[0],...urls,'closed']);
});
test('artifact allowlist drops raw configs, HTML, DOM and network data; redacts encoded secrets and keys', t => {
  const dir = temp(t), raw = path.join(dir,'raw'), out = path.join(dir,'out');fs.mkdirSync(raw);
  const secret = 'odd +"password', encoded = Buffer.from(secret).toString('base64');
  fs.writeFileSync(path.join(raw,'lhr-1.json'),JSON.stringify({lighthouseVersion:'11.4.0',requestedUrl:`https://x.test/?secret=${encodeURIComponent(secret)}`,audits:{metric:{score:1,numericValue:100,details:{items:[{cookie:secret,text:encoded}]}},[encoded]:{score:0}},configSettings:{extraHeaders:{Cookie:secret}},categories:{performance:{score:0.7,auditRefs:[]}}}));
  fs.writeFileSync(path.join(raw,'assertion-results.json'),JSON.stringify([{auditId:'categories:performance',actual:0.7,expected:0.6,passed:true,url:`https://x.test/?password=${secret}`,debug:secret}]));
  for (const name of ['auth.json','lhr-1.html','config.json','flags-1.json']) fs.writeFileSync(path.join(raw,name),secret);
  exportArtifacts(raw,out,[secret]);
  assert.deepEqual(fs.readdirSync(out).sort(),['assertion-results.json','lhr-1.json']);
  const text = fs.readdirSync(out).map(n => fs.readFileSync(path.join(out,n),'utf8')).join('');
  for (const value of [secret,encoded,encodeURIComponent(secret),'extraHeaders','details','debug']) assert.ok(!text.includes(value),value);
  assert.match(text,/REDACTED/);
  assert.equal(sanitize(new URLSearchParams({v:secret}).toString(),[secret]),'v=[REDACTED]');
});
test('artifact exporter refuses symlinks', t => {
  const dir=temp(t);fs.mkdirSync(path.join(dir,'raw'));fs.writeFileSync(path.join(dir,'secret'),'{}');fs.symlinkSync(path.join(dir,'secret'),path.join(dir,'raw/lhr-1.json'));
  assert.throws(() => exportArtifacts(path.join(dir,'raw'),path.join(dir,'out'),[]),/symlink/);
});
function fixtureData() {
  return {products:{nodes:manifest.products.map(p => ({...p,onlineStoreUrl:lab.origin+'/products/'+p.handle,lens:p.metafields['custom.lens_compatible'],fixture:p.metafields['custom.lighthouse_fixture'],variants:{nodes:p.variants.map(v => ({...v,inventoryPolicy:'CONTINUE',inventoryItem:{tracked:false,requiresShipping:true},taxable:false,compareAtPrice:null}))},images:{nodes:[{url:'https://cdn.shopify.com/'+p.image.file,width:p.image.width,height:p.image.height,altText:p.image.alt}]}}))},collectionByHandle:{...manifest.collection,products:{nodes:manifest.collection.productHandles.map(handle => ({handle}))}}};
}
test('12-product fixture verifies membership, price, variant, metadata and checksums; rejects drift', () => {
  assert.equal(verifyFixture(fixtureData(),lab).length,12);
  for (const mutate of [d => d.products.nodes.pop(),d => d.collectionByHandle.products.nodes.pop(),d => {d.products.nodes[0].variants.nodes=[{...d.products.nodes[0].variants.nodes[0],price:'1.00'}];},d => {d.products.nodes[0].lens={value:'false',type:'boolean'};},d => {d.products.nodes[0].images.nodes[0].width=1;}]) {
    const data=fixtureData();mutate(data);assert.throws(() => verifyFixture(data,lab),/fixture|mismatch/);
  }
});
test('fixture failure retains the exact nonsecret field and expected/actual values through lifecycle export', async () => {
  const data=fixtureData();data.products.nodes[0].onlineStoreUrl=null;
  let exported=false;
  await assert.rejects(lifecycle({
    audit:async () => verifyFixture(data,lab), cleanup:async () => {},
    export:async (result,error) => {
      assert.equal(result.auditPassed,false);assert.equal(result.cleanupPassed,true);
      assert.deepEqual(error.diagnostic,{field:'product.onlineStoreUrl',product:'lighthouse-frame',expected:'published Online Store URL',actual:null});
      exported=true;
    }
  }),/fixture mismatch/);
  assert.equal(exported,true);
});
test('staging excludes commercial settings and credentials, preserves hero and maps home collections', t => {
  const dir=temp(t), source=path.join(dir,'source'), target=path.join(dir,'target');
  fs.mkdirSync(path.join(source,'config'),{recursive:true});fs.mkdirSync(path.join(source,'templates'));fs.writeFileSync(path.join(source,'config/settings_data.json'),'commercial');fs.writeFileSync(path.join(source,'.env'),'secret');
  fs.writeFileSync(path.join(source,'templates/index.json'),JSON.stringify({sections:{hero:{type:'lemoon-hero',settings:{autoplay_seconds:4}},products:{type:'lemoon-featured-products',settings:{collection:'commercial'}}}}));
  const fixture=path.join(dir,'fixture.json');fs.writeFileSync(fixture,'{"current":{}}');stageTheme(source,target,fixture);
  assert.equal(fs.readFileSync(path.join(target,'config/settings_data.json'),'utf8'),'{"current":{}}');assert.ok(!fs.existsSync(path.join(target,'.env')));
  const home=JSON.parse(fs.readFileSync(path.join(target,'templates/index.json')));assert.equal(home.sections.hero.settings.autoplay_seconds,4);assert.equal(home.sections.products.settings.collection,'lighthouse-frames');
});
test('scored reports require exactly nine runs, correct final route, identity audit and actual Lighthouse 11.4.0', async t => {
  const dir=temp(t);let i=0;
  for (const url of routes(lab,'123')) for (let run=0;run<3;run++) fs.writeFileSync(path.join(dir,`lhr-${i++}.json`),JSON.stringify({lighthouseVersion:'11.4.0',requestedUrl:url,finalUrl:url,categories:{performance:{score:0.7},accessibility:{score:0.9}},audits:{'http-status-code':{score:1},'lemoon-theme-identity':{score:1}}}));
  await verifyReports(dir,lab,'123');
  const file=path.join(dir,'lhr-0.json'), good=JSON.parse(fs.readFileSync(file));
  for (const change of [{categories:{}},{categories:{performance:{score:2},accessibility:{score:0.9}}},{finalUrl:lab.origin+'/password'},{lighthouseVersion:'12.0.0'},{audits:{'http-status-code':{score:1},'lemoon-theme-identity':{score:0}}}]) {fs.writeFileSync(file,JSON.stringify({...good,...change}));await assert.rejects(verifyReports(dir,lab,'123'));}
  fs.unlinkSync(file);await assert.rejects(verifyReports(dir,lab,'123'),/three/);
});

test('password is never filled or submitted after cross-origin redirect or form-action tampering', async () => {
  for (const attack of ['redirect','form']) {
    let filled=false;
    const page={setDefaultNavigationTimeout(){},async setJavaScriptEnabled(){},async setRequestInterception(){},on(){},off(){},async goto(){},url:() => attack === 'redirect' ? 'https://attacker.invalid/password' : lab.origin+'/password',async waitForSelector(){},async $eval(selector,fn,value){if (value !== undefined) filled=true;return 'https://attacker.invalid/password';},async close(){}};
    await assert.rejects(authenticate({newPage:async () => page},{urls:routes(lab,'123'),password:'must-not-leak',id:'123'}),/origin mismatch|form action mismatch/);
    assert.equal(filled,false);
  }
});
test('staging rejects symlinks before copying theme payload', t => {
  const dir=temp(t),source=path.join(dir,'source');fs.mkdirSync(path.join(source,'assets'),{recursive:true});
  fs.symlinkSync('/etc/passwd',path.join(source,'assets/exfiltrate.txt'));
  assert.throws(() => stageTheme(source,path.join(dir,'target'),'unused'),/Symlinks/);
});

test('all cross-origin authentication requests are blocked, then interception is removed before readiness', async () => {
  let handler,intercept=false,current,first=true;
  const requests=[];
  function request(url,method) {
    return {url:() => url,method:() => method,abort:() => requests.push(['abort',method,url]),continue:() => requests.push(['continue',method,url])};
  }
  const page={setDefaultNavigationTimeout(){},async setJavaScriptEnabled(){},async setRequestInterception(value){intercept=value;},on(event,fn){handler=fn;},off(event,fn){assert.equal(handler,fn);handler=undefined;},
    async goto(url){
      if(first){first=false;assert.equal(intercept,true);assert.equal(typeof handler,'function');current=lab.origin+'/password';
        for(const method of ['GET','POST','PUT','HEAD']) handler(request('https://attacker.invalid/steal?password=synthetic',method));
        handler(request(lab.origin+'/password','POST'));
      }else{assert.equal(intercept,false);assert.equal(handler,undefined);current=url;}
      return {status:() => 200};
    },url:() => current,async waitForSelector(){},async $eval(){return lab.origin+'/password';},async type(){},keyboard:{async press(){}},async waitForNavigation(){current=lab.origin+'/';},async evaluate(){return {id:123,role:'unpublished'};},async $(){return null;},async close(){}};
  await authenticate({newPage:async () => page},{mode:'lab',urls:routes(lab,'123'),password:'synthetic',id:'123'});
  assert.deepEqual(requests.map(r => r.slice(0,2)),[['abort','GET'],['abort','POST'],['abort','PUT'],['abort','HEAD'],['continue','POST']]);
});

test('resolved but blocked native submission keeps authentication guard until the page closes', async () => {
  let removed=false,closed=false,jsEnabled=false;
  const page={setDefaultNavigationTimeout(){},async setJavaScriptEnabled(value){jsEnabled=value;},async setRequestInterception(){},on(){},off(){removed=true;},async goto(){},url:() => lab.origin+'/password',async waitForSelector(){},async $eval(){return lab.origin+'/password';},async type(){},keyboard:{async press(){}},async waitForNavigation(){},async $(){return {};},async close(){closed=true;}};
  await assert.rejects(authenticate({newPage:async () => page},{urls:routes(lab,'123'),id:'123',password:'synthetic'}),/did not leave/);
  assert.equal(removed,false);assert.equal(jsEnabled,false);assert.equal(closed,true);
});

test('commercial auth, readiness and scored routes use the approved canonical origin without preview overrides', () => {
  const commercial=config({AUDIT_MODE:'commercial',SHOPIFY_STORE:'pzsrt4-1u.myshopify.com',SHOPIFY_STOREFRONT_ORIGIN:'https://lemoon.cl',SHOPIFY_STORE_PASSWORD:'unchanged-secret',SHOPIFY_PRODUCT_HANDLE:'lemoon-dama',SHOPIFY_COLLECTION_HANDLE:'opticos'});
  assert.equal(commercial.store,'pzsrt4-1u.myshopify.com');assert.equal(commercial.password,'unchanged-secret');assert.equal(commercial.origin,'https://lemoon.cl');
  const expected=['https://lemoon.cl/','https://lemoon.cl/products/lemoon-dama','https://lemoon.cl/collections/opticos'];
  assert.deepEqual(routes(commercial),expected);
  assert.deepEqual(collectionConfig(commercial,undefined,'/chrome').ci.collect.url,expected);
  assert.ok(expected.every(url => !new URL(url).search));
  assert.equal(config({...env,SHOPIFY_STOREFRONT_ORIGIN:'https://attacker.invalid'}).origin,lab.origin);
});
test('commercial configuration rejects absent, malformed and unapproved storefront origins without fallback', () => {
  const commercial={AUDIT_MODE:'commercial',SHOPIFY_STORE:'pzsrt4-1u.myshopify.com',SHOPIFY_PRODUCT_HANDLE:'lemoon-dama',SHOPIFY_COLLECTION_HANDLE:'opticos'};
  assert.throws(() => config(commercial),/Missing SHOPIFY_STOREFRONT_ORIGIN/);
  for (const origin of ['http://lemoon.cl','https://attacker.invalid','https://lemoon.cl.attacker.invalid','https://user@lemoon.cl','https://lemoon.cl/','https://lemoon.cl/path','https://lemoon.cl?query=1','https://lemoon.cl#fragment','https://lemoon.cl:443','https://LEMOON.cl',' https://lemoon.cl','https://lemoon.cl\n','https://pzsrt4-1u.myshopify.com']) {
    assert.throws(() => config({...commercial,SHOPIFY_STOREFRONT_ORIGIN:origin}),/Invalid SHOPIFY_STOREFRONT_ORIGIN/,origin);
  }
});

test('GraphQL failure exports only bounded sanitized diagnostic messages and HTTP status', async () => {
  const {graphql}=require('../run.cjs');
  const {fixtureDiagnostic}=require('../artifacts.cjs');
  const secret='private&value?=ü';
  const response={ok:true,status:200,json:async () => ({errors:[{message:'Field missing '+secret+' '+encodeURIComponent(secret),extensions:{headers:{authorization:secret}}},{message:'x'.repeat(5000)}],headers:{cookie:secret},data:{secret}})};
  await assert.rejects(graphql(lab,'query {}',{},async () => response),error => {
    const diagnostic=fixtureDiagnostic(error,[secret]);
    assert.equal(diagnostic.field,'graphql');
    assert.equal(diagnostic.httpStatus,200);
    assert.equal(diagnostic.messages[0],'Field missing [REDACTED] [REDACTED]');
    assert.ok(diagnostic.messages[1].length <= 256);
    assert.ok(!JSON.stringify(diagnostic).includes(secret));
    assert.ok(!JSON.stringify(diagnostic).includes('authorization'));
    return true;
  });
  await assert.rejects(graphql(lab,'query {}',{},async () => ({ok:false,status:403})),error => {
    assert.deepEqual(fixtureDiagnostic(error,[]),{field:'graphql.httpStatus',expected:200,actual:403});return true;
  });
  const diagnostic=fixtureDiagnostic({diagnostic:{field:'product.title',expected:'expected',actual:'x'.repeat(250)+secret+'y'.repeat(5000),raw:'forbidden'}},[secret]);
  assert.ok(diagnostic.actual.length <= 256);assert.ok(!JSON.stringify(diagnostic).includes(secret));assert.equal(diagnostic.raw,undefined);
  assert.equal(fixtureDiagnostic(Error('arbitrary raw dependency error'),[]),undefined);
  assert.equal(fixtureDiagnostic({diagnostic:{field:'image.origin',actual:'https://user:pass@example.test/image?private=value#fragment'}},[]).actual,'https://example.test/image');
  await assert.rejects(graphql(lab,'query {}',{},async () => ({ok:true,status:200,json:async () => ({errors:Array.from({length:8},() => ({message:'field missing'}))})})),error => {
    assert.equal(fixtureDiagnostic(error,[]).messages.length,5);return true;
  });
});

for (const [scheme,cleanUrl] of [
  ['http','http://example.test/image'],['HTTP','http://example.test/image'],['hTtP','http://example.test/image'],
  ['https','https://example.test/image'],['HTTPS','https://example.test/image'],['HtTpS','https://example.test/image']
]) {
  test(`GraphQL diagnostics scrub ${scheme} URL components before truncation without known credentials`, async () => {
    const {graphql}=require('../run.cjs');
    const {fixtureDiagnostic}=require('../artifacts.cjs');
    for (const prefix of ['', 'x'.repeat(240)]) {
      const message=prefix+scheme+'://synthetic-user:synthetic-pass@example.test/image?private=synthetic-query#synthetic-fragment';
      await assert.rejects(graphql(lab,'query {}',{},async () => ({ok:true,status:200,json:async () => ({errors:[{message}]})})),error => {
        const diagnostic=fixtureDiagnostic(error,[]);
        assert.deepEqual(diagnostic,{field:'graphql',httpStatus:200,messages:[(prefix+cleanUrl).slice(0,256)]});
        for (const privateValue of ['synthetic-user','synthetic-pass','private=','synthetic-query','synthetic-fragment']) {
          assert.ok(!JSON.stringify(diagnostic).includes(privateValue),privateValue);
        }
        return true;
      });
    }
  });
}

test('GraphQL diagnostics redact complete encoded credentials crossing the truncation boundary', async () => {
  const {graphql}=require('../run.cjs');
  const {fixtureDiagnostic}=require('../artifacts.cjs');
  const secret='synthetic "credential" & + / ü';
  for (const encoded of [secret,encodeURIComponent(secret),new URLSearchParams({v:secret}).toString().slice(2),
    JSON.stringify(secret).slice(1,-1),Buffer.from(secret).toString('base64'),Buffer.from(secret).toString('base64url')]) {
    const message='x'.repeat(250)+encoded+'y'.repeat(500);
    await assert.rejects(graphql(lab,'query {}',{},async () => ({ok:true,status:200,json:async () => ({errors:[{message}]})})),error => {
      assert.deepEqual(fixtureDiagnostic(error,[secret]),{field:'graphql',httpStatus:200,messages:['x'.repeat(250)+'[REDAC']});
      return true;
    });
  }
});

test('fixture diagnostics identify collection, product, variant, metafield and shop drift without accepting it', async () => {
  for (const [mutate,field,expected,actual] of [
    [d => {d.collectionByHandle.sortOrder='MANUAL';},'collection.sortOrder','ALPHA_ASC','MANUAL'],
    [d => {d.products.nodes[0].vendor='Other';},'product.vendor','Lighthouse Lab','Other'],
    [d => {d.products.nodes[0].lens={type:'boolean',value:'false'};},'custom.lens_compatible.value','true','false'],
    [d => {d.products.nodes[0].variants.nodes[0].inventoryItem.tracked=true;},'variants[0].tracked',false,true]
  ]) {
    const data=fixtureData();mutate(data);
    assert.throws(() => verifyFixture(data,lab),error => {
      assert.equal(error.diagnostic.field,field);assert.deepEqual(error.diagnostic.expected,expected);assert.deepEqual(error.diagnostic.actual,actual);return true;
    });
  }
  const {verifyRemoteFixture}=require('../fixture.cjs');
  await assert.rejects(verifyRemoteFixture(lab,async () => ({...fixtureData(),shop:{id:'gid://shopify/Shop/'+manifest.shopId,myshopifyDomain:lab.store,currencyCode:'USD'}})),error => {
    assert.deepEqual(error.diagnostic,{field:'shop.currencyCode',expected:'CLP',actual:'USD'});return true;
  });
});
