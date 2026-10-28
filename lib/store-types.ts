import type { EnrichedProduct } from "@/data/products";

export type ProductStatus = "active" | "draft" | "archived";
export interface StoreProduct extends EnrichedProduct {
  sku: string;
  status: ProductStatus;
  stock: Record<string, number>;
  lowStockThreshold: number;
  compareAtAud: number;
  costAud: number;
  featured: boolean;
  updatedAt: string;
}
export interface Customer {
  id: string; name: string; email: string; phone: string; address: string; notes: string; createdAt: string;
}
export interface OrderLine { productId: string; name: string; image: string; size: string; quantity: number; priceAud: number }
export interface StoreOrder {
  id: string; number: string; customerId: string; customerName: string; email: string; phone: string;
  address: string; items: OrderLine[]; subtotal: number; discount: number; shipping: number; total: number;
  discountCode: string; payment: "unpaid" | "paid" | "refunded";
  fulfillment: "unfulfilled" | "packed" | "shipped" | "delivered" | "cancelled";
  carrier: string; tracking: string; notes: string; createdAt: string; updatedAt: string; requestId: string;
  gateway?: { provider: "payhere"; currency: "AUD"; status: "pending" | "paid" | "failed" | "expired" | "refunded"; paymentId?:string; expiresAt:string };
}
export interface Discount {
  id: string; code: string; type: "percentage" | "fixed" | "shipping"; value: number; minimum: number;
  startsAt: string; endsAt: string; usageLimit: number; used: number; active: boolean;
}
export interface StoreReturn {
  id: string; orderId: string; reason: string; status: "requested" | "approved" | "received" | "closed" | "declined";
  amount: number; restocked: boolean; notes: string; createdAt: string;
}
export interface MediaAsset { id: string; name: string; url: string; bytes: number; createdAt: string }
export interface HeroSlide {
  id: string; name: string; label: string; title: string; italic: string; note: string;
  image: string; alt: string; position: string; mobile: string; link: string; product: string; enabled: boolean;
}
export interface StoreSettings {
  storeName: string; email: string; phone: string; address: string; announcement: string;
  freeShippingThreshold: number; standardShipping: number; expressShipping: number; returnsDays: number;
  instagram: string; orderPrefix: string; lowStockThreshold: number; acceptingOrders: boolean;
}
export interface ContentPage { slug: string; title: string; body: string; published: boolean }
export interface StoreMessage { id: string; name: string; email: string; subject: string; message: string; status: "new" | "resolved"; notes: string; createdAt: string }
export interface Subscriber { id: string; email: string; active: boolean; createdAt: string }
export interface Activity { id: string; description: string; createdAt: string }
export interface Promotion { id:string; title:string; description:string; code:string; link:string; startsAt:string; endsAt:string; published:boolean }
export interface StoreState {
  version: 1; revision: number; products: StoreProduct[]; orders: StoreOrder[]; customers: Customer[];
  discounts: Discount[]; returns: StoreReturn[]; media: MediaAsset[]; hero: HeroSlide[];
  messages: StoreMessage[]; subscribers: Subscriber[];
  pages: ContentPage[]; settings: StoreSettings; activity: Activity[]; updatedAt: string;
  promotions?: Promotion[];
}
export type PublicProduct = EnrichedProduct & { stock?: Record<string, number>; compareAtAud?: number };
export interface PublicStore { products: PublicProduct[]; hero: HeroSlide[]; pages: ContentPage[]; settings: StoreSettings; revision: number; promotions?:Promotion[]; payments?:{enabled:boolean;mode:"sandbox"|"live"} }

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "BINDY Clothing", email: "contact@bindyclothing.com", phone: "", address: "Brisbane, Australia · Colombo, Sri Lanka",
  announcement: "Complimentary AU express shipping on orders $150+", freeShippingThreshold: 150,
  standardShipping: 12, expressShipping: 18, returnsDays: 30, instagram: "", orderPrefix: "BIN", lowStockThreshold: 3, acceptingOrders: false,
};
export const DEFAULT_HERO: HeroSlide[] = [
  { id: "together", name: "Better together", label: "THE REAL LIFE EDIT / 01", title: "The art of", italic: "being you.", note: "Clothes for the moments that make you, you. Thoughtfully made. Beautifully lived in.", image: "/images/bindi-real/campaign-together.webp", alt: "Two friends laughing in BINDY sage and floral pieces in the city", position: "51% 60%", mobile: "50% 61%", link: "/collection", product: "Discover the real life edit", enabled: true },
  { id: "city", name: "Everyday stories", label: "THE EVERYDAY EDIT / 02", title: "Everyday,", italic: "beautifully.", note: "Your favourite blouse. An unhurried coffee. A day that feels entirely your own.", image: "/images/bindi-real/campaign-city.webp", alt: "The Pearl Lace-Trim Blouse on a city afternoon", position: "63% 85%", mobile: "51% 85%", link: "/product/pearl-lace-blouse", product: "Shop the Pearl Lace Blouse", enabled: true },
  { id: "slow-days", name: "Slow afternoons", label: "THE SLOW DAYS EDIT / 03", title: "A softer", italic: "kind of day.", note: "A little less rush. A little more room to breathe. Easy pieces for taking your time.", image: "/images/bindi-real/campaign-slow-days.webp", alt: "The ivory eyelet mini skirt by the water", position: "55% 58%", mobile: "53% 60%", link: "/product/ivory-eyelet-mini-skirt", product: "Shop the Pearl Eyelet Skirt", enabled: true },
  { id: "garden", name: "In full bloom", label: "THE GARDEN EDIT / 04", title: "A moment", italic: "to bloom.", note: "Rose stripes and garden afternoons. Find something that feels a little like you.", image: "/images/bindi-real/campaign-garden.webp", alt: "The rose stripe strapless dress in a garden", position: "63% 54%", mobile: "65% 58%", link: "/product/rose-stripe-strapless-dress", product: "Shop the Rose Stripe Dress", enabled: true },
];
