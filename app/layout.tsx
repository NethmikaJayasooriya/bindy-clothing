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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FAF7F2] text-[#1F1E1D] overflow-x-hidden selection:bg-[#C5A059] selection:text-white">
        {children}
      </body>
    </html>
  );
}
