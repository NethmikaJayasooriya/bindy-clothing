// Lightweight localStorage-backed Wishlist / Favorites manager for BINDY Clothing.
import { getCanonicalProductId, getProduct, type Product } from "@/lib/products";

const KEY = "bindy-wishlist";
const EVT = "bindy-wishlist-change";

export function getWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (string | Product)[];
    // Rehydrate full product data to keep in sync with catalog
    const products = parsed
      .map((item) => {
        const id = typeof item === "string" ? item : item.id;
        return getProduct(id) || (typeof item === "object" ? item : null);
      })
      .filter(Boolean) as Product[];
    return products.filter((product, index) => products.findIndex((entry) => entry.id === product.id) === index);
  } catch {
    return [];
  }
}

export function saveWishlist(items: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    const ids = Array.from(new Set(items.map((p) => getCanonicalProductId(p.id))));
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore quota errors */
  }
}

export function isInWishlist(productId: string): boolean {
  if (typeof window === "undefined") return false;
  const items = getWishlist();
  return items.some((p) => p.id === getCanonicalProductId(productId));
}

export function toggleWishlist(product: Product): boolean {
  product = getProduct(product.id) ?? product;
  const items = getWishlist();
  const index = items.findIndex((p) => p.id === product.id);
  let isNowInWishlist = false;

  if (index >= 0) {
    items.splice(index, 1);
    isNowInWishlist = false;
  } else {
    items.push(product);
    isNowInWishlist = true;
  }

  saveWishlist(items);
  return isNowInWishlist;
}

export function addToWishlist(product: Product): void {
  product = getProduct(product.id) ?? product;
  const items = getWishlist();
  if (!items.some((p) => p.id === product.id)) {
    items.push(product);
    saveWishlist(items);
  }
}

export function removeFromWishlist(productId: string): void {
  const items = getWishlist();
  const filtered = items.filter((p) => p.id !== getCanonicalProductId(productId));
  saveWishlist(filtered);
}

export function clearWishlist(): void {
  saveWishlist([]);
}

export function subscribeWishlist(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
