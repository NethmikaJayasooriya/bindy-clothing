import { NextResponse, type NextRequest } from "next/server";
import { isRetiredProduct } from "@/lib/retired-products";
import { isKnownCategorySlug } from "@/lib/categories-config";

// Fast, static checks happen before a loading boundary can send a 200 response.
// Do not fetch the catalogue or private order data in this request layer.
export function proxy(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const invalidCategory = parts[0] === "collection" && parts.length > 1 && (!isKnownCategorySlug(parts[1]) || parts.length !== 2);
  const invalidRegion = parts[0] === "shopping" && parts.length > 1 && (!["australia", "sri-lanka"].includes(parts[1]) || parts.length !== 2);
  const retired = parts[0] === "product" && isRetiredProduct(parts[1] || "");
  if (invalidCategory || invalidRegion || retired) {
    return new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Piece not found | BINDY Clothing</title><link rel="icon" href="/icon.svg"></head><body style="margin:0;background:#faf7f2;color:#27241f;font-family:Georgia,serif"><main style="max-width:680px;margin:auto;padding:15vh 24px"><a href="/" style="color:inherit;font:700 32px Arial,sans-serif;text-decoration:none">bindy.</a><p style="margin-top:64px;font:11px Arial,sans-serif;letter-spacing:2px;color:#8e6e34">A DIFFERENT DIRECTION</p><h1 style="font-size:clamp(36px,7vw,60px);font-weight:400;line-height:1.1">This piece isn't here.</h1><p style="font:15px/1.9 Arial,sans-serif;max-width:440px">The page may have moved, or the garment may no longer be available. Explore the current collection to find your next favourite.</p><a href="/collection" style="display:inline-block;margin-top:24px;padding:16px 24px;background:#292720;color:#fff;border-radius:30px;font:12px Arial,sans-serif;text-decoration:none">Explore the collection ↗</a></main></body></html>`, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, follow",
        "Cache-Control": "public, max-age=300"
      }
    });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/collection/:path*", "/shopping/:path*", "/product/:path*"] };

