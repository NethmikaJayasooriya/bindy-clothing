import retiredImages from "@/data/retired-product-images.json";

// Also handles old carts, saved admin records and links from before the photo cleanup.
export function currentImageSource(src: string): string {
  return (retiredImages as Record<string, string>)[src] ?? src;
}

type ProductMedia = {
  image: string; imageHover: string; gallery: string[];
  galleryZoom?: string[]; galleryLabels?: string[];
  reviews?: { photos?: string[] }[];
};

export function cleanProductMedia<T extends ProductMedia>(product: T): T {
  const indices: number[] = [];
  const seen = new Set<string>();
  const gallery = product.gallery.map(currentImageSource).filter((src, i) => {
    if (seen.has(src)) return false;
    seen.add(src); indices.push(i); return true;
  });
  return {
    ...product, image: currentImageSource(product.image), imageHover: currentImageSource(product.imageHover), gallery,
    ...(product.galleryZoom ? { galleryZoom: indices.map(i => currentImageSource(product.galleryZoom?.[i] ?? product.gallery[i])) } : {}),
    ...(product.galleryLabels ? { galleryLabels: indices.map(i => product.galleryLabels?.[i] ?? `View ${i + 1}`) } : {}),
    // Seeded testimonials have no verified order source. Keep them unpublished.
    ...(product.reviews ? {reviews:[]} : {}),
  };
}
