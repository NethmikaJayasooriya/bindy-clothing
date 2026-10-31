import type { Category } from "@/data/products";

export const DISCOVERY_CATEGORIES: Category[] = ["Tops & Blouses", "Dresses", "Two Piece Sets", "Skirts & Pants"];
export interface DiscoveryFeature { title: string; label: string; image: string; alt: string; category: Category; action: string }
export interface DiscoveryCategory { category: Category; image: string; alt: string }
export interface HomeDiscovery {
  featuresEnabled: boolean;
  heading: string;
  features: DiscoveryFeature[];
  categoryHeading: string;
  categories: DiscoveryCategory[];
  mission: { enabled: boolean; label: string; title: string; body: string };
}
export const DEFAULT_DISCOVERY: HomeDiscovery = {
  featuresEnabled: true,
  heading: "A wardrobe for being you.",
  features: [
    { label: "THE EVERYDAY DRESS EDIT", title: "Make a day of it.", image: "/images/discovery/dress-edit.webp", alt: "A full-length rose stripe dress in a sunlit courtyard", category: "Dresses", action: "Discover dresses" },
    { label: "A LITTLE MIX. A LITTLE MATCH.", title: "Your way looks good.", image: "/images/discovery/separates-edit.webp", alt: "A floral camisole styled with relaxed ivory trousers", category: "Tops & Blouses", action: "Explore separates" },
  ],
  categoryHeading: "Shop the wardrobe your way.",
  categories: [
    { category: "Tops & Blouses", image: "/images/discovery/tops.webp", alt: "A full-length outfit featuring the white lace-trim blouse" },
    { category: "Dresses", image: "/images/discovery/dresses.webp", alt: "The sage shirt maxi dress shown from head to toe" },
    { category: "Two Piece Sets", image: "/images/discovery/sets.webp", alt: "An olive top and flowing skirt worn together in the tea hills" },
    { category: "Skirts & Pants", image: "/images/discovery/bottoms.webp", alt: "An ivory tiered maxi skirt shown in a full-length outfit" },
  ],
  mission: {
    enabled: true, label: "TWO ISLANDS. ONE THREAD.", title: "Made to feel like you.",
    body: "Our goal is simple: to make getting dressed feel a little more like you. Pieces to wear together, apart, and on repeat — through the everyday and everything in between.",
  },
};

export function publicDiscovery(value?: HomeDiscovery): HomeDiscovery {
  const result = structuredClone(value ?? DEFAULT_DISCOVERY);
  if (!result.featuresEnabled) { result.heading = ""; result.features = []; }
  if (!result.mission.enabled) result.mission = { enabled: false, label: "", title: "", body: "" };
  return result;
}
