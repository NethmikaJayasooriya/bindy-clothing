import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { mutateStore } from "@/lib/server/store-repository";
import { expirePendingOrders } from "@/lib/server/payhere";
export const runtime="nodejs";
export async function GET(request:Request){
  const expected=`Bearer ${process.env.CRON_SECRET??""}`;const actual=request.headers.get("authorization")??"";
  if(!process.env.CRON_SECRET||actual.length!==expected.length||!timingSafeEqual(Buffer.from(actual),Buffer.from(expected)))return NextResponse.json({error:"Unauthorized"},{status:401});
  try{await mutateStore(undefined,"Expired unpaid payment reservations",state=>expirePendingOrders(state));return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"Please retry"},{status:503});}
}
