import type { Product } from "@/lib/products";

export const CONSENT_KEY = "bindy-analytics-consent-v1";
export const ANALYTICS_EVENT = "bindy-analytics-event";
export const PREFERENCES_EVENT = "bindy-cookie-preferences";
export const measurementId = (value: unknown) => typeof value === "string" && /^G-[A-Z0-9]{4,20}$/.test(value) ? value : "";
export const verificationToken = (value: unknown) => typeof value === "string" && /^[A-Za-z0-9_-]{10,160}$/.test(value) ? value : "";
export function analyticsAllowedPath(path: string) {
  return path === "/" || /^\/(collection(?:\/[a-z0-9-]+)?|product\/[a-z0-9-]+|about|craft|size-guide|contact|faq|shopping(?:\/(?:australia|sri-lanka))?|pages\/[a-z0-9-]+)\/?$/.test(path);
}
export function analyticsItem(product: Product, quantity = 1, size?: string) {
  return { item_id: product.id, item_name: product.name, item_category: product.category, item_brand: "BINDY Clothing", item_variant: size, price: product.priceAud, quantity };
}
type EventName = "view_item" | "add_to_cart" | "view_cart" | "begin_checkout";
export function trackCommerce(name: EventName, lines: { product: Product; quantity: number; size?: string }[]) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "granted") return;
    const items = lines.slice(0, 50).map(l => analyticsItem(l.product, l.quantity, l.size));
    window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: { name, params: { currency: "AUD", value: items.reduce((n, l) => n + l.price * l.quantity, 0), items } } }));
  } catch { /* Consent storage can be unavailable. */ }
}
