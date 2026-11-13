import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BINDY Clothing",
    short_name: "BINDY",
    description:
      "Official BINDY Clothing online store. Handcrafted artisan women's dresses, linen tops, and matching sets inspired by Sri Lanka and Australian everyday living.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#FAF7F2",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

