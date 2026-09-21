/**
 * BINDY Style Studio — Mix & Match engine.
 *
 * Turns the catalogue into individually-matchable TOP and BOTTOM pieces, scores
 * how well any top pairs with any bottom (palette + occasion + collection), and
 * prices the resulting outfit as a bundle.
 *
 * Fully tag-driven: any future garment is picked up automatically from its
 * parentCategory. Standalone Tops / Bottoms become one piece each; two-piece
 * "Resort Wear" sets are split into a top piece + a bottom piece. Dresses are
 * treated as complete looks and excluded from mixing.
 */
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

export type PieceType = "top" | "bottom";

export interface StudioPiece extends Product {
  pieceType: PieceType;
  sourceId: string;        // the catalogue product this piece comes from
  isSplit: boolean;        // true when derived from a two-piece set
}

const BUNDLE_RATE = 0.1;   // 10% off when two pieces are bought as a styled set

/* ------------------------------------------------------------------ */
/* Piece derivation                                                    */
/* ------------------------------------------------------------------ */

function topFrom(p: Product, price: number, image: string, split: boolean, name: string): StudioPiece {
  return { ...p, id: split ? `${p.id}--top` : p.id, name, priceAud: price, image, pieceType: "top", sourceId: p.id, isSplit: split };
}
function bottomFrom(p: Product, price: number, image: string, split: boolean, name: string): StudioPiece {
  return { ...p, id: split ? `${p.id}--bottom` : p.id, name, priceAud: price, image, pieceType: "bottom", sourceId: p.id, isSplit: split };
}

const TOPS: StudioPiece[] = [];
const BOTTOMS: StudioPiece[] = [];

for (const p of PRODUCTS) {
  const parent = (p as Product & { parentCategory?: string }).parentCategory;
  const detail = p.gallery?.[2] || p.imageHover || p.image;

  if (parent === "Tops") {
    TOPS.push(topFrom(p, p.priceAud, p.image, false, p.name));
  } else if (parent === "Bottoms") {
    BOTTOMS.push(bottomFrom(p, p.priceAud, p.image, false, p.name));
  } else if (parent === "Resort Wear") {
    // two-piece set → split into a matchable top + bottom
    const topPrice = Math.round(p.priceAud * 0.45);
    const botPrice = p.priceAud - topPrice;
    TOPS.push(topFrom(p, topPrice, p.image, true, `${p.name} — Top`));
    BOTTOMS.push(bottomFrom(p, botPrice, detail, true, `${p.name} — Skirt`));
  }
  // Dresses: complete looks, not mixable
}

export const STUDIO_TOPS = TOPS;
export const STUDIO_BOTTOMS = BOTTOMS;

export function getPiece(id: string): StudioPiece | undefined {
  return TOPS.find((t) => t.id === id) || BOTTOMS.find((b) => b.id === id);
}

/* ------------------------------------------------------------------ */
/* Palette helpers                                                     */
/* ------------------------------------------------------------------ */

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}
function isNeutral(c: { s: number; l: number }): boolean {
  return c.s < 0.22 || c.l > 0.85 || c.l < 0.16; // near-white / near-black / desaturated earth
}
function hueDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/* ------------------------------------------------------------------ */
/* Compatibility scoring                                               */
/* ------------------------------------------------------------------ */

/** 0–100 — how well a top pairs with a bottom. Higher = more harmonious. */
export function matchScore(top: StudioPiece, bottom: StudioPiece): number {
  if (top.sourceId === bottom.sourceId) return 100; // the original set — a perfect match

  let score = 12; // friendly baseline

  // occasion overlap — pieces you'd wear to the same moment belong together
  const occT: string[] = (top as Product & { occasions?: string[] }).occasions || [];
  const occB: string[] = (bottom as Product & { occasions?: string[] }).occasions || [];
  const shared = occT.filter((o) => occB.includes(o)).length;
  score += Math.min(shared * 16, 34);

  // same collection reads as intentional
  const colT = (top as Product & { collectionName?: string }).collectionName;
  const colB = (bottom as Product & { collectionName?: string }).collectionName;
  if (colT && colT === colB) score += 10;

  // palette harmony
  const cT = hexToHsl(top.colorHex || "#C5A059");
  const cB = hexToHsl(bottom.colorHex || "#C5A059");
  if (isNeutral(cT) || isNeutral(cB)) {
    score += 30; // a neutral anchors any partner
  } else {
    const dh = hueDist(cT.h, cB.h);
    if (dh < 32) score += 26;        // analogous / tonal
    else if (dh > 140) score += 22;  // complementary pop
    else if (dh > 95) score += 14;   // split-complementary
    else score += 6;                 // riskier clash
    if (Math.abs(cT.l - cB.l) > 0.22) score += 4; // light-on-dark contrast reads well
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export interface Match { piece: StudioPiece; score: number }

export function compatibleBottoms(topId: string, limit = 8): Match[] {
  const top = STUDIO_TOPS.find((t) => t.id === topId);
  if (!top) return [];
  return STUDIO_BOTTOMS
    .map((b) => ({ piece: b, score: matchScore(top, b) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
export function compatibleTops(bottomId: string, limit = 8): Match[] {
  const bottom = STUDIO_BOTTOMS.find((b) => b.id === bottomId);
  if (!bottom) return [];
  return STUDIO_TOPS
    .map((t) => ({ piece: t, score: matchScore(t, bottom) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Outfit pricing                                                      */
/* ------------------------------------------------------------------ */

export interface OutfitPricing {
  subtotal: number;
  bundleRate: number;
  discount: number;
  total: number;
  savings: number;
}
export function outfitPricing(top: StudioPiece, bottom: StudioPiece): OutfitPricing {
  const subtotal = top.priceAud + bottom.priceAud;
  const discount = Math.round(subtotal * BUNDLE_RATE);
  return { subtotal, bundleRate: BUNDLE_RATE, discount, total: subtotal - discount, savings: discount };
}
