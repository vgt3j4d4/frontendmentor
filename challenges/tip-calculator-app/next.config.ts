import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // Change the output directory `out` -> `dist`
  distDir: 'dist',
  // Change the base path
  basePath: process.env.BASE_PATH || '',
};

export default nextConfig;
