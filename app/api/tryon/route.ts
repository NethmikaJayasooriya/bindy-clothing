import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getPiece } from "@/lib/styleStudio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FASHN_ENDPOINT = "https://fal.run/fal-ai/fashn/tryon/v1.6";
const CACHE_DIR = path.join(process.cwd(), "public", "images", "tryon");
const BASE_MODEL = "/images/style-studio/bindy-fit-model.png";

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

async function runTryOn(modelImage: string, garmentImage: string, category: "tops" | "bottoms") {
  const res = await fetch(FASHN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Key ${process.env.FAL_KEY}` },
    body: JSON.stringify({
      model_image: modelImage,
      garment_image: garmentImage,
      category,
      garment_photo_type: "model",
      mode: "balanced",
      output_format: "jpeg",
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error("[style-studio] try-on service error", res.status, detail);
    throw new Error(`Try-on service error (${res.status})`);
  }
  const json = await res.json() as { images?: { url: string }[] };
  const url = json.images?.[0]?.url;
  if (!url) throw new Error("No image returned by try-on service");
  return url;
}

async function cacheRemoteImage(url: string, outFile: string) {
  const image = await fetch(url);
  if (!image.ok) throw new Error(`Could not download try-on result (${image.status})`);
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(outFile, Buffer.from(await image.arrayBuffer()));
}

/**
 * POST /api/tryon  { topId, bottomId }
 *   → dresses the fixed BINDY fitting-room character in the chosen top, then
 *     applies the chosen bottom in a second pass. Both stages are cached.
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

  // 2. Build the outfit on one consistent fitting-room character.
  let baseModel: string, topGarment: string, bottomGarment: string;
  try {
    baseModel = await toDataUri(BASE_MODEL);
    topGarment = await toDataUri(top.image);
    bottomGarment = await toDataUri(bottom.image);
  } catch {
    return NextResponse.json({ error: "Could not read source images" }, { status: 500 });
  }

  try {
    const topStageFile = path.join(CACHE_DIR, `top_${keyFor(top.id, "character")}.jpg`);
    let dressedTop: string;
    try {
      await fs.access(topStageFile);
      dressedTop = await toDataUri(`/images/tryon/${path.basename(topStageFile)}`);
    } catch {
      dressedTop = await runTryOn(baseModel, topGarment, "tops");
      await cacheRemoteImage(dressedTop, topStageFile);
      dressedTop = await toDataUri(`/images/tryon/${path.basename(topStageFile)}`);
    }

    const completeLook = await runTryOn(dressedTop, bottomGarment, "bottoms");
    await cacheRemoteImage(completeLook, outFile);
  } catch (e) {
    return NextResponse.json({ error: "Virtual fitting room is temporarily unavailable", detail: String(e) }, { status: 502 });
  }

  return NextResponse.json({ url: publicUrl, cached: false });
}
