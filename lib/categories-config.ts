export const KNOWN_CATEGORY_SLUGS = new Set<string>([
  "dresses",
  "tops-and-blouses",
  "skirts-and-pants",
  "two-piece-sets"
]);

export function registerCategorySlug(slug: string) {
  if (slug && typeof slug === "string") {
    KNOWN_CATEGORY_SLUGS.add(slug.toLowerCase().trim());
  }
}

export function unregisterCategorySlug(slug: string) {
  if (slug && !["dresses", "tops-and-blouses", "skirts-and-pants", "two-piece-sets"].includes(slug)) {
    KNOWN_CATEGORY_SLUGS.delete(slug.toLowerCase().trim());
  }
}

export function isKnownCategorySlug(slug: string): boolean {
  return KNOWN_CATEGORY_SLUGS.has(slug.toLowerCase().trim());
}

