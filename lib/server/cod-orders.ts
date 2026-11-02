import "server-only";
import {createHash,randomUUID} from "node:crypto";
import {codSettings,codUnitPrice,SL_DISTRICTS,type CodQuote} from "@/lib/cod";
import {isRetiredProduct} from "@/lib/retired-products";
import {getCanonicalProductId} from "@/lib/products";
import type {StoreState,StoreOrder} from "@/lib/store-types";
import {RequestError as StoreError} from "./request-security";
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const obj=(v:unknown):Record<string,unknown>=>{if(!v||typeof v!=="object"||Array.isArray(v))throw new StoreError("Invalid checkout details.");return v as Record<string,unknown>;};
function str(v:unknown,label:string,max=200){if(typeof v!=="string"||!v.trim()||v.length>max)throw new StoreError(`Enter a valid ${label}.`);return v.trim();}
function customer(v:unknown){const p=obj(v);const country=str(p.country,"country");if(country!=="Sri Lanka")throw new StoreError("Cash on delivery is available only within Sri Lanka.");
 const phone=str(p.phone,"Sri Lankan mobile number",30).replace(/[\s()-]/g,"");if(!/^(?:0|\+94)7\d{8}$/.test(phone))throw new StoreError("Enter a Sri Lankan mobile number, e.g. 07XXXXXXXX or +947XXXXXXXX.");
 const email=str(p.email,"email").toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new StoreError("Enter a valid email address.");
 const district=str(p.district,"district");if(!SL_DISTRICTS.includes(district))throw new StoreError("Choose a Sri Lankan district.");const postcode=str(p.postcode,"5-digit postal code",5);if(!/^\d{5}$/.test(postcode))throw new StoreError("Enter a 5-digit Sri Lankan postal code.");
 return {name:str(p.name,"full name"),email,phone,country,district,postcode,street:str(p.street,"street address",500),city:str(p.city,"city",100)};
}
function requestedItems(v:unknown){if(!Array.isArray(v)||!v.length||v.length>50)throw new StoreError("Add between 1 and 50 items.");const grouped=new Map<string,{productId:string;size:string;quantity:number}>();
 for(const raw of v){const i=obj(raw),productId=getCanonicalProductId(str(i.productId,"product")),size=str(i.size,"size"),quantity=i.quantity;if(typeof quantity!=="number"||!Number.isInteger(quantity)||quantity<1||quantity>99)throw new StoreError("Choose an item quantity from 1 to 99.");const key=productId+":"+size;const total=(grouped.get(key)?.quantity??0)+quantity;if(total>99)throw new StoreError("Maximum 99 units per size.");grouped.set(key,{productId,size,quantity:total});}return [...grouped.values()].sort((a,b)=>(a.productId+a.size).localeCompare(b.productId+b.size));
}
function ready(state:StoreState){const cfg=codSettings(state.settings);if(!state.settings.acceptingOrders||!cfg.enabled)throw new StoreError("Sri Lanka cash on delivery is currently paused.",503);if(!Number.isFinite(cfg.shippingLkr)||cfg.shippingLkr<0||!Number.isFinite(cfg.demoMultiplier)||cfg.demoMultiplier<=0)throw new StoreError("COD prices are not configured.",503);return cfg;}
export function quoteCod(state:StoreState,input:Record<string,unknown>):CodQuote {
 const cfg=ready(state);customer(input.customer);
 const items=requestedItems(input.items).map(i=>{const p=state.products.find(p=>p.id===i.productId&&p.status==="active"&&!isRetiredProduct(p.id));if(!p||!p.sizes.includes(i.size))throw new StoreError("An item or size is no longer available.");if((p.stock[i.size]??0)<i.quantity)throw new StoreError(`${p.name}: selected quantity is unavailable in ${i.size}.`,409);const unitPrice=codUnitPrice(p,cfg);if(unitPrice===null)throw new StoreError(`${p.name} does not have a confirmed LKR price yet. Please contact the store.`,409);return {...i,name:p.name,image:p.image,unitPrice};});
 const subtotal=Math.round(items.reduce((s,i)=>s+i.unitPrice*i.quantity,0)*100)/100,shipping=cfg.shippingLkr,total=Math.round((subtotal+shipping)*100)/100;
 const quote={items,subtotal,shipping,total,currency:"LKR" as const,testMode:cfg.testMode};return {...quote,token:hash(quote)};
}
export function createCodOrder(state:StoreState,input:Record<string,unknown>):StoreOrder {
 const person=customer(input.customer),lines=requestedItems(input.items),requestId=str(input.requestId,"order reference",100);
 if(input.acceptedTerms!==true)throw new StoreError("Accept the terms before placing your order.");
 const fingerprint=hash({person,lines,method:"cod"}),prior=state.orders.find(o=>o.requestId===requestId);
 if(prior){if(prior.paymentMethod!=="cod"||prior.requestFingerprint!==fingerprint)throw new StoreError("This order reference cannot be reused for different checkout details.",409);return prior;}
 const cfg=ready(state);
 const quote=quoteCod(state,input);if(input.quoteToken!==quote.token)throw new StoreError("Your price or availability changed. Review the updated total before placing the order.",409);
 const now=new Date().toISOString();let owner=cfg.testMode?undefined:state.customers.find(c=>c.email===person.email);
 const address=[person.street,person.city,person.district,person.postcode,person.country].join("\n");
 if(!cfg.testMode&&!owner){owner={id:randomUUID(),name:person.name,email:person.email,phone:person.phone,address,notes:"",createdAt:now};state.customers.push(owner);}
 const order:StoreOrder={id:randomUUID(),number:`${cfg.testMode?"TEST-":""}${state.settings.orderPrefix}-${state.orders.length+1001}`,customerId:owner?.id??"",customerName:person.name,email:person.email,phone:person.phone,address,
 items:quote.items.map(i=>({...i,priceAud:state.products.find(p=>p.id===i.productId)!.priceAud})),subtotal:quote.subtotal,shipping:quote.shipping,discount:0,total:quote.total,discountCode:"",payment:"unpaid",fulfillment:"unfulfilled",carrier:"",tracking:"",notes:cfg.testMode?"TEST ORDER — mock LKR prices. Do not dispatch or collect payment.":"Cash on delivery — collect LKR total on delivery.",createdAt:now,updatedAt:now,requestId,requestFingerprint:fingerprint,paymentMethod:"cod",currency:"LKR",testMode:cfg.testMode};
 if(!cfg.testMode)for(const i of order.items)state.products.find(p=>p.id===i.productId)!.stock[i.size]-=i.quantity;
 state.orders.unshift(order);return order;
}
export function codReceipt(order:StoreOrder){return {number:order.number,createdAt:order.createdAt,currency:"LKR",testMode:order.testMode===true,items:order.items.map(({productId,name,image,size,quantity,unitPrice})=>({productId,name,image,size,quantity,unitPrice})),subtotal:order.subtotal,shipping:order.shipping,total:order.total,paymentMethod:"cod",payment:"unpaid"};}
