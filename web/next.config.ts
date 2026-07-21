import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    // old static-site URLs
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/prompting.html", destination: "/prompting", permanent: true },
    ];
  },
};

export default nextConfig;
