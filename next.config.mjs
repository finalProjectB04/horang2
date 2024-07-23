/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
        port: "",
      },
    ],
  },
};

export default nextConfig;
