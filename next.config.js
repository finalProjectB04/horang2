/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["crjcsxutfsroqsqumefz.supabase.co"], // 여기에 허용할 도메인 추가
  },
};

module.exports = nextConfig;
