import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // old static-site URLs
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/prompting.html", destination: "/prompting", permanent: true },
    ];
  },
};

export default nextConfig;
