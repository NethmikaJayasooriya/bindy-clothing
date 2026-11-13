import HomePage from "@/components/HomePage";
import { pageMetadata, DEFAULT_DESCRIPTION, BRAND_KEYWORDS } from "@/lib/seo";

export const metadata = pageMetadata(
  "BINDY Clothing · Official Online Store | Women's Fashion Australia & Sri Lanka",
  DEFAULT_DESCRIPTION,
  "/",
  "/images/bindi-real/campaign-together.webp",
  BRAND_KEYWORDS
);

export default function Home() {
  return <HomePage />;
}
