/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized: true,

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
};

export default nextConfig;
