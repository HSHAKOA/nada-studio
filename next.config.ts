import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "nada-studio.vercel.app" }],
        destination: "https://www.nadastudio.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
