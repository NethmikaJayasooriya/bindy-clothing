const assert=require('assert/strict');
const load=require('./lib/load-project.cjs')({react:{cache:fn=>fn}});
const pay=load('@/lib/server/payhere'),{seedStore}=load('@/lib/server/store-repository'),{createOrder}=load('@/lib/server/store-actions');
const keys=['PAYHERE_ENABLED','PAYHERE_MODE','PAYHERE_MERCHANT_ID','PAYHERE_MERCHANT_SECRET','SITE_URL'],before=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
try{
 process.env.PAYHERE_ENABLED='true';process.env.PAYHERE_MODE='live';process.env.PAYHERE_MERCHANT_ID='264454';process.env.SITE_URL='https://bindyclothing.com.au';delete process.env.PAYHERE_MERCHANT_SECRET;
 assert.equal(pay.payhereReady(),false,'A missing Merchant Secret must keep live payments unavailable');
 assert.throws(()=>pay.checkoutForm({},{}),/Online payment is not available/);
 process.env.PAYHERE_MERCHANT_SECRET='local-test-secret-not-a-live-credential';assert.equal(pay.payhereReady(),true);
 const s=seedStore();s.settings.acceptingOrders=true;const p=s.products[0];
 const order=createOrder(s,{requestId:'local-payhere-setup-test',customer:{name:'Local test',email:'local@example.test',phone:'0400000000',address:'Local test only'},items:[{productId:p.id,size:p.sizes[0],quantity:1}],shippingMethod:'standard'});
 order.gateway={provider:'payhere',currency:'AUD',status:'pending',expiresAt:new Date(Date.now()+1800000).toISOString()};
 const form=pay.checkoutForm(order,{firstName:'Local',lastName:'Test',street:'Local test only',city:'Brisbane'});
 assert.equal(form.action,'https://www.payhere.lk/pay/checkout');assert.equal(form.fields.merchant_id,'264454');assert.equal(form.fields.currency,'AUD');assert.equal(order.shipping,28);assert.equal(form.fields.amount,(order.subtotal+28).toFixed(2));
 assert.equal(form.fields.notify_url,'https://bindyclothing.com.au/api/payhere/notify');
 assert.equal(form.fields.hash,pay.checkoutHash('264454',order.number,order.total.toFixed(2),'AUD',process.env.PAYHERE_MERCHANT_SECRET));
 assert(!Object.values(form.fields).includes(process.env.PAYHERE_MERCHANT_SECRET),'Never expose the Merchant Secret to the checkout form');
 const notice={merchant_id:'264454',order_id:order.number,payhere_amount:form.fields.amount,payhere_currency:'AUD',status_code:'2',payment_id:'LOCAL-TEST-ONLY'};notice.md5sig=pay.notificationHash(notice,process.env.PAYHERE_MERCHANT_SECRET);
 pay.applyNotification(s,notice,'264454',process.env.PAYHERE_MERCHANT_SECRET);assert.equal(order.payment,'paid');
 console.log('PASS: Merchant 264454, live endpoint, AUD 28 total/hash and callback verification; missing secret blocks payments; no live orders or gateway requests made.');
}finally{for(const k of keys)if(before[k]===undefined)delete process.env[k];else process.env[k]=before[k];}
