import { NextResponse } from "next/server";
import { readStore, mutateStore, StoreError } from "@/lib/server/store-repository";
import { applyAction, text } from "@/lib/server/store-actions";
import { publicInput, publicError } from "@/lib/server/public-requests";
import type { StoreState } from "@/lib/store-types";
export const runtime="nodejs";
function findOrder(state:StoreState,v:Record<string,unknown>) {
 const number=text(v.number,100).replace(/^#/,"").toUpperCase(),email=text(v.email,200).toLowerCase();
 const order=state.orders.find(o=>o.number.toUpperCase()===number&&o.email===email);
 if(!order)throw new StoreError("We could not match that order number and email address.",404);return order;
}
export async function POST(request:Request) {
 try{const v=await publicInput(request,"order-lookup");const state=await readStore();const order=findOrder(state,v);
 if(v.action==="request") {
  const reason=text(v.reason,2000);if(!reason)throw new StoreError("Tell us why you would like to return or exchange your order.");
  const {result}=await mutateStore(undefined,"Received a customer return request",current=>{
   const order=findOrder(current,v);if(!["shipped","delivered"].includes(order.fulfillment))throw new StoreError("This order has not shipped. Please contact us to change or cancel it.");
   if(current.returns.some(r=>r.orderId===order.id&&!['closed','declined'].includes(r.status)))throw new StoreError("A return request for this order is already being reviewed.");
   return applyAction(current,"save-return",{orderId:order.id,status:"requested",reason,amount:0,notes:`Customer preference: ${text(v.resolution,100)}. Requested items: ${text(v.items,1000)}. Refund amount is awaiting review.`}) as {id:string};
  });return NextResponse.json({ok:true,reference:result.id.slice(0,8).toUpperCase()});
 }
 return NextResponse.json({number:order.number,fulfillment:order.fulfillment,payment:order.payment,carrier:order.carrier,tracking:order.tracking,items:order.items,total:order.total,returnsDays:state.settings.returnsDays});
 }catch(e){const error=publicError(e);return NextResponse.json({error:error.message},{status:error.status});}
}
