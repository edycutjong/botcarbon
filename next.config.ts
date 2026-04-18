import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.88.13'],
  transpilePackages: ['d3-color', 'd3-zoom', 'd3-interpolate', 'react-simple-maps'],
};

export default nextConfig;
