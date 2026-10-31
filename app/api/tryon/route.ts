import { NextRequest, NextResponse } from "next/server";
import { getPiece } from "@/lib/styleStudio";
import { checkOrigin } from "@/lib/server/admin-auth";
import { limitedJson, rateLimit, requestIdentity, RequestError } from "@/lib/server/request-security";
import { readPublicStore } from "@/lib/server/store-repository";
import { getTryOn } from "@/lib/server/tryon-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function POST(req: NextRequest) {
  try {
    checkOrigin(req);
    const body = await limitedJson(req, 2000) as { topId?: unknown; bottomId?: unknown; retry?: unknown };
    if (!body || typeof body.topId !== "string" || typeof body.bottomId !== "string") throw new RequestError("Choose a top and a bottom.");
    const { products } = await readPublicStore();
    const top = getPiece(body.topId, products), bottom = getPiece(body.bottomId, products);
    if (!top || top.pieceType !== "top" || !bottom || bottom.pieceType !== "bottom") throw new RequestError("This garment is no longer available. Please choose another piece.");
    await rateLimit("tryon-lookup-v3", requestIdentity(req), 180, 600);
    if (body.retry === true) await rateLimit("tryon-retry-v3", requestIdentity(req), 6, 600);
    const result = await getTryOn(top, bottom, body.retry === true);
    return NextResponse.json(result, { status: result.state === "processing" ? 202 : result.state === "unavailable" ? 503 : 200 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof RequestError ? e.message : "The fitting room is temporarily unavailable. Please try again." }, { status: e instanceof RequestError ? e.status : 503 });
  }
}
