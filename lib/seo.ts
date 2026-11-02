import type { Metadata } from "next";
import type { Product, Category } from "@/lib/products";
import type { StoreSettings, PublicStore } from "@/lib/store-types";
import { socialLinks } from "@/lib/social-links";

export const SITE_URL = "https://bindyclothing.com.au";
export const DEFAULT_DESCRIPTION = "Discover BINDY Clothing: dresses, tops, blouses, skirts, trousers and matching sets. A wardrobe inspired by Sri Lanka and Australian everyday living.";
export const CATEGORY_PAGES: Record<string, { name: Category; title: string; description: string }> = {
  dresses: { name: "Dresses", title: "Women's Dresses", description: "Explore BINDY midi, maxi and everyday dresses. See each dress in detail, compare available Australian sizes and read fabric and care information." },
  "tops-and-blouses": { name: "Tops & Blouses", title: "Women's Tops, Shirts & Blouses", description: "Find BINDY tops, camisoles, shirts and blouses to style your way. Shop separate pieces and check the product details for sizes, fabric and what is included." },
  "skirts-and-pants": { name: "Skirts & Pants", title: "Women's Skirts, Trousers & Shorts", description: "Explore BINDY skirts, wide-leg trousers and shorts. Outfit photos offer styling ideas; each product page explains exactly which garment is included." },
  "two-piece-sets": { name: "Two Piece Sets", title: "Women's Matching Two-Piece Sets", description: "Discover BINDY matching two-piece outfits. Compare colours, fabrics and available sizes, and check the included garments before choosing your set." },
};
export function absoluteUrl(path: string) {
  try { return new URL(path, SITE_URL).href; } catch { return SITE_URL; }
}
export function pageMetadata(title: string, description: string, path: string, image = "/images/campaign/blue.webp"): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: "website", siteName: "BINDY Clothing", title: `${title} | BINDY Clothing`, description, url: path, images: [{ url: absoluteUrl(image), alt: title }] },
    twitter: { card: "summary_large_image", title: `${title} | BINDY Clothing`, description, images: [absoluteUrl(image)] },
  };
}
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
export function brandSchema(settings: StoreSettings) {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "OnlineStore", "@id": `${SITE_URL}/#store`, name: settings.storeName, url: SITE_URL, logo: `${SITE_URL}/icon.svg`, description: DEFAULT_DESCRIPTION, email: settings.email, telephone: settings.phone, sameAs: socialLinks(settings).filter(l => l.external).map(l => l.href), areaServed: [{ "@type": "Country", name: "Australia" }, { "@type": "Country", name: "Sri Lanka" }] },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: settings.storeName, publisher: { "@id": `${SITE_URL}/#store` }, inLanguage: "en" },
  ] };
}
export function productSchema(product: Product, store?: PublicStore) {
  // Only an enabled, live AUD checkout can publish merchant offers.
  const canSellAud = store?.settings.acceptingOrders && store.payments?.enabled && store.payments.mode === "live";
  const inStock = Object.values(product.stock || {}).some(n => n > 0);
  return { "@context": "https://schema.org", "@type": "Product", "@id": `${absoluteUrl(`/product/${product.id}`)}#product`, url: absoluteUrl(`/product/${product.id}`), name: product.name, description: product.description, image: Array.from(new Set([product.image, ...product.gallery])).map(absoluteUrl), category: product.category, color: product.colorName, brand: { "@type": "Brand", name: "BINDY Clothing" }, ...(canSellAud ? {offers:{"@type":"Offer",url:absoluteUrl(`/product/${product.id}`),priceCurrency:"AUD",price:product.priceAud,availability:inStock?"https://schema.org/InStock":"https://schema.org/OutOfStock",itemCondition:"https://schema.org/NewCondition",seller:{"@id":`${SITE_URL}/#store`}}} : {}) };
}
export function collectionSchema(name: string, path: string, products: Product[]) {
  return { "@context": "https://schema.org", "@type": "CollectionPage", name, url: absoluteUrl(path), mainEntity: { "@type": "ItemList", numberOfItems: products.length, itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(`/product/${p.id}`) })) } };
}
