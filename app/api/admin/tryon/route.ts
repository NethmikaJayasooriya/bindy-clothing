import { NextResponse } from "next/server";
import { checkOrigin, requireAdmin } from "@/lib/server/admin-auth";
import { limitedJson, RequestError } from "@/lib/server/request-security";
import { getTryOnControl, setTryOnControl } from "@/lib/server/tryon-service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { await requireAdmin(); return NextResponse.json({ control: await getTryOnControl(), configured: Boolean(process.env.FAL_KEY) }); }
  catch (e) { return NextResponse.json({ error: e instanceof RequestError ? e.message : "Fitting-room settings are unavailable." }, { status: e instanceof RequestError ? e.status : 503 }); }
}
export async function POST(request: Request) {
  try {
    await requireAdmin(); checkOrigin(request);
    const body = await limitedJson(request, 2000) as { enabled: boolean; renderLimit: number; dailyLimit: number };
    if (!body || (body.enabled && !process.env.FAL_KEY)) throw new RequestError("Configure the fitting-service key before enabling new previews.");
    return NextResponse.json({ control: await setTryOnControl(body) });
  } catch (e) { return NextResponse.json({ error: e instanceof RequestError ? e.message : "Unable to save fitting-room settings." }, { status: e instanceof RequestError ? e.status : 503 }); }
}
