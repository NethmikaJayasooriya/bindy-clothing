/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow production validation without overwriting a running dev server's files.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/tryon": ["./data/tryon-references/**/*", "./public/images/style-studio/bindy-fit-model.png", "./public/images/tryon-v3/**/*"],
    "/api/admin/tryon": ["./data/tryon-references/**/*"],
  },
  outputFileTracingExcludes: {
    "/api/{tryon,admin/tryon}": ["./public/!(images)/**/*", "./public/images/!(style-studio|tryon-v3)/**/*", "./.store*/**/*", "./output/**/*", "./assets/**/*", "./Bindi/**/*"],
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects(){return [{source:"/product/lotus-memory-dress",destination:"/product/rose-stripe-strapless-dress",permanent:true},{source:"/:path*",has:[{type:"host",value:"www.bindyclothing.com.au"}],destination:"https://bindyclothing.com.au/:path*",permanent:true},{source:"/test",destination:"/",permanent:true}];},
  async headers() {
    return [
      {source:"/:path*",has:[{type:"host",value:"(?<preview>.+)\\.vercel\\.app"}],headers:[{key:"X-Robots-Tag",value:"noindex, nofollow"}]},
      {source:"/:path*",has:[{type:"host",value:"localhost(?::[0-9]+)?"}],headers:[{key:"X-Robots-Tag",value:"noindex, nofollow"}]},
      ...["/checkout/:path*","/account/:path*","/returns/start/:path*"].map(source=>({source,headers:[{key:"Cache-Control",value:"no-store"},{key:"X-Robots-Tag",value:"noindex, nofollow"}]})),
      {source:"/api/:path*",headers:[{key:"Cache-Control",value:"no-store"},{key:"X-Robots-Tag",value:"noindex, nofollow"}]},
      {source:"/admin/:path*",headers:[{key:"Cache-Control",value:"no-store"},{key:"X-Robots-Tag",value:"noindex, nofollow"}]},
      {source:"/payment/:path*",headers:[{key:"Referrer-Policy",value:"no-referrer"},{key:"Cache-Control",value:"no-store"},{key:"X-Robots-Tag",value:"noindex, nofollow"}]},
      { source: "/images/optimized/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://www.google-analytics.com https://region1.google-analytics.com",
              `connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com${process.env.NODE_ENV === "development" ? " ws: wss:" : ""}`,
              "frame-src 'none'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "form-action 'self' https://www.payhere.lk https://sandbox.payhere.lk",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
