const assert=require('node:assert/strict');
const load=require('./lib/load-project.cjs')({react:{cache:fn=>fn}});
const {seedStore,publicStore}=load('@/lib/server/store-repository'),{quoteCod}=load('@/lib/server/cod-orders'),{canCheckoutCodItem,codSettings}=load('@/lib/cod');
const state=seedStore();state.settings.acceptingOrders=true;state.settings.cod={enabled:true,testMode:true,demoMultiplier:200,shippingLkr:400};
const raw=state.products.find(p=>p.status==='active'),size=raw.sizes[0];raw.trackInventory=false;raw.stock[size]=0;raw.priceLkr=5500;
const input={customer:{name:'Local checkout regression',email:'checkout@example.test',phone:'0771234567',street:'Local test only',city:'Colombo',district:'Colombo',postcode:'00100',country:'Sri Lanka'},items:[{productId:raw.id,size,quantity:2}]};
function check(){const product=publicStore(state).products.find(p=>p.id===raw.id),cfg=codSettings(state.settings);return {product,cfg,available:canCheckoutCodItem(product,size,2,cfg)};}
for(const testMode of [true,false]){
 state.settings.cod.testMode=testMode;const {product,available}=check();assert.equal(product.stock,undefined);assert.equal(available,true,'Untracked items with no public stock must remain purchasable');assert.equal(quoteCod(state,input).items[0].quantity,2);
 raw.trackInventory=true;raw.stock[size]=1;assert.equal(check().available,false);assert.throws(()=>quoteCod(state,input),/quantity is unavailable/);
 raw.stock[size]=2;assert.equal(check().available,true);assert.equal(quoteCod(state,input).items[0].quantity,2);raw.trackInventory=false;
}
delete raw.priceLkr;assert.equal(check().available,false);assert.throws(()=>quoteCod(state,input),/confirmed LKR price/);
const cfg=codSettings(state.settings),product={...check().product,priceLkr:5500};assert.equal(canCheckoutCodItem(product,size,1,cfg),true);assert.equal(canCheckoutCodItem(undefined,size,1,cfg),false);assert.equal(canCheckoutCodItem(product,'Removed size',1,cfg),false);for(const qty of [0,-1,1.5,100])assert.equal(canCheckoutCodItem(product,size,qty,cfg),false);
assert.equal(state.orders.length,0);assert.equal(raw.stock[size],2);
console.log('PASS: browser availability matches server quotes for untracked/hidden stock, tracked shortages and valid stock in demo/live modes; missing LKR prices, invalid sizes/quantities remain blocked. No orders created.');
