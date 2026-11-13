/**
 * Robust Inventory & Size Stock Helpers
 * Normalizes size matching across AU sizing conventions ("AU 6 (XS)", "AU 6", "6").
 */

export function getStockForSize(stock: Record<string, number> | undefined | null, sizeStr: string): number {
  if (!stock) return Number.POSITIVE_INFINITY;
  if (stock[sizeStr] !== undefined) return stock[sizeStr];

  // Try matching by numeric size (e.g. "AU 6 (XS)" <-> "AU 6" <-> "6")
  const sizeDigits = sizeStr.replace(/[^\d]/g, "");
  if (sizeDigits !== "") {
    for (const [key, qty] of Object.entries(stock)) {
      if (key.replace(/[^\d]/g, "") === sizeDigits) {
        return qty;
      }
    }
  }

  // Try matching by trimmed case-insensitive name (e.g. "One Size", "S", "M")
  const normalizedSearch = sizeStr.trim().toLowerCase();
  for (const [key, qty] of Object.entries(stock)) {
    if (key.trim().toLowerCase() === normalizedSearch) {
      return qty;
    }
  }

  return 1;
}

export function isSizeSoldOut(stock: Record<string, number> | undefined | null, sizeStr: string): boolean {
  if (!stock) return false;
  return getStockForSize(stock, sizeStr) === 0;
}

export function isProductSoldOut(product: { sizes?: string[]; stock?: Record<string, number>; inventoryStatus?: string }): boolean {
  if (product.inventoryStatus === "sold_out") return true;
  if (!product.sizes || product.sizes.length === 0) {
    if (product.stock) {
      const vals = Object.values(product.stock);
      return vals.length > 0 && vals.every((v) => v === 0);
    }
    return false;
  }
  return product.sizes.every((sz) => isSizeSoldOut(product.stock, sz));
}

export function getFirstAvailableSize(product: { sizes: string[]; stock?: Record<string, number> }): string | null {
  if (!product.sizes || product.sizes.length === 0) return null;
  return product.sizes.find((sz) => !isSizeSoldOut(product.stock, sz)) || product.sizes[0] || null;
}

