import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, League_Spartan, Poppins, Outfit, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import NavigationFeedback from "@/components/NavigationFeedback";
import { readPublicStore } from "@/lib/server/store-repository";
import { StorefrontProvider } from "@/components/StorefrontProvider";
import { CurrencyProvider } from "@/components/CurrencyContext";
import SocialRail from "@/components/SocialRail";
import JsonLd from "@/components/JsonLd";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { SITE_URL, DEFAULT_DESCRIPTION, brandSchema, BRAND_KEYWORDS } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-logo",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-cormorant",
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FAF7F2",
};

export async function generateMetadata(): Promise<Metadata> {
  const store = await readPublicStore();
  const token = store.settings.tracking?.searchConsoleToken;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "BINDY Clothing · Official Store | Women's Fashion Australia & Sri Lanka",
      template: "%s | BINDY Clothing",
    },
    description: DEFAULT_DESCRIPTION,
    keywords: BRAND_KEYWORDS,
    applicationName: "BINDY Clothing",
    authors: [{ name: "BINDY Clothing", url: SITE_URL }],
    creator: "BINDY Clothing",
    publisher: "BINDY Clothing",
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: SITE_URL,
      siteName: "BINDY Clothing",
      title: "BINDY Clothing · Official Store | Women's Fashion Australia & Sri Lanka",
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: `${SITE_URL}/images/bindi-real/campaign-together.webp`,
          width: 1200,
          height: 630,
          alt: "BINDY Clothing — Handloom Women's Fashion Australia & Sri Lanka",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "BINDY Clothing · Official Store",
      description: DEFAULT_DESCRIPTION,
      images: [`${SITE_URL}/images/bindi-real/campaign-together.webp`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(token && /^[A-Za-z0-9_-]{10,160}$/.test(token)
      ? { verification: { google: token } }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialStore;
  try {
    initialStore = await readPublicStore();
  } catch (err) {
    console.warn("[layout] Could not load initial store, using fallback:", err);
  }

  return (
    <html lang="en">
      <body
        // Browser extensions can add body attributes before hydration (for
        // example cz-shortcut-listen). Keep child hydration checks enabled.
        suppressHydrationWarning
        className={`${inter.variable} ${fraunces.variable} ${leagueSpartan.variable} ${poppins.variable} ${outfit.variable} ${playfair.variable} ${cormorant.variable} antialiased bg-[#FAF7F2] text-[#1F1E1D] overflow-x-hidden selection:bg-[#C5A059] selection:text-white font-sans`}
      >
        <StorefrontProvider initial={initialStore}><CurrencyProvider>{initialStore&&<JsonLd data={brandSchema(initialStore.settings)}/>}<NavigationFeedback/>{children}<SocialRail/><AnalyticsConsent/></CurrencyProvider></StorefrontProvider>
      </body>
    </html>
  );
}
