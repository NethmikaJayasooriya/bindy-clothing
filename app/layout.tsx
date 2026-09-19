import type { Metadata } from "next";
import { Fraunces, Inter, League_Spartan, Poppins, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
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
  display: "swap",
  variable: "--font-logo",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "BINDY. — Wear Your Calm, Feel Your Story | Luxury Australian-Sri Lankan Fashion",
  description:
    "Two Islands, One Thread. BINDY Clothing crafts thoughtful, limited edition womenswear blending timeless Sri Lankan heritage with modern Australian living.",
  keywords: [
    "BINDY clothing",
    "Australian ethical fashion",
    "Sri Lankan handloom",
    "Origins collection",
    "Linen dresses Australia",
    "Luxury slow fashion",
  ],
  openGraph: {
    title: "BINDY. — Wear Your Calm, Feel Your Story",
    description: "Two Islands, One Thread. Simple pieces. Meaningful moments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${leagueSpartan.variable} ${poppins.variable} ${outfit.variable} ${playfair.variable} antialiased bg-[#FAF7F2] text-[#1F1E1D] overflow-x-hidden selection:bg-[#C5A059] selection:text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
