const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = 'http://localhost:3002';
let cookie='', state, checks=0;
const check=(v,label)=>{assert.ok(v,label);checks++;console.log('PASS '+label)};
async function request(url,body,auth=true,extra={}) {const r=await fetch(base+url,{method:body===undefined?'GET':'POST',headers:{Origin:base,...(body!==undefined?{'Content-Type':'application/json'}:{}),...(auth&&cookie?{Cookie:cookie}:{}),...extra},...(body!==undefined?{body:JSON.stringify(body)}:{})});let data;try{data=await r.json()}catch{data={error:'Non-JSON response'}}return {r,data};}
async function load(){const result=await request('/api/admin/store');assert.equal(result.r.status,200);state=result.data;return state;}
async function action(action,data,expected=200,revision=state.revision){const result=await request('/api/admin/store',{action,data,revision});assert.equal(result.r.status,expected,JSON.stringify(result.data));if(result.r.ok)state=result.data.state;return result.data.result;}
(async()=>{
 check((await request('/api/admin/store',undefined,false)).r.status===401,'Protected store rejects anonymous access');
 let auth=await request('/api/admin/auth');
 if(!auth.data.configured){const setup=await request('/api/admin/auth',{action:'setup',name:'QA Store Owner',email:'owner@example.test',password:'Admin-QA-Only-2026!'});assert.equal(setup.r.status,200,JSON.stringify(setup.data));cookie=setup.r.headers.get('set-cookie').split(';')[0];}
 else {const login=await request('/api/admin/auth',{action:'login',email:'owner@example.test',password:'Admin-QA-Only-2026!'});assert.equal(login.r.status,200);cookie=login.r.headers.get('set-cookie').split(';')[0];}
 check(Boolean(cookie),'Owner authentication issues session');await load();check(state.products.length===33,'All 33 unique products imported');
 check((await request('/api/admin/auth',{action:'setup',name:'No',email:'other@example.test',password:'Another-Test-1234'})).r.status===409,'Owner signup locks after first setup');
 check((await request('/api/admin/store',{action:'settings',data:state.settings,revision:state.revision},true,{Origin:'https://wrong.example'})).r.status===403,'Cross-origin mutations rejected');
 const original=structuredClone(state.products[0]);
 await action('save-product',{...original,priceAud:original.priceAud+1});
 let pub=(await request('/api/storefront',undefined,false)).data;
 check(pub.products.find(p=>p.id===original.id).priceAud===original.priceAud+1,'Price changes reach the public shop');
 check(pub.products.find(p=>p.id===original.id).image===original.image,'Editing details preserves curated product photo');
 check(!('costAud' in pub.products[0])&&!('sku' in pub.products[0]),'Private cost and SKU are not published');
 await action('product-status',{ids:[original.id],status:'draft'});pub=(await request('/api/storefront',undefined,false)).data;check(!pub.products.some(p=>p.id===original.id),'Draft products disappear from public catalogue');
 await action('save-product',original);
 await action('inventory',{id:original.id,stock:{...original.stock,[original.sizes[0]]:-1}},400);
 check(true,'Negative inventory rejected');
 await action('inventory',{id:original.id,stock:Object.fromEntries(original.sizes.map(s=>[s,10]))});
 await action('settings',{...state.settings,standardShipping:12,expressShipping:18,freeShippingThreshold:99999});
 await action('save-discount',{id:state.discounts.find(d=>d.code==='QATEST10')?.id,code:'QATEST10',type:'percentage',value:10,minimum:0,startsAt:'',endsAt:'',usageLimit:0,active:true});
 const orderInput={requestId:'qa-order-'+Date.now(),customer:{name:'QA Customer',email:'shopper@example.test',phone:'0400000000',address:'TEST ONLY — 1 Example Street, Test City'},items:[{productId:original.id,size:original.sizes[0],quantity:2,priceAud:1}],discountCode:'QATEST10',shippingMethod:'standard'};
 const placed=await request('/api/storefront/orders',orderInput,false);check(placed.r.status===200,'Storefront checkout creates order');
 check(placed.data.subtotal===original.priceAud*2&&placed.data.payment==='unpaid','Server prices override browser prices; payment remains pending');
 await load();const order=state.orders.find(o=>o.requestId===orderInput.requestId);check(order&&state.products.find(p=>p.id===original.id).stock[original.sizes[0]]===8,'New order reserves correct size stock');
 const repeat=await request('/api/storefront/orders',orderInput,false);await load();check(repeat.data.number===placed.data.number&&state.orders.filter(o=>o.requestId===orderInput.requestId).length===1&&state.products.find(p=>p.id===original.id).stock[original.sizes[0]]===8,'Repeated checkout does not duplicate order or stock deduction');
 await action('update-order',{...order,fulfillment:'shipped',tracking:''},400);check(true,'Dispatch requires a tracking number');
 await action('update-order',{...order,payment:'refunded'},400);check(true,'Unpaid orders cannot be marked as refunded');
 await action('update-order',{...order,fulfillment:'cancelled'});await action('update-order',{...order,fulfillment:'cancelled'});check(state.products.find(p=>p.id===original.id).stock[original.sizes[0]]===10,'Cancellation restocks exactly once');
 await action('update-order',{...order,fulfillment:'unfulfilled'},400);check(true,'Cancelled orders cannot reopen');
 const badCoupon=await request('/api/storefront/discount',{code:'DOESNOTEXIST',subtotal:100,shipping:12},false);check(badCoupon.r.status===400,'Unknown discount codes rejected');
 const over=await request('/api/storefront/orders',{...orderInput,requestId:'qa-over-'+Date.now(),items:[{productId:original.id,size:original.sizes[0],quantity:99}]},false);check(over.r.status===400,'Overselling rejected');
 await action('settings',state.settings,409,state.revision-1);check(true,'Conflicting admin revisions rejected');
 await action('save-customer',{id:state.customers.find(c=>c.email==='manual@example.test')?.id,name:'QA Manual Customer',email:'manual@example.test',phone:'',address:'',notes:'QA'});check(state.customers.some(c=>c.email==='manual@example.test'),'Customers can be managed');
 const order2=await action('create-order',{...orderInput,requestId:'qa-return-'+Date.now(),discountCode:''});
 await action('update-order',{...order2,payment:'paid',fulfillment:'delivered',tracking:'QA-TRACK-001',carrier:'Test courier'});
 await action('update-order',{...order2,payment:'paid',fulfillment:'unfulfilled'},400);check(true,'Dispatched orders cannot move backwards and restock twice');
 await action('save-return',{orderId:order2.id,reason:'QA return',status:'received',amount:order2.total,restock:true,notes:'QA only'});
 check(state.returns[0].restocked&&state.products.find(p=>p.id===original.id).stock[original.sizes[0]]===10,'Received full-order returns restock products');
 await action('save-return',{orderId:order2.id,reason:'Duplicate',status:'received',amount:1,restock:true,notes:''},400);check(true,'Duplicate return restock / excessive refunds rejected');
 const hero=structuredClone(state.hero);hero[0].title='QA headline';await action('content',{hero,pages:state.pages});pub=(await request('/api/storefront',undefined,false)).data;check(pub.hero[0].title==='QA headline','Homepage editor updates public hero');hero[0].title='The art of';await action('content',{hero,pages:state.pages});
 const form=new FormData();form.append('file',new Blob(['not an image'],{type:'image/png'}),'bad.png');const upload=await fetch(base+'/api/admin/media',{method:'POST',headers:{Origin:base,Cookie:cookie},body:form});check(upload.status===400,'Invalid image uploads rejected');
 await action('save-product',original);

 const contact=await request('/api/storefront/contact',{name:'QA Enquiry',email:'enquiry@example.test',subject:'QA enquiry',message:'TEST ONLY: Please confirm sizing.'},false);await load();check(contact.r.ok&&state.messages.some(m=>m.email==='enquiry@example.test'),'Contact enquiries arrive in admin inbox');
 const enquiry=state.messages.find(m=>m.email==='enquiry@example.test');await action('message-status',{id:enquiry.id,status:'resolved',notes:'QA note'});check(state.messages.find(m=>m.id===enquiry.id).status==='resolved','Admin can resolve enquiries');
 check((await request('/api/storefront/subscribe',{email:'newsletter@example.test',consent:false},false)).r.status===400,'Newsletter subscription requires consent');
 const signup=await request('/api/storefront/subscribe',{email:'newsletter@example.test',consent:true},false);await load();check(signup.r.ok&&state.subscribers.some(s=>s.email==='newsletter@example.test'),'Newsletter signup arrives in subscriber list');
 const subscriber=state.subscribers.find(s=>s.email==='newsletter@example.test');await action('subscriber-status',{id:subscriber.id,active:false});check(!state.subscribers.find(s=>s.id===subscriber.id).active,'Admin can unsubscribe a contact');
 const missingLookup=await request('/api/storefront/returns',{number:order2.number,email:'wrong@example.test'},false);check(missingLookup.r.status===404,'Order lookup requires matching email');
 const lookup=await request('/api/storefront/returns',{number:order2.number,email:order2.email},false);check(lookup.r.ok&&lookup.data.tracking==='QA-TRACK-001'&&!('address' in lookup.data),'Return portal shows real order and tracking without exposing address');
 const order3=await action('create-order',{...orderInput,requestId:'qa-public-return-'+Date.now(),discountCode:''});await action('update-order',{...order3,fulfillment:'shipped',tracking:'QA-TRACK-002'});
 const customerReturn=await request('/api/storefront/returns',{action:'request',number:order3.number,email:order3.email,reason:'QA sizing check',resolution:'Exchange',items:'All items'},false);await load();check(customerReturn.r.ok&&state.returns.some(r=>r.orderId===order3.id&&r.status==='requested'),'Customer return request reaches admin returns');
 check((await request('/api/storefront/returns',{action:'request',number:order3.number,email:order3.email,reason:'Duplicate',resolution:'Refund'},false)).r.status===400,'Duplicate open return requests rejected');
 const backup=await request('/api/admin/backup');check(backup.r.ok&&backup.r.headers.get('content-disposition').includes('attachment'),'Owner can download store backup');
 check((await request('/api/admin/backup',undefined,false)).r.status===401,'Store backup is protected');
 const logout=await request('/api/admin/auth',{action:'logout'});check(logout.r.ok&&(await request('/api/admin/store')).r.status===401,'Sign out revokes session');
 console.log(`\n${checks} admin integration checks passed. QA data isolated in .store-qa.`);
 await fs.mkdir(path.resolve('output/review'),{recursive:true});await fs.writeFile(path.resolve('output/review/admin-checks.json'),JSON.stringify({checks,passed:true,at:new Date().toISOString()},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
