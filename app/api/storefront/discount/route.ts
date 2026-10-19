import { NextResponse } from "next/server";
import { readStore, StoreError } from "@/lib/server/store-repository";
import { discountTotal, object, text, number } from "@/lib/server/store-actions";
import { checkOrigin } from "@/lib/server/admin-auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { checkOrigin(request); const v = object(await request.json()); const state = await readStore(); const code = text(v.code, 30).toUpperCase(); if (!code) throw new StoreError("Enter a discount code."); const result = discountTotal(state, code, number(v.subtotal), number(v.shipping)); return NextResponse.json({ code, discount: result.discount, shipping: result.shipping, type: result.coupon!.type, value: result.coupon!.value }); }
  catch (e) { return NextResponse.json({ error: e instanceof StoreError ? e.message : "Unable to check this code." }, { status: e instanceof StoreError ? e.status : 500 }); }
}
