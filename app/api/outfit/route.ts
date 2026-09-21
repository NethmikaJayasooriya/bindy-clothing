import { NextRequest, NextResponse } from "next/server";
import { getPiece, matchScore, outfitPricing } from "@/lib/styleStudio";

export const dynamic = "force-static";

/**
 * POST /api/outfit  { topId, bottomId }
 *   → validates the pairing and returns the combined bundle pricing + score.
 */
export async function POST(req: NextRequest) {
  let body: { topId?: string; bottomId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const top = body.topId ? getPiece(body.topId) : undefined;
  const bottom = body.bottomId ? getPiece(body.bottomId) : undefined;

  if (!top || top.pieceType !== "top") {
    return NextResponse.json({ error: "topId must be a valid top piece" }, { status: 400 });
  }
  if (!bottom || bottom.pieceType !== "bottom") {
    return NextResponse.json({ error: "bottomId must be a valid bottom piece" }, { status: 400 });
  }

  return NextResponse.json({
    top: { id: top.id, name: top.name, image: top.image, price: top.priceAud },
    bottom: { id: bottom.id, name: bottom.name, image: bottom.image, price: bottom.priceAud },
    score: matchScore(top, bottom),
    pricing: outfitPricing(top, bottom),
  });
}
