import "server-only";
import {createHash,randomUUID} from "node:crypto";
import {quoteSriLanka,sriLankaCustomer,sriLankaRequestedItems} from "./cod-orders";
import {expirePendingOrders,payhereReady} from "./payhere";
import {RequestError as StoreError} from "./request-security";
import type {StoreState,StoreOrder} from "@/lib/store-types";
export function createSriLankaPayhereOrder(state:StoreState,input:Record<string,unknown>):StoreOrder {
 if(!payhereReady())throw new StoreError("Online payment is currently unavailable. Please choose cash on delivery or try again later.",503);
 const person=sriLankaCustomer(input.customer),lines=sriLankaRequestedItems(input.items),requestId=input.requestId;
 if(typeof requestId!=="string"||!requestId.trim()||requestId.length>100)throw new StoreError("Enter a valid order reference.");
 if(input.acceptedTerms!==true)throw new StoreError("Accept the terms before placing your order.");
 const fingerprint=createHash("sha256").update(JSON.stringify({person,lines,method:"payhere-lkr"})).digest("hex"),prior=state.orders.find(o=>o.requestId===requestId);
 if(prior){if(prior.gateway?.currency!=="LKR"||prior.requestFingerprint!==fingerprint)throw new StoreError("This order reference cannot be reused for different checkout details.",409);return prior;}
 expirePendingOrders(state);
 const quote=quoteSriLanka(state,input,"payhere");if(input.quoteToken!==quote.token)throw new StoreError("Your price or availability changed. Review the updated total before paying.",409);
 const now=new Date().toISOString(),address=[person.street,person.city,person.district,person.postcode,person.country].join("\n");let customer=state.customers.find(c=>c.email===person.email);
 if(!customer){customer={id:randomUUID(),name:person.name,email:person.email,phone:person.phone,address,notes:"",createdAt:now};state.customers.push(customer);}
 const order:StoreOrder={id:randomUUID(),number:`${state.settings.orderPrefix}-${state.orders.length+1001}`,customerId:customer.id,customerName:person.name,email:person.email,phone:person.phone,address,
  items:quote.items.map(i=>({...i,inventoryTracked:state.products.find(p=>p.id===i.productId)!.trackInventory!==false,priceAud:state.products.find(p=>p.id===i.productId)!.priceAud})),subtotal:quote.subtotal,shipping:quote.shipping,discount:0,total:quote.total,discountCode:"",payment:"unpaid",fulfillment:"unfulfilled",carrier:"",tracking:"",notes:"PayHere online payment · LKR.",createdAt:now,updatedAt:now,requestId,requestFingerprint:fingerprint,paymentMethod:"payhere",currency:"LKR",testMode:false,
  gateway:{provider:"payhere",currency:"LKR",status:"pending",expiresAt:new Date(Date.now()+30*60000).toISOString()}};
 for(const item of order.items)if(item.inventoryTracked!==false)state.products.find(p=>p.id===item.productId)!.stock[item.size]-=item.quantity;
 state.orders.unshift(order);return order;
}
