import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mutateStore, StoreError } from "@/lib/server/store-repository";
import { text } from "@/lib/server/store-actions";
import { publicInput, publicError } from "@/lib/server/public-requests";
export const runtime="nodejs";
export async function POST(request:Request) {
 try{const v=await publicInput(request,"subscribe");const email=text(v.email,200).toLowerCase();if(v.consent!==true||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new StoreError("Enter a valid email and confirm that you want to subscribe.");
 await mutateStore(undefined,"Received a newsletter signup",state=>{const prior=state.subscribers.find(s=>s.email===email);if(!prior)state.subscribers.unshift({id:randomUUID(),email,active:true,createdAt:new Date().toISOString()});});return NextResponse.json({ok:true});
 }catch(e){const error=publicError(e);return NextResponse.json({error:error.message},{status:error.status});}
}
