import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getPiece } from "@/lib/styleStudio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FASHN_ENDPOINT = "https://fal.run/fal-ai/fashn/tryon/v1.6";
const CACHE_DIR = path.join(process.cwd(), "public", "images", "tryon");

const MIME: Record<string, string> = {
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
};

async function toDataUri(publicPath: string): Promise<string> {
  const abs = path.join(process.cwd(), "public", publicPath.replace(/^\/+/, ""));
  const buf = await fs.readFile(abs);
  const ext = path.extname(abs).toLowerCase();
  return `data:${MIME[ext] || "image/webp"};base64,${buf.toString("base64")}`;
}

const keyFor = (a: string, b: string) => `${a}__${b}`.replace(/[^a-z0-9]+/gi, "_").toLowerCase();

/**
 * POST /api/tryon  { topId, bottomId }
 *   → renders the chosen top + skirt worn on the model (FASHN v1.6), caches the
 *     result on disk, and returns its URL. Cached combos return instantly.
 */
export async function POST(req: NextRequest) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) {
    return NextResponse.json({ error: "FAL_KEY not configured on the server." }, { status: 500 });
  }

  let body: { topId?: string; bottomId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const top = body.topId ? getPiece(body.topId) : undefined;
  const bottom = body.bottomId ? getPiece(body.bottomId) : undefined;
  if (!top || top.pieceType !== "top") return NextResponse.json({ error: "Invalid topId" }, { status: 400 });
  if (!bottom || bottom.pieceType !== "bottom") return NextResponse.json({ error: "Invalid bottomId" }, { status: 400 });

  const key = keyFor(top.id, bottom.id);
  const outFile = path.join(CACHE_DIR, `${key}.jpg`);
  const publicUrl = `/images/tryon/${key}.jpg`;

  // 1. serve from cache if we've rendered this pairing before (free + instant)
  try { await fs.access(outFile); return NextResponse.json({ url: publicUrl, cached: true }); } catch { /* not cached */ }

  // 2. render: model already wears the top → apply the chosen skirt onto it
  let modelImage: string, garmentImage: string;
  try {
    modelImage = await toDataUri(top.image);
    garmentImage = await toDataUri(bottom.image);
  } catch {
    return NextResponse.json({ error: "Could not read source images" }, { status: 500 });
  }

  let falJson: { images?: { url: string }[]; detail?: unknown };
  try {
    const res = await fetch(FASHN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Key ${FAL_KEY}` },
      body: JSON.stringify({
        model_image: modelImage,
        garment_image: garmentImage,
        category: "bottoms",
        garment_photo_type: "model",
        mode: "balanced",
        output_format: "jpeg",
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ error: "Try-on service error", status: res.status, detail }, { status: 502 });
    }
    falJson = await res.json();
  } catch (e) {
    return NextResponse.json({ error: "Try-on request failed", detail: String(e) }, { status: 502 });
  }

  const resultUrl = falJson.images?.[0]?.url;
  if (!resultUrl) return NextResponse.json({ error: "No image returned", detail: falJson }, { status: 502 });

  // 3. cache the render to disk so future requests are free
  try {
    const img = await fetch(resultUrl);
    const buf = Buffer.from(await img.arrayBuffer());
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(outFile, buf);
  } catch {
    // caching failed (e.g. read-only FS in prod) — still return the live URL
    return NextResponse.json({ url: resultUrl, cached: false });
  }

  return NextResponse.json({ url: publicUrl, cached: false });
}
