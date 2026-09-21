/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow production validation without overwriting a running dev server's files.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
