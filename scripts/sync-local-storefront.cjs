// Explicit, narrow migration for an existing local preview. Never contacts the
// production database and never replaces local orders, stock or admin changes.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const load = require('./lib/load-project.cjs')();
const {getProduct} = load('@/data/products');
const {DEFAULT_SOCIALS,DEFAULT_CONTACT_EMAIL} = load('@/lib/social-links');
const {isRetiredProduct} = load('@/lib/retired-products');
const file=path.resolve('.store/store.json');
assert(file.startsWith(process.cwd()+path.sep));
const state=JSON.parse(fs.readFileSync(file,'utf8'));
const protectedData=({products,settings,revision,updatedAt,...rest})=>JSON.stringify({...rest,settings:{...settings,instagram:null,facebook:null,tiktok:null,email:null,phone:null}});
const before=protectedData(state);
Object.assign(state.settings,DEFAULT_SOCIALS,{email:DEFAULT_CONTACT_EMAIL,phone:'0766655550'});
const seed=getProduct('botanic-rose-trousers');assert(seed);
const p=state.products.find(p=>p.id===seed.id);assert(p);
const price=p.priceAud,stock=JSON.stringify(p.stock);
for(const key of ['name','description','image','imageHover','galleryLabels'])p[key]=seed[key];
for(const product of state.products){if(isRetiredProduct(product.id)){product.status='archived';product.featured=false;}if(product.styleWith)product.styleWith=product.styleWith.filter(id=>!isRetiredProduct(id));}
assert.equal(p.priceAud,price);assert.equal(JSON.stringify(p.stock),stock);assert.equal(protectedData(state),before);
state.revision=(state.revision??0)+1;state.updatedAt=new Date().toISOString();
const temporary=file+'.sync.tmp';fs.writeFileSync(temporary,JSON.stringify(state,null,2)+'\n',{mode:0o600});fs.renameSync(temporary,file);
console.log({localPreviewUpdated:true,instagramAdded:true,fullOutfitPhoto:p.image,ordersAndStockPreserved:true,revision:state.revision});
