import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { StoreOrder, StoreState } from "@/lib/store-types";
import { RequestError as StoreError } from "./request-security";

const md5 = (s:string) => createHash("md5").update(s).digest("hex").toUpperCase();
export const payhereMode = () => process.env.PAYHERE_MODE === "live" ? "live" as const : "sandbox" as const;
export const payhereReady = () => Boolean(process.env.PAYHERE_MERCHANT_ID && process.env.PAYHERE_MERCHANT_SECRET && process.env.SITE_URL && process.env.PAYHERE_ENABLED === "true");
export function checkoutHash(merchant:string,order:string,amount:string,currency:string,secret:string) { return md5(merchant+order+amount+currency+md5(secret)); }
export function notificationHash(v:Record<string,string>,secret:string) { return md5(v.merchant_id+v.order_id+v.payhere_amount+v.payhere_currency+v.status_code+md5(secret)); }
export function validSignature(actual:string,expected:string) { return /^[A-Fa-f0-9]{32}$/.test(actual)&&timingSafeEqual(Buffer.from(actual.toUpperCase()),Buffer.from(expected)); }
export function orderToken(order:StoreOrder) { return createHmac("sha256",process.env.PAYHERE_MERCHANT_SECRET!).update(`bindy-order:${order.id}:${order.createdAt}`).digest("hex"); }
export function validOrderToken(order:StoreOrder,token:string) { return /^[a-f0-9]{64}$/.test(token)&&timingSafeEqual(Buffer.from(token),Buffer.from(orderToken(order))); }
export function checkoutForm(order:StoreOrder,customer:Record<string,unknown>) {
  if(!payhereReady()) throw new StoreError("Online payment is not available yet. Please contact the store.",503);
  if(order.gateway?.status!=="pending"||Date.parse(order.gateway.expiresAt)<=Date.now()||order.fulfillment==="cancelled") throw new StoreError("This payment session has expired. Please start a new checkout.",409);
  const origin=new URL(process.env.SITE_URL!); if(origin.protocol!=="https:"&&process.env.NODE_ENV==="production") throw new StoreError("The store payment URL is not configured correctly.",503);
  const base=origin.origin; const token=orderToken(order); const amount=order.total.toFixed(2); const merchant=process.env.PAYHERE_MERCHANT_ID!;
  const str=(v:unknown,max=200)=>typeof v==="string"?v.trim().slice(0,max):"";
  return {action:payhereMode()==="live"?"https://www.payhere.lk/pay/checkout":"https://sandbox.payhere.lk/pay/checkout",fields:{
    merchant_id:merchant,return_url:`${base}/payment/return?reference=${order.id}&token=${token}`,cancel_url:`${base}/payment/return?reference=${order.id}&token=${token}&cancelled=1`,notify_url:`${base}/api/payhere/notify`,
    order_id:order.number,items:order.items.map(i=>i.name).join(", ").slice(0,200),currency:"AUD",amount,
    first_name:str(customer.firstName)||order.customerName.split(" ")[0],last_name:str(customer.lastName)||order.customerName.split(" ").slice(1).join(" ")||"-",
    email:order.email,phone:order.phone,address:str(customer.street,500)||order.address,city:str(customer.city)||"Brisbane",country:"Australia",
    hash:checkoutHash(merchant,order.number,amount,"AUD",process.env.PAYHERE_MERCHANT_SECRET!),custom_1:order.id,
  }};
}
export function expirePendingOrders(state:StoreState,now=Date.now()) {
  for(const order of state.orders) if(order.gateway?.status==="pending"&&Date.parse(order.gateway.expiresAt)<now&&order.payment==="unpaid"&&order.fulfillment!=="cancelled") {
    releaseStock(state,order);order.gateway.status="expired";order.updatedAt=new Date(now).toISOString();
  }
}
function releaseStock(state:StoreState,order:StoreOrder) {
  if(order.fulfillment==="cancelled")return;
  for(const line of order.items) {const p=state.products.find(p=>p.id===line.productId);if(p)p.stock[line.size]=(p.stock[line.size]??0)+line.quantity;}
  if(order.discountCode){const d=state.discounts.find(d=>d.code===order.discountCode);if(d)d.used=Math.max(0,d.used-1);}
  order.fulfillment="cancelled";
}
export function applyNotification(state:StoreState,v:Record<string,string>,merchant:string,secret:string) {
  if(v.merchant_id!==merchant||!validSignature(v.md5sig??"",notificationHash(v,secret))) throw new StoreError("Invalid payment signature.",403);
  const order=state.orders.find(o=>o.number===v.order_id&&o.gateway?.provider==="payhere");
  if(!order||v.payhere_currency!=="AUD"||!/^\d+\.\d{2}$/.test(v.payhere_amount)||v.payhere_amount!==order.total.toFixed(2)) throw new StoreError("Payment details do not match the order.",400);
  if(!["2","0","-1","-2","-3"].includes(v.status_code))throw new StoreError("Unknown payment status.");
  const gateway=order.gateway!;
  if(gateway.status==="refunded")return order;
  if(gateway.status==="paid"&&v.status_code!=="-3")return order;
  if(v.status_code==="2") {
    if(!v.payment_id)throw new StoreError("Payment reference is missing.");
    if(state.orders.some(o=>o.id!==order.id&&o.gateway?.paymentId===v.payment_id))throw new StoreError("Payment reference already used.",409);
    order.payment="paid";gateway.status="paid";gateway.paymentId=v.payment_id;
    if(order.fulfillment==="cancelled")order.notes+="\nPAYMENT REVIEW: Payment arrived after reservation was released. Check availability before fulfilment or refund in PayHere.";
  } else if(v.status_code==="-3") { if(order.payment!=="paid")throw new StoreError("An unpaid order cannot be charged back.");order.payment="refunded";gateway.status="refunded";order.notes+="\nPayHere reported a chargeback. Review this order in the merchant dashboard."; }
  else if(["-1","-2"].includes(v.status_code)&&gateway.status==="pending") {releaseStock(state,order);gateway.status="failed";}
  order.updatedAt=new Date().toISOString();return order;
}
