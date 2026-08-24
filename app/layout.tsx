import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Italiana&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FAF7F2] text-[#1F1E1D] overflow-x-hidden selection:bg-[#C5A059] selection:text-white">
        {children}
      </body>
    </html>
  );
}
