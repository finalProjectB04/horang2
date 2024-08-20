/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized: true,
    domains: ["tong.visitkorea.or.kr"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
      },
      {
        protocol: "https",
        hostname: "crjcsxutfsroqsqumefz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
