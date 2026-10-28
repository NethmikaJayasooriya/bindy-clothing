import { NextResponse } from "next/server";
import { mutateStore,StoreError } from "@/lib/server/store-repository";
import { applyNotification,payhereReady,validSignature,notificationHash } from "@/lib/server/payhere";
import { limitedText } from "@/lib/server/request-security";
export const runtime="nodejs";
export async function POST(request:Request) {
  try {
    if(!payhereReady())throw new StoreError("Payment notifications are not configured.",503);
    if(!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded"))throw new StoreError("Unsupported notification.",415);
    const form=new URLSearchParams(await limitedText(request,16000));const data=Object.fromEntries(form);
    if(Array.from(form.keys()).some(key=>form.getAll(key).length!==1))throw new StoreError("Duplicate notification fields.");
    if(data.merchant_id!==process.env.PAYHERE_MERCHANT_ID||!validSignature(data.md5sig??"",notificationHash(data,process.env.PAYHERE_MERCHANT_SECRET!)))throw new StoreError("Invalid payment signature.",403);
    for(let attempt=0;;attempt++) {try {await mutateStore(undefined,"Received verified PayHere notification",state=>applyNotification(state,data,process.env.PAYHERE_MERCHANT_ID!,process.env.PAYHERE_MERCHANT_SECRET!));break;} catch(e) {if(!(e instanceof StoreError)||e.status!==409||attempt>=2)throw e;} }
    return NextResponse.json({received:true});
  }catch(e){return NextResponse.json({error:e instanceof StoreError?e.message:"Payment confirmation could not be saved."},{status:e instanceof StoreError?e.status:503});}
}
