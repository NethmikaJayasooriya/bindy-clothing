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
