// Tiny localStorage-backed cart shared between the homepage and product pages.
import type { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

const KEY = "bindy-cart";
const EVT = "bindy-cart-change";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore quota / serialisation errors */
  }
}

export function addToCart(product: Product, size: string, qty = 1): CartItem[] {
  const items = getCart();
  const existing = items.find(
    (i) => i.product.id === product.id && i.size === size
  );
  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({ product, size, quantity: qty });
  }
  saveCart(items);
  return items;
}

export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}

export function clearCart(): void {
  saveCart([]);
}

const BUY_NOW_KEY = "bindy-buy-now-item";

export function setBuyNowItem(product: Product, size: string, quantity = 1): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify({ product, size, quantity }));
  } catch {
    /* ignore */
  }
}

export function getBuyNowItem(): CartItem | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(BUY_NOW_KEY);
    return raw ? (JSON.parse(raw) as CartItem) : null;
  } catch {
    return null;
  }
}

export function clearBuyNowItem(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(BUY_NOW_KEY);
  } catch {
    /* ignore */
  }
}
