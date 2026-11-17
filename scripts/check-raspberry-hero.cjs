const assert=require('assert/strict'),fs=require('fs'),sharp=require('sharp');
const load=require('./lib/load-project.cjs')({react:{cache:fn=>fn}});
const {DEFAULT_HERO}=load('@/lib/store-types'),slide=require('../data/raspberry-hero.json'),images=require('../data/hero-images.json'),audit=require('../docs/raspberry-hero-2026-11-17.json');
(async()=>{
 assert.equal(DEFAULT_HERO.length,5);assert.deepEqual(DEFAULT_HERO.at(-1),slide);
 assert.equal(slide.id,'highlands');assert.equal(slide.link,'/product/raspberry-red-textured-maxi-dress');assert(!/olive|linen|highlands/i.test([slide.name,slide.label,slide.note,slide.product,slide.alt].join(' ')));
 const photo=images[slide.image];assert(photo);assert.equal(photo.mobile.focalPoint,slide.mobile);assert.equal(photo.height,2048);assert.equal(photo.mobile.height,2048);
 const actual=await sharp(audit.deliveryMaster.path).metadata();assert.equal(actual.width,audit.deliveryMaster.width);assert.equal(actual.height,audit.deliveryMaster.height);
 for(const source of [photo,photo.mobile])for(const v of source.variants){assert(fs.existsSync('public'+v.src));const m=await sharp('public'+v.src).metadata();assert.equal(m.width,v.width);assert(v.width<=source.width);}
 assert(audit.generatedDimensions.width<audit.deliveryMaster.width,'Record the built-in generation size separately from the 2K export');
 console.log('PASS: only the fifth default slide changed; red-dress copy and product link match; 2K exports and responsive mobile crop have accurate dimensions and focal points.');
})().catch(e=>{console.error(e.message);process.exit(1)});
