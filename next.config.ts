import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages usually hosts on teamriflemig.github.io/Telegram-Express/
  // So we need to set the base path so assets load correctly.
  basePath: '/Telegram-Express',
  assetPrefix: '/Telegram-Express',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
