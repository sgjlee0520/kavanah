import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
