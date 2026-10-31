import { NextRequest, NextResponse } from "next/server";
import { publicInput } from "@/lib/server/public-requests";
import { getPiece, matchScore } from "@/lib/styleStudio";
import { readPublicStore } from "@/lib/server/store-repository";

export const dynamic = "force-dynamic";

/**
 * POST /api/outfit  { topId, bottomId }
 *   → validates the pairing and returns the combined bundle pricing + score.
 */
export async function POST(req: NextRequest) {
  let body: { topId?: string; bottomId?: string };
  try {
    body = await publicInput(req,"outfit");
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { products } = await readPublicStore();
  const top = body.topId ? getPiece(body.topId, products) : undefined;
  const bottom = body.bottomId ? getPiece(body.bottomId, products) : undefined;

  if (!top || top.pieceType !== "top") {
    return NextResponse.json({ error: "topId must be a valid top piece" }, { status: 400 });
  }
  if (!bottom || bottom.pieceType !== "bottom") {
    return NextResponse.json({ error: "bottomId must be a valid bottom piece" }, { status: 400 });
  }

  const subtotal = products.filter(p => p.id === top.sourceId || p.id === bottom.sourceId).reduce((sum,p) => sum + p.priceAud,0);
  return NextResponse.json({
    top: { id: top.id, name: top.name, image: top.image, price: top.priceAud },
    bottom: { id: bottom.id, name: bottom.name, image: bottom.image, price: bottom.priceAud },
    score: matchScore(top, bottom),
    pricing: { subtotal, total: subtotal, discount: 0, savings: 0, bundleRate: 0 },
  });
}
