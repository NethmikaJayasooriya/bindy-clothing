const assert=require('node:assert/strict');
const load=require('./lib/load-project.cjs')({react:{cache:fn=>fn}});
const {seedStore,publicStore}=load('@/lib/server/store-repository');
const {colourVariants,groupCatalogueProducts}=load('@/lib/product-variants');
const {productPhotoFraming,productPhotoSizes}=load('@/lib/product-photo-framing');
const {createOrder}=load('@/lib/server/store-actions');
const {quoteCod}=load('@/lib/server/cod-orders');
const state=seedStore();state.settings.acceptingOrders=true;state.settings.cod={enabled:true,testMode:false,demoMultiplier:200,shippingLkr:400};
const products=publicStore(state).products;
const white=products.find(p=>p.id==='triangle-crochet-halter-top');
const variants=colourVariants(white,products);
assert.deepEqual(variants.map(p=>p.colorName),['White','Rust Red','Warm Brown','Mustard Yellow']);
assert.equal(new Set(variants.map(p=>p.image)).size,4);
assert.equal(groupCatalogueProducts(variants).length,1);
assert.equal(groupCatalogueProducts(products).length,32);
assert(!variants.some(p=>p.id==='ivory-handmade-crochet-halter-top'),'Different crochet designs must stay separate');
for(const p of variants){
 assert.equal(p.priceAud,18);assert.equal(p.priceLkr,3500);
 const size=p.sizes[0],raw=state.products.find(q=>q.id===p.id),before=structuredClone(raw.stock);
 const order=createOrder(state,{requestId:`local-crochet-${p.id}`,customer:{name:'Local colour check',email:'colour@example.test',phone:'0771234567',address:'Local test only'},items:[{productId:p.id,size,quantity:1}]});
 assert.equal(order.items[0].productId,p.id);assert.equal(order.items[0].image,p.image);assert.equal(order.items[0].name,p.name);assert.equal(order.shipping,45);
 assert.deepEqual(raw.stock,before,'Untracked colours must not invent stock');
 const quote=quoteCod(state,{acceptedTerms:true,customer:{name:'Local colour check',email:'colour@example.test',phone:'0771234567',street:'Local test only',city:'Colombo',district:'Colombo',postcode:'00100',country:'Sri Lanka'},items:[{productId:p.id,size,quantity:1}]});
 assert.equal(quote.items[0].productId,p.id);assert.equal(quote.items[0].unitPrice,3500);
}
for(const [top,bottom] of [['ivory-handmade-crochet-halter-top','ivory-crochet-bralette'],['lime-strapless-button-front-top','black-relaxed-harem-pants'],['taupe-olive-embroidered-voile-blouse','taupe-olive-wide-leg-voile-pants'],['botanic-rose-cami','botanic-rose-trousers'],['sunlit-paisley-shirt','sunlit-paisley-shorts']]){
 const a=products.find(p=>p.id===top),b=products.find(p=>p.id===bottom);
 assert.notDeepEqual(productPhotoFraming(a,a.image),productPhotoFraming(b,b.image));
 assert.equal(productPhotoFraming(a,'/images/new-admin-photo.webp'),undefined,'New admin photos must not inherit old photo cropping');
 assert.equal(productPhotoSizes(a,'/images/new-admin-photo.webp','(max-width: 640px) 50vw, 25vw'),'(max-width: 640px) 50vw, 25vw');
}
assert.equal(productPhotoSizes({id:'ivory-handmade-crochet-halter-top'},products.find(p=>p.id==='ivory-handmade-crochet-halter-top').image,'(max-width: 640px) 50vw, 25vw'),'(max-width: 640px) 125vw, 62.5vw','Enlarged photographs need sharper source pixels without changing breakpoints');
console.log('PASS: four selectable crochet colour SKUs, distinct photos, one card, matching AUD/COD order colour and price, shipping preserved, five separately framed top/bottom pairs and safe replacement photos.');
