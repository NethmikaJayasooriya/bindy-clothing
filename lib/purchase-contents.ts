import type { Product } from "@/lib/products";

// Derived from the actual listing, so changing its category in admin also updates
// the purchase disclosure. A styled photograph never changes what is included.
export function purchaseContents(product: Pick<Product, "name" | "category">) {
  if (product.category === "Two Piece Sets") return {
    label: "Full two-piece set", detail: "Includes both the top and matching bottom. The displayed price is for the complete two-piece set.",
  };
  if (product.category === "Skirts & Pants") {
    const garment = /\b(trousers?|pants)\b/i.test(product.name) ? "Trousers" : /\bshorts\b/i.test(product.name) ? "Shorts" : "Skirt";
    return { label: `${garment} only`, detail: `Includes the ${garment.toLowerCase()} only. The top shown is for styling and is sold separately. The displayed price is for one garment, not the full outfit.` };
  }
  if (product.category === "Tops & Blouses") return {
    label: "Top only", detail: "Includes the top only. The bottom shown is for styling and is sold separately. The displayed price is for one garment, not the full outfit.",
  };
  return null;
}
