const assert=require('node:assert/strict'),fs=require('node:fs');
const {applyCatalogueReference,reference}=require('./lib/apply-catalogue-reference.cjs');
const list=reference.products;
assert.equal(new Set(list.map(p=>p.catalogueCode)).size,31);
assert.equal(list.filter(p=>p.catalogueCode==='20261C010').length,2);
assert.deepEqual(list.filter(p=>p.catalogueCode==='20261C010').map(p=>p.priceLkr),[3800,3500]);
assert.equal([...list].sort((a,b)=>a.catalogueOrder-b.catalogueOrder)[0].name,'Lotus Memory Dress');
assert(!list.some(p=>/earring|belt|bookmark|headband|patchwork/i.test(p.name)));
assert(!list.some(p=>p.id==='black-white-gingham-maxi-skirt'));
assert(list.some(p=>p.id==='gingham-wander-maxi-skirt'));
for(const p of list){
 assert.deepEqual(p.sizes,['AU 8 (S)','AU 10 (M)','AU 12 (L)','AU 14 (XL)']);
 assert(p.craftDetails.length && p.fitNote && p.fabric && p.priceLkr>0,p.id);
 for(const image of [p.image,p.imageHover,...p.gallery])if(image.startsWith('/'))assert(fs.existsSync('public'+image),`${p.id}: ${image}`);
 assert.equal(p.gallery.length,p.galleryLabels.length,p.id);
}
assert(list.find(p=>p.id==='taupe-olive-embroidered-voile-blouse').craftDetails.some(t=>t.includes('embroidered')));
assert.equal(list.find(p=>p.id==='botanic-rose-trousers').fabric,'Rayon Cotton');
const original={settings:{lowStockThreshold:3},products:[{id:list[0].id,sku:'OLD',stock:{'AU 8 (S)':2},priceAud:235}],orders:[{id:'existing-order',total:123}],customers:[{id:'existing-customer'}]};
const state=structuredClone(original);applyCatalogueReference(state,'2026-11-14T00:00:00Z');
assert.deepEqual(state.orders,original.orders);assert.deepEqual(state.customers,original.customers);assert.deepEqual(state.settings,original.settings);
assert.deepEqual(state.products[0].stock,original.products[0].stock);
assert(state.products.filter(p=>p.id!==list[0].id).every(p=>Object.values(p.stock).every(n=>n===0)),'Never invent new inventory');
assert.equal(new Set(state.products.map(p=>p.sku)).size,state.products.length);
console.log(`PASS: ${list.length} listings, 31 style codes, both crochet designs, exact source prices/sizes/media, excluded items and stock/order preservation.`);
