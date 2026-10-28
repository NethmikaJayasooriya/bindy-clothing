import { NextResponse } from "next/server";
import { checkOrigin, requireAdmin } from "@/lib/server/admin-auth";
import { readStore, mutateStore, StoreError } from "@/lib/server/store-repository";
import { applyAction, object, text, number } from "@/lib/server/store-actions";
import { limitedJson } from "@/lib/server/request-security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function failure(e: unknown) { console.error("Admin store error", e instanceof StoreError ? e.message : "Internal error"); return NextResponse.json({ error: e instanceof StoreError ? e.message : "Unable to save. Please try again." }, { status: e instanceof StoreError ? e.status : 500 }); }
export async function GET() { try { await requireAdmin(); return NextResponse.json(await readStore(), { headers: { "Cache-Control": "no-store" } }); } catch (e) { return failure(e); } }
export async function POST(request: Request) {
  try { await requireAdmin(); checkOrigin(request); const v = object(await limitedJson(request,2000000)); const action = text(v.action, 50); const data = object(v.data); const result = await mutateStore(number(v.revision), `Updated ${action.replace(/-/g, " ")}`, state => applyAction(state, action, data)); return NextResponse.json({ state: result.state, result: result.result },{headers:{"Cache-Control":"no-store"}}); } catch (e) { return failure(e); }
}
