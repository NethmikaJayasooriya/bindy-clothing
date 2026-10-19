import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mutateStore, StoreError } from "@/lib/server/store-repository";
import { text } from "@/lib/server/store-actions";
import { publicInput, publicError } from "@/lib/server/public-requests";
export const runtime="nodejs";
export async function POST(request:Request) {
 try {
  const v=await publicInput(request,"contact");const name=text(v.name,200),email=text(v.email,200).toLowerCase(),subject=text(v.subject,200),message=text(v.message,5000);
  if(!name||!subject||!message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new StoreError("Enter your name, email, subject and message.");
  await mutateStore(undefined,"Received a customer enquiry",state=>state.messages.unshift({id:randomUUID(),name,email,subject,message,status:"new",notes:"",createdAt:new Date().toISOString()}));
  return NextResponse.json({ok:true});
 }catch(e){const error=publicError(e);return NextResponse.json({error:error.message},{status:error.status});}
}
