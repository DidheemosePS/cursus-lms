import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker — bundles all dependencies into .next/standalone
  output: "standalone",

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lms-mvp-test.s3.eu-west-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
