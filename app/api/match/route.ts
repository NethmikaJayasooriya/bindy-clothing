import { NextRequest, NextResponse } from "next/server";
import {
  getPiece,
  compatibleBottoms,
  compatibleTops,
  STUDIO_TOPS,
  STUDIO_BOTTOMS,
  type Match,
} from "@/lib/styleStudio";

export const dynamic = "force-static";
export const revalidate = 3600;

const slim = (m: Match) => ({
  id: m.piece.id,
  name: m.piece.name,
  image: m.piece.image,
  price: m.piece.priceAud,
  colorName: m.piece.colorName,
  score: m.score,
});

/**
 * GET /api/match?piece=<id>[&type=top|bottom][&limit=8]
 *   → ranked compatible pieces for a given top or bottom.
 * GET /api/match            → the full matchable pool (tops + bottoms).
 */
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pieceId = searchParams.get("piece");
  const limit = Math.min(Number(searchParams.get("limit")) || 8, 24);

  if (!pieceId) {
    return NextResponse.json({
      tops: STUDIO_TOPS.map((p) => ({ id: p.id, name: p.name, image: p.image, price: p.priceAud })),
      bottoms: STUDIO_BOTTOMS.map((p) => ({ id: p.id, name: p.name, image: p.image, price: p.priceAud })),
    });
  }

  const piece = getPiece(pieceId);
  if (!piece) {
    return NextResponse.json({ error: "Unknown piece", piece: pieceId }, { status: 404 });
  }

  const matches =
    piece.pieceType === "top" ? compatibleBottoms(pieceId, limit) : compatibleTops(pieceId, limit);

  return NextResponse.json({
    piece: { id: piece.id, name: piece.name, image: piece.image, price: piece.priceAud, type: piece.pieceType },
    matchType: piece.pieceType === "top" ? "bottom" : "top",
    matches: matches.map(slim),
  });
}
