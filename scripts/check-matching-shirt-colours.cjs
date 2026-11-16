const assert=require('assert/strict'),fs=require('fs');
const load=require('./lib/load-project.cjs')({react:{cache:fn=>fn}});
const {seedStore,publicStore}=load('@/lib/server/store-repository');
const {groupCatalogueProducts,colourVariants,productOptions,hasCrochetDesignOptions}=load('@/lib/product-variants');
const {currentImageSource}=load('@/lib/product-media');
const audit=require('../docs/shirt-dress-colours-2026-11-16.json'),hover=require('../data/product-card-hover.json');
const state=seedStore(),products=publicStore(state).products,black=products.find(p=>p.id==='black-tiered-cotton-shirt-dress');
const variants=colourVariants(black,products);assert.equal(variants.length,6);assert.equal(audit.products.length,5);
assert.equal(black.image,audit.editTarget,'Keep the approved black model photograph');
for(const job of audit.products){
 const p=products.find(p=>p.id===job.id),src=job.savedPath.replace(/^public/,'');
 assert.equal(p.image,src);assert.deepEqual(p.gallery,[src]);assert.equal(p.imageHover,src);
 assert(!hover[p.id],'No old-model hover photo');assert.equal(currentImageSource(job.colourReference),src);
 assert(fs.existsSync(job.savedPath));assert(job.prompt.includes('EXACTLY THE SAME WOMAN AS IMAGE 1'));
}
const cards=groupCatalogueProducts(products);assert.equal(cards.length,31);
const crochet=cards.filter(hasCrochetDesignOptions);assert.equal(crochet.length,1);assert.equal(crochet[0].id,'ivory-handmade-crochet-halter-top');
assert.equal(productOptions(crochet[0],products).length,5,'Keep every colour/design available from the one card');
console.log('PASS: six dress colours use reviewed matching-model media; old model galleries/hover are removed; one crochet card retains all five purchase options.');
