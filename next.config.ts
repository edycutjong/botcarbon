import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  transpilePackages: ['d3-color', 'd3-zoom', 'd3-interpolate', 'react-simple-maps'],
};

export default nextConfig;
