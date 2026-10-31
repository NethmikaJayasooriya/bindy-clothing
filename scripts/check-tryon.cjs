const assert = require('node:assert/strict'), fs = require('node:fs'), sharp = require('sharp');
const loader = require('./lib/load-project.cjs');
const rows = new Map(); let calls = [], uploads = 0, corrupt = false, failSave = false;
const storage = { from: () => ({ upload: async () => { uploads++; return { error: failSave ? new Error('storage') : null }; }, getPublicUrl: name => ({ data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/bindy-media/${name}` } }) }) };
const durable = {
 hasDatabase: () => true, productionStorageRequired: () => true,
 readDocument: async key => rows.has(key) ? structuredClone(rows.get(key)) : null,
 writeDocument: async (key,value,expected) => { if ((rows.get(key)?.revision ?? 0)!==expected) return false; rows.set(key,{value:structuredClone(value),revision:expected+1}); return true; }
};
const load = loader({'@/lib/server/durable-storage': durable, '@/data/tryon-prepared.json': {}, '@/lib/supabase/server': { getSupabaseAdmin: () => ({ storage }) }});
const studio = load('@/lib/styleStudio'), policy = load('@/lib/tryon-policy'), service = load('@/lib/server/tryon-service');
let count=0; async function check(name,fn){await fn();count++;console.log('PASS '+name);}
const a = studio.getPiece('cacao-satin-cami'), b = studio.getPiece('ivory-tiered-maxi-skirt'), other = studio.getPiece('midnight-flow-maxi-skirt');
const actualFetch = global.fetch;
(async()=>{
 const valid = await sharp({create:{width:880,height:1184,channels:3,background:'#e8e1d7'}}).png().toBuffer();
 global.fetch = async (url,options={}) => {
  calls.push({url:String(url),method:options.method||'GET',body:options.body ? JSON.parse(options.body) : undefined});
  if(options.method==='POST') return Response.json({status_url:'https://queue.fal.run/bria/fibo-edit-1.5/requests/test/status',response_url:'https://queue.fal.run/bria/fibo-edit-1.5/requests/test'});
  if(String(url).endsWith('/status')) return Response.json({status:'COMPLETED'});
  if(String(url).startsWith('https://queue.fal.run')) return Response.json({image:{url:'https://v3.fal.media/result.png'}});
  return new Response(corrupt ? Buffer.from('not an image') : valid);
 };
 process.env.FAL_KEY='unit-test-only';
 await check('Live catalogue derivation excludes removed products and keeps full garment sources',()=>{
  const pieces=studio.studioPieces([a, {...b,category:'Two Piece Sets',gallery:['front','back','wrong-macro']}]);
  assert.equal(pieces.bottoms[0].image,b.image);assert.equal(pieces.bottoms[0].name.endsWith('— Bottom'),true);
  assert.equal(studio.getPiece(a.id,[b]),undefined);
 });
 await check('A changed source photo invalidates an otherwise identical pairing',async()=>{
  const first=await service.outfitInput(a,b), changed=await service.outfitInput({...a,image:a.imageHover},b);
  assert.notEqual(first.key,changed.key);assert.equal(first.payload.garment_image_urls.length,2);assert.equal(first.payload.seed,5555);
 });
 await check('Pairing identity rejects a late response from another selection',()=>{
  assert.equal(policy.isCurrentLook({topId:a.id,bottomId:b.id,pairKey:'a'.repeat(64)},a.id,other.id),false);
 });
 await check('Legacy distorted previews and unexpected external URLs cannot be displayed',()=>{
  assert.equal(policy.safePreviewUrl('/images/tryon/old.jpg'),false);assert.equal(policy.safePreviewUrl('https://evil.test/test.webp'),false);
  assert.equal(policy.safePreviewUrl('/images/tryon-v3/'+'a'.repeat(64)+'.webp'),true);
 });
 await check('Invalid, truncated and low-resolution images are rejected before publishing',async()=>{
  await assert.rejects(()=>service.validateOutput(Buffer.from('broken image')));
  await assert.rejects(()=>service.validateOutput(valid.subarray(0,70)));
  const tiny=await sharp({create:{width:80,height:120,channels:3,background:'white'}}).png().toBuffer();await assert.rejects(()=>service.validateOutput(tiny));
 });
 await check('Paused generation makes no paid request and does not poison the pairing',async()=>{
  await service.setTryOnControl({enabled:false,renderLimit:2,dailyLimit:2});const r=await service.getTryOn(a,b);assert.equal(r.state,'unavailable');assert.equal(calls.length,0);assert.equal(rows.size,1);
 });
 await check('Concurrent requests for one pairing submit exactly one complete-outfit render',async()=>{
  await service.setTryOnControl({enabled:true,renderLimit:2,dailyLimit:2});
  await Promise.all([service.getTryOn(a,b),service.getTryOn(a,b),service.getTryOn(a,b)]);
  assert.equal(calls.filter(x=>x.method==='POST').length,1);
  const payload=calls.find(x=>x.method==='POST').body;assert.equal(payload.garment_image_urls.length,2);assert.match(payload.instruction,/ONLY the upper garment/);assert.match(payload.instruction,/ONLY the lower garment/);
 });
 await check('A completed result is decoded, saved durably and reused without another render',async()=>{
  const r=await service.getTryOn(a,b);assert.equal(r.state,'ready');assert.equal(uploads,1);assert(policy.safePreviewUrl(r.url));
  const n=calls.length,r2=await service.getTryOn(a,b);assert.equal(r2.url,r.url);assert.equal(calls.length,n);
 });
 await check('Corrupt service output never becomes a ready preview',async()=>{
  corrupt=true;await service.getTryOn(a,other);const r=await service.getTryOn(a,other);assert.equal(r.state,'unavailable');assert.equal(r.url,undefined);corrupt=false;
 });
 await check('A total spending limit is enforced across different combinations',async()=>{
  const n=calls.filter(x=>x.method==='POST').length;await service.getTryOn(studio.getPiece('pearl-lace-blouse'),b);assert.equal(calls.filter(x=>x.method==='POST').length,n);assert.equal((await service.getTryOnControl()).used,2);
 });
 await check('Failed render attempts are not retried by automatic polling',async()=>{
  const n=calls.length;await service.getTryOn(a,other);assert.equal(calls.length,n);
 });
 rows.clear();calls=[];await service.setTryOnControl({enabled:true,renderLimit:1,dailyLimit:1});
 await check('Concurrent distinct pairings cannot exceed the last remaining render',async()=>{
  await Promise.all([service.getTryOn(a,b),service.getTryOn(a,other)]);assert.equal(calls.filter(x=>x.method==='POST').length,1);assert.equal((await service.getTryOnControl()).used,1);
 });
 await check('A media storage failure retries the same result without a second paid render',async()=>{
  rows.clear();calls=[];await service.setTryOnControl({enabled:true,renderLimit:1,dailyLimit:1});
  await service.getTryOn(a,b);failSave=true;const before=uploads,r=await service.getTryOn(a,b);assert.equal(uploads,before+1);assert.equal(r.state,'processing');assert.equal(r.url,undefined);failSave=false;
  const recovered=await service.getTryOn(a,b);assert.equal(recovered.state,'ready');assert.equal(calls.filter(x=>x.method==='POST').length,1);
 });
 console.log(`${count} fitting-room integrity, concurrency and budget checks passed. No paid requests made.`);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{global.fetch=actualFetch;});
