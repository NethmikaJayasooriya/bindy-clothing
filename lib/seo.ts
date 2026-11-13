import type { Metadata } from "next";
import type { Product, Category } from "@/lib/products";
import type { StoreSettings, PublicStore } from "@/lib/store-types";
import { socialLinks } from "@/lib/social-links";

export const SITE_URL = "https://bindyclothing.com.au";
export const DEFAULT_DESCRIPTION = "Official online store for BINDY Clothing (also known as Bindy Clothings). Handcrafted artisan women's dresses, linen tops, trousers, and matching sets inspired by Sri Lanka & Australian everyday living.";
export const BRAND_KEYWORDS = [
  "bindy",
  "bindy clothing",
  "bindy clothings",
  "bindy online store",
  "bindy brand",
  "bindy official",
  "bindy australia",
  "bindy sri lanka",
  "bindy dresses",
  "women's clothing australia",
  "handloom fashion",
  "artisan linen dresses",
  "two islands one thread",
];
export const CATEGORY_PAGES: Record<string, { name: Category; title: string; description: string }> = {
  dresses: { name: "Dresses", title: "Women's Dresses", description: "Explore BINDY midi, maxi and everyday dresses. See each dress in detail, compare available Australian sizes and read fabric and care information." },
  "tops-and-blouses": { name: "Tops & Blouses", title: "Women's Tops, Shirts & Blouses", description: "Find BINDY tops, camisoles, shirts and blouses to style your way. Shop separate pieces and check the product details for sizes, fabric and what is included." },
  "skirts-and-pants": { name: "Skirts & Pants", title: "Women's Skirts, Trousers & Shorts", description: "Explore BINDY skirts, wide-leg trousers and shorts. Outfit photos offer styling ideas; each product page explains exactly which garment is included." },
  "two-piece-sets": { name: "Two Piece Sets", title: "Women's Matching Two-Piece Sets", description: "Discover BINDY matching two-piece outfits. Compare colours, fabrics and available sizes, and check the included garments before choosing your set." },
};
export function absoluteUrl(path: string) {
  try { return new URL(path, SITE_URL).href; } catch { return SITE_URL; }
}
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/campaign/blue.webp",
  keywords: string[] = BRAND_KEYWORDS
): Metadata {
  const fullTitle = title.includes("BINDY") ? title : `${title} | BINDY Clothing`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "BINDY Clothing",
      title: fullTitle,
      description,
      url: path,
      images: [{ url: absoluteUrl(image), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
export function brandSchema(settings: StoreSettings) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${SITE_URL}/#store`,
        name: settings.storeName || "BINDY Clothing",
        alternateName: [
          "BINDY",
          "Bindy",
          "Bindy Clothing",
          "Bindy Clothings",
          "bindy.clothing",
          "bindyclothing",
        ],
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/images/bindi-real/campaign-together.webp`,
        description: DEFAULT_DESCRIPTION,
        email: settings.email,
        telephone: settings.phone,
        sameAs: socialLinks(settings).filter((l) => l.external).map((l) => l.href),
        areaServed: [
          { "@type": "Country", name: "Australia" },
          { "@type": "Country", name: "Sri Lanka" },
        ],
        brand: {
          "@type": "Brand",
          name: "BINDY",
          alternateName: ["BINDY Clothing", "Bindy Clothings"],
        },
        knowsAbout: [
          "Women's Clothing",
          "Handloom Dresses",
          "Linen Separates",
          "Two Piece Sets",
          "Resort Wear",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: settings.storeName || "BINDY Clothing",
        alternateName: [
          "BINDY",
          "Bindy",
          "Bindy Clothing",
          "Bindy Clothings",
        ],
        publisher: { "@id": `${SITE_URL}/#store` },
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/collection?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
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
