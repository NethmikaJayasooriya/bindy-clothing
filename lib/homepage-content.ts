import { DEFAULT_HOMEPAGE, type HomepageContent, type PublicProduct } from "./store-types";

// Draft copy and unavailable products must never leak into the public storefront.
export function publishedHomepage(homepage: HomepageContent | undefined, activeIds: Set<string>): HomepageContent {
  const result = structuredClone(DEFAULT_HOMEPAGE);
  for (const key of ["spotlight", "shopTheLook", "newsletter"] as const) {
    const section = homepage?.[key];
    if (!section?.published || !section.title.trim()) continue;
    const productIds = [...new Set(section.productIds)].filter(id => activeIds.has(id));
    if (key !== "newsletter" && productIds.length < (key === "shopTheLook" ? 2 : 1)) continue;
    result[key] = { ...section, productIds };
  }
  return result;
}

export function homepageProducts(ids: string[], products: PublicProduct[]) {
  return ids.map(id => products.find(product => product.id === id)).filter((p): p is PublicProduct => Boolean(p));
}
