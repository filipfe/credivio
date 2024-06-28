/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "**", protocol: "https" },
      { hostname: "127.0.0.1", port: "54321", protocol: "http" },
    ],
  },
};

export default nextConfig;
