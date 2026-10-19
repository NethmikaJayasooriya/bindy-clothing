import { NextResponse } from "next/server";
import { readPublicStore } from "@/lib/server/store-repository";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await readPublicStore(), { headers: { "Cache-Control": "no-store" } }); }
