import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ujasntkfphywizsdaapi.supabase.co",
      },
    ],
  },
};

export default nextConfig;
