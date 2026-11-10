import type { EnrichedProduct } from "@/data/products";
import type { HomeDiscovery } from "./home-discovery";
import { DEFAULT_SOCIALS, DEFAULT_CONTACT_EMAIL } from "./social-links";

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
export interface OrderLine { productId: string; name: string; image: string; size: string; quantity: number; priceAud: number; unitPrice?: number }
export interface StoreOrder {
  id: string; number: string; customerId: string; customerName: string; email: string; phone: string;
  address: string; items: OrderLine[]; subtotal: number; discount: number; shipping: number; total: number;
  discountCode: string; payment: "unpaid" | "paid" | "refunded";
  fulfillment: "unfulfilled" | "packed" | "shipped" | "delivered" | "cancelled";
  carrier: string; tracking: string; notes: string; createdAt: string; updatedAt: string; requestId: string;
  gateway?: { provider: "payhere"; currency: "AUD"; status: "pending" | "paid" | "failed" | "expired" | "refunded"; paymentId?:string; expiresAt:string };
  paymentMethod?: "cod"; currency?: "AUD" | "LKR"; testMode?: boolean; requestFingerprint?: string;
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
  tracking?: {ga4Id: string; searchConsoleToken: string};
  storeName: string; email: string; phone: string; address: string; announcement: string;
  freeShippingThreshold: number; standardShipping: number; expressShipping: number; returnsDays: number;
  instagram: string; facebook?: string; tiktok?: string; orderPrefix: string; lowStockThreshold: number; acceptingOrders: boolean;
  cod?: { enabled: boolean; testMode: boolean; demoMultiplier: number; shippingLkr: number };
}
export interface ContentPage { slug: string; title: string; body: string; published: boolean }
export interface StoreMessage { id: string; name: string; email: string; subject: string; message: string; status: "new" | "resolved"; notes: string; createdAt: string }
export interface Subscriber { id: string; email: string; active: boolean; createdAt: string }
export interface Activity { id: string; description: string; createdAt: string }
export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories: string[];
  sortOrder: number;
  status: "active" | "hidden";
}
export interface Promotion { id:string; title:string; description:string; code:string; link:string; startsAt:string; endsAt:string; published:boolean }
export interface HomeSection {
  published: boolean; eyebrow: string; title: string; description: string; productIds: string[];
}
export interface HomepageContent { spotlight: HomeSection; shopTheLook: HomeSection; newsletter: HomeSection }
export const DEFAULT_HOMEPAGE: HomepageContent = {
  spotlight: { published: false, eyebrow: "", title: "", description: "", productIds: [] },
  shopTheLook: { published: false, eyebrow: "", title: "", description: "", productIds: [] },
  newsletter: { published: false, eyebrow: "", title: "", description: "", productIds: [] },
};
export interface StoreState {
  version: 1; revision: number; products: StoreProduct[]; orders: StoreOrder[]; customers: Customer[];
  discounts: Discount[]; returns: StoreReturn[]; media: MediaAsset[]; hero: HeroSlide[];
  messages: StoreMessage[]; subscribers: Subscriber[];
  pages: ContentPage[]; settings: StoreSettings; activity: Activity[]; updatedAt: string;
  categories?: StoreCategory[];
  promotions?: Promotion[];
  homepage?: HomepageContent;
  discovery?: HomeDiscovery;
}
export type PublicProduct = EnrichedProduct & { stock?: Record<string, number>; compareAtAud?: number };
export interface PublicStore { products: PublicProduct[]; hero: HeroSlide[]; pages: ContentPage[]; settings: StoreSettings; revision: number; categories?: StoreCategory[]; promotions?:Promotion[]; homepage?:HomepageContent; discovery?:HomeDiscovery; payments?:{enabled:boolean;mode:"sandbox"|"live";cod?:StoreSettings["cod"]} }

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "BINDY Clothing", email: DEFAULT_CONTACT_EMAIL, phone: "0766655550", address: "Brisbane, Australia · Colombo, Sri Lanka",
  announcement: "Complimentary AU express shipping on orders $150+", freeShippingThreshold: 150,
  standardShipping: 12, expressShipping: 18, returnsDays: 30, ...DEFAULT_SOCIALS, orderPrefix: "BIN", lowStockThreshold: 3, acceptingOrders: false,
};
export const DEFAULT_HERO: HeroSlide[] = [
  { id: "together", name: "Better together", label: "THE REAL LIFE EDIT / 01", title: "The art of", italic: "being you.", note: "Clothes for the moments that make you, you. Thoughtfully made. Beautifully lived in.", image: "/images/bindi-real/campaign-together.webp", alt: "Two friends laughing in BINDY sage and floral pieces in the city", position: "51% 60%", mobile: "50% 61%", link: "/collection", product: "Discover the real life edit", enabled: true },
  { id: "city", name: "Everyday stories", label: "THE EVERYDAY EDIT / 02", title: "Everyday,", italic: "beautifully.", note: "Your favourite blouse. An unhurried coffee. A day that feels entirely your own.", image: "/images/bindi-real/campaign-city.webp", alt: "The Pearl Lace-Trim Blouse on a city afternoon", position: "63% 85%", mobile: "51% 85%", link: "/product/pearl-lace-blouse", product: "Shop the Pearl Lace Blouse", enabled: true },
  { id: "blue", name: "Embraced by blue", label: "THE BLUE EDIT / 03", title: "Days in", italic: "a softer blue.", note: "Easy layers, open skies and a little room to wander.", image: "/images/campaign/blue.webp", alt: "A blue tiered shirt dress beside a sunlit coastal wall", position: "50% 50%", mobile: "50% 50%", link: "/product/ocean-embraced-tiered-dress", product: "Explore the blue edit", enabled: true },
  { id: "coast", name: "By the coast", label: "THE COASTAL EDIT / 04", title: "A little", italic: "closer to calm.", note: "Light textures and gentle movement. Made for unhurried days.", image: "/images/campaign/coast.webp", alt: "An ivory crochet top and flowing skirt on a calm beach", position: "60% 50%", mobile: "60% 50%", link: "/collection", product: "Explore the coastal edit", enabled: true },
  { id: "highlands", name: "In the highlands", label: "THE HIGHLANDS EDIT / 05", title: "Naturally", italic: "in your element.", note: "Soft olive linen, fresh air and moments to make your own.", image: "/images/campaign/highlands.webp", alt: "An olive two-piece outfit in misty green tea hills", position: "60% 50%", mobile: "60% 50%", link: "/product/tea-leaf-two-piece", product: "Explore the olive linen set", enabled: true },
];

export const DEFAULT_CATEGORIES: StoreCategory[] = [
  {
    id: "cat-dresses",
    name: "Dresses",
    slug: "dresses",
    description: "Effortless day-to-evening maxi, midi, and slip silhouettes.",
    image: "/images/categories/dresses-v1.webp",
    subcategories: ["Maxi Dresses", "Midi Dresses", "Slip Dresses", "Shirt Dresses"],
    sortOrder: 1,
    status: "active"
  },
  {
    id: "cat-tops-blouses",
    name: "Tops & Blouses",
    slug: "tops-and-blouses",
    description: "Artisanal cotton lace, linen button-downs, and tailored corsets.",
    image: "/images/categories/tops-blouses-v1.webp",
    subcategories: ["Blouses & Shirts", "Corset Tops", "Camisoles", "Lace Tops"],
    sortOrder: 2,
    status: "active"
  },
  {
    id: "cat-two-piece-sets",
    name: "Two Piece Sets",
    slug: "two-piece-sets",
    description: "Curated matching separates crafted in breathable natural fibers.",
    image: "/images/categories/two-piece-sets-v1.webp",
    subcategories: ["Linen Co-ords", "Top & Skirt Sets", "Resort Sets"],
    sortOrder: 3,
    status: "active"
  },
  {
    id: "cat-skirts-pants",
    name: "Skirts & Pants",
    slug: "skirts-and-pants",
    description: "Flowing tiered maxis, tailored trousers, and relaxed culottes.",
    image: "/images/categories/skirts-pants-v1.webp",
    subcategories: ["Tiered Maxi Skirts", "Tailored Trousers", "Linen Pants"],
    sortOrder: 4,
    status: "active"
  }
];
