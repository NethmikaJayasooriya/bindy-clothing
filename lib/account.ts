// Lightweight localStorage-backed mock account system for BINDY Clothing.
// Manages mock user profile, saved addresses, and persistent order history.

import type { CartItem } from "@/lib/cart";

export interface SavedAddress {
  address: string;
  apartment?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface UserAccount {
  name: string;
  email: string;
  phone?: string;
  savedAddress?: SavedAddress;
  memberSince?: string;
}

export interface OrderRecord {
  orderRef: string;
  date: string;
  items: {
    productId: string;
    name: string;
    size: string;
    quantity: number;
    priceAud: number;
    image: string;
  }[];
  itemCount: number;
  total: number;
  shippingAddress?: SavedAddress;
  status?: "Confirmed" | "In Transit" | "Delivered";
}

const ACCOUNT_KEY = "bindy-account";
const ORDERS_KEY = "bindy-orders";
const ACCOUNT_EVENT = "bindy-account-change";
const ORDERS_EVENT = "bindy-orders-change";

// ── ACCOUNT FUNCTIONS ──

export function getAccount(): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as UserAccount) : null;
  } catch {
    return null;
  }
}

export function saveAccount(account: UserAccount): void {
  if (typeof window === "undefined") return;
  try {
    if (!account.memberSince) {
      account.memberSince = new Date().toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      });
    }
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    window.dispatchEvent(new CustomEvent(ACCOUNT_EVENT));
  } catch {
    /* ignore storage errors */
  }
}

export function clearAccount(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACCOUNT_KEY);
    window.dispatchEvent(new CustomEvent(ACCOUNT_EVENT));
  } catch {
    /* ignore */
  }
}

export function subscribeAccount(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(ACCOUNT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(ACCOUNT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// ── ORDER HISTORY FUNCTIONS ──

export function getOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOrders();
    // Avoid duplicate insertions
    if (!existing.some((o) => o.orderRef === order.orderRef)) {
      const updated = [order, ...existing];
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(ORDERS_EVENT));
    }
  } catch {
    /* ignore */
  }
}

export function subscribeOrders(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(ORDERS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(ORDERS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
