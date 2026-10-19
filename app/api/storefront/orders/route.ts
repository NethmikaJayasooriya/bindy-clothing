import { NextResponse } from "next/server";
import { checkOrigin } from "@/lib/server/admin-auth";
import { mutateStore, StoreError } from "@/lib/server/store-repository";
import { createOrder, object } from "@/lib/server/store-actions";
export const runtime = "nodejs";
const limits = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  try {
    checkOrigin(request); const key = request.headers.get("x-forwarded-for")?.split(",")[0] || "local"; const old = limits.get(key); const limit = old && old.until > Date.now() ? old : { count: 0, until: Date.now() + 600000 }; if (++limit.count > 20) throw new StoreError("Please wait a few minutes before trying again.", 429); limits.set(key, limit);
    const raw = await request.text(); if (raw.length > 100000) throw new StoreError("Order details are too large.", 413);
    const data = object(JSON.parse(raw)); const { result: order } = await mutateStore(undefined, "Received a new store order", state => createOrder(state, data));
    return NextResponse.json({ number: order.number, subtotal: order.subtotal, discount: order.discount, shipping: order.shipping, total: order.total, createdAt: order.createdAt, payment: order.payment });
  } catch (e) { return NextResponse.json({ error: e instanceof StoreError ? e.message : "We could not save your order. Please try again." }, { status: e instanceof StoreError ? e.status : 500 }); }
}
