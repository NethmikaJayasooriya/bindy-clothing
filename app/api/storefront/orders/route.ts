import { NextResponse } from "next/server";
import { mutateStore, StoreError } from "@/lib/server/store-repository";
import { createOrder, object } from "@/lib/server/store-actions";
import { payhereReady,checkoutForm } from "@/lib/server/payhere";
import { publicInput,publicError } from "@/lib/server/public-requests";
import { hasDatabase } from "@/lib/server/durable-storage";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const data=await publicInput(request,"checkout",20);
    if(!payhereReady()||!hasDatabase())throw new StoreError("Online checkout is being prepared. Please contact the store for help.",503);
    const {result:order}=await mutateStore(undefined,"Reserved a new PayHere order",state=>{
      if(!["privacy","terms","shipping","returns"].every(slug=>state.pages.some(p=>p.slug===slug&&p.published)))throw new StoreError("Checkout will open after the store policies are published.",503);
      const order=createOrder(state,data);
      if(!order.gateway)order.gateway={provider:"payhere",currency:"AUD",status:"pending",expiresAt:new Date(Date.now()+30*60000).toISOString()};
      checkoutForm(order,object(data.customer));
      return order;
    });
    return NextResponse.json({number:order.number,checkout:checkoutForm(order,object(data.customer))},{headers:{"Cache-Control":"no-store"}});
  }catch(e){const error=publicError(e);return NextResponse.json({error:error.message},{status:error.status});}
}
