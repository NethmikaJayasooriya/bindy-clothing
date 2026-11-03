import { pageMetadata, breadcrumbs, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata(
  "About Us · A Family Passion for Clothing",
  "Discover BINDY: creative direction from Australia and garments made in our family-owned Sri Lankan factory, established in 2012. Craftsmanship, care and authenticity.",
  "/about",
  "/images/bindi-real/campaign-together.webp",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "About us", path: "/about" }])} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "About BINDY Clothing", url: `${SITE_URL}/about`, about: { "@id": `${SITE_URL}/#store` } }} />
    {children}
  </>;
}
