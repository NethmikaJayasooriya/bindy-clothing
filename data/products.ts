/**
 * BINDY Clothing — Central Product Data Layer
 * Seed data structured for easy future swap with headless commerce backends (Shopify, Sanity, Swell).
 */

import { PRODUCTS as RAW_PRODUCTS, type Product as BaseProduct, type Review, type Category, type Destination } from "@/lib/products";

export type { Product, Review, Category, Destination } from "@/lib/products";

export interface EnrichedProduct extends BaseProduct {
  inventoryStatus?: "in_stock" | "low_stock" | "sold_out";
  inventoryCount?: number;
  badge?: "NEW" | "LIMITED EDITION" | "BEST SELLER" | "ARCHIVE";
  weightGsm?: number;
  originDistrict?: string;
  parentCategory: "Tops" | "Bottoms" | "Dresses" | "Resort Wear";
  subCategory: string;
  collectionName: "Serendipity" | "Collection 02";
  occasions: string[];
}

// Taxonomy mapping for client-specified hierarchy
const TAXONOMY_MAP: Record<
  string,
  {
    parent: "Tops" | "Bottoms" | "Dresses" | "Resort Wear";
    sub: string;
    occasions: string[];
  }
> = {
  "lotus-memory-dress": {
    parent: "Dresses",
    sub: "Linen",
    occasions: ["Everyday Calm", "Garden & High Tea"],
  },
  "cinnamon-flow-skirt": {
    parent: "Bottoms",
    sub: "Skirts",
    occasions: ["Everyday Calm", "Beach & Coast"],
  },
  "pettah-check-dress": {
    parent: "Dresses",
    sub: "Casual",
    occasions: ["Everyday Calm", "Evening & Party"],
  },
  "ocean-embraced-tiered-dress": {
    parent: "Dresses",
    sub: "Maxi",
    occasions: ["Beach & Coast", "Resort Wear"],
  },
  "serendib-pearl-dress": {
    parent: "Dresses",
    sub: "Formal",
    occasions: ["Evening & Party", "Garden & High Tea"],
  },
  "shore-traces-blouse": {
    parent: "Tops",
    sub: "Blouses & Shirts",
    occasions: ["Everyday Calm", "Beach & Coast"],
  },
  "celestial-terracotta-skirt": {
    parent: "Bottoms",
    sub: "Skirts",
    occasions: ["Evening & Party", "Everyday Calm"],
  },
  "tea-leaf-two-piece": {
    parent: "Resort Wear",
    sub: "Crop Tops",
    occasions: ["Beach & Coast", "Resort Wear", "Garden & High Tea"],
  },
  // Collection 02 Pieces
  "golden-cascade-dress": {
    parent: "Dresses",
    sub: "Casual",
    occasions: ["Everyday Calm", "Garden & High Tea"],
  },
  "beyond-garden-wall-peplum": {
    parent: "Tops",
    sub: "Crop Tops",
    occasions: ["Everyday Calm", "Evening & Party"],
  },
  "desert-rose-set": {
    parent: "Resort Wear",
    sub: "Skirts",
    occasions: ["Everyday Calm", "Beach & Coast"],
  },
  "sunset-stroll-set": {
    parent: "Resort Wear",
    sub: "Crop Tops",
    occasions: ["Beach & Coast", "Evening & Party"],
  },
  "sweet-breeze-dress": {
    parent: "Dresses",
    sub: "Floral",
    occasions: ["Everyday Calm", "Garden & High Tea"],
  },
  "terra-essence-set": {
    parent: "Resort Wear",
    sub: "Crop Tops",
    occasions: ["Everyday Calm", "Garden & High Tea"],
  },
  "crimson-lotus-dress": {
    parent: "Dresses",
    sub: "Maxi",
    occasions: ["Evening & Party", "Garden & High Tea"],
  },
  "midnight-bloom-set": {
    parent: "Resort Wear",
    sub: "Crop Tops",
    occasions: ["Evening & Party"],
  },
  "tropic-lagoon-dress": {
    parent: "Dresses",
    sub: "Maxi",
    occasions: ["Beach & Coast", "Everyday Calm"],
  },
};

const COLLECTION_02_IDS = new Set([
  "golden-cascade-dress",
  "beyond-garden-wall-peplum",
  "desert-rose-set",
  "sunset-stroll-set",
  "sweet-breeze-dress",
  "terra-essence-set",
  "crimson-lotus-dress",
  "midnight-bloom-set",
  "tropic-lagoon-dress",
]);

// Enrich each product with realistic luxury stock, origin, and taxonomy data
export const PRODUCTS: EnrichedProduct[] = RAW_PRODUCTS.map((p, idx) => {
  const stockStatuses: ("in_stock" | "low_stock" | "in_stock")[] = ["in_stock", "low_stock", "in_stock"];
  const inventoryCounts = [14, 2, 8, 19, 3, 11, 4, 16, 12, 7, 5, 18, 9, 6, 11, 4, 15];
  const isCol2 = COLLECTION_02_IDS.has(p.id);

  const col2Badges: ("NEW" | "LIMITED EDITION")[] = [
    "NEW",
    "NEW",
    "LIMITED EDITION",
    "NEW",
    "NEW",
    "LIMITED EDITION",
    "NEW",
    "LIMITED EDITION",
    "NEW",
  ];

  const badges: ("NEW" | "LIMITED EDITION" | "BEST SELLER" | undefined)[] = [
    "BEST SELLER",
    "LIMITED EDITION",
    "NEW",
    undefined,
    "LIMITED EDITION",
    undefined,
    "NEW",
    "BEST SELLER",
  ];

  const origins = [
    "Gampaha Handloom Village, Western Province",
    "Mannar Coastal Weaving Guild, Northern Province",
    "Pettah Heritage Quarter, Colombo",
    "Matale Natural Dye Workshop, Central Province",
    "Ella Foothill Linen Looms, Uva Province",
    "Galle Fort Textile Atelier, Southern Province",
    "Kandy Handloom Cooperative, Central Province",
    "Dambulla Voile Weavers, Central Province",
    "Kelaniya Clay & Loom Atelier, Western Province",
    "Matara Coastal Verandah Looms, Southern Province",
    "Hikkaduwa Marine Dye Guild, Southern Province",
  ];

  const taxonomy = TAXONOMY_MAP[p.id] || {
    parent: p.category.includes("Dress") ? "Dresses" : p.category.includes("Top") ? "Tops" : "Bottoms",
    sub: "Linen",
    occasions: ["Everyday Calm"],
  };

  const badge = isCol2
    ? col2Badges[idx % col2Badges.length]
    : badges[idx % badges.length];

  return {
    ...p,
    inventoryStatus: stockStatuses[idx % stockStatuses.length],
    inventoryCount: inventoryCounts[idx % inventoryCounts.length],
    badge,
    weightGsm: 110 + (idx * 20),
    originDistrict: origins[idx % origins.length],
    parentCategory: taxonomy.parent,
    subCategory: taxonomy.sub,
    collectionName: isCol2 ? "Collection 02" : "Serendipity",
    occasions: taxonomy.occasions,
  };
});

export function getProduct(slug: string): EnrichedProduct | undefined {
  return PRODUCTS.find((p) => p.id === slug);
}

export function getProductsByCategory(category: Category | "All"): EnrichedProduct[] {
  if (category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsByTaxonomy(
  parentCategory?: string,
  subCategory?: string,
  occasion?: string
): EnrichedProduct[] {
  return PRODUCTS.filter((p) => {
    if (parentCategory && parentCategory !== "All" && p.parentCategory !== parentCategory) return false;
    if (subCategory && subCategory !== "All" && p.subCategory !== subCategory) return false;
    if (occasion && occasion !== "All" && !p.occasions.includes(occasion)) return false;
    return true;
  });
}

export function getProductsByDestination(destination: Destination | "All"): EnrichedProduct[] {
  if (destination === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.destinations.includes(destination));
}

export function getFeaturedSpotlightProducts(): EnrichedProduct[] {
  const spotlightIds = ["lotus-memory-dress", "cinnamon-flow-skirt", "pettah-check-dress"];
  return spotlightIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as EnrichedProduct[];
}

export { CATEGORIES, DESTINATIONS, getAverageRating, getStoreReviewsAggregate } from "@/lib/products";

