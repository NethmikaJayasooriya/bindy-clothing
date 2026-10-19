import { requireAdmin } from "@/lib/server/admin-auth";
import { readStore, StoreError } from "@/lib/server/store-repository";
import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function GET() {
 try{await requireAdmin();const state=await readStore();return new NextResponse(JSON.stringify(state,null,2),{headers:{"Content-Type":"application/json","Content-Disposition":`attachment; filename="bindy-store-${new Date().toISOString().slice(0,10)}.json"`,"Cache-Control":"private, no-store"}});}
 catch(e){return NextResponse.json({error:"Please sign in to download a backup."},{status:e instanceof StoreError?e.status:500});}
}
