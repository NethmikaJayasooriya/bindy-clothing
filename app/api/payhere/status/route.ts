import { NextResponse } from "next/server";
import { readStore,StoreError } from "@/lib/server/store-repository";
import { payhereReady,validOrderToken } from "@/lib/server/payhere";
import { publicInput,publicError } from "@/lib/server/public-requests";
export const runtime="nodejs";
export async function POST(request:Request){try{
  if(!payhereReady())throw new StoreError("Payment status is unavailable.",503);
  const input=await publicInput(request,"payment-status",60);
  const order=(await readStore()).orders.find(o=>o.id===input.reference);
  if(!order||!validOrderToken(order,String(input.token??"")))throw new StoreError("Order not found.",404);
  return NextResponse.json({number:order.number,payment:order.payment,status:order.gateway?.status,total:order.total,cancelled:order.fulfillment==="cancelled"},{headers:{"Cache-Control":"no-store"}});
}catch(e){const error=publicError(e);return NextResponse.json({error:error.message},{status:error.status});}}
