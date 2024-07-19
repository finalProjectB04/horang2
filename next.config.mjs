/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://apis.data.go.kr/B551011/KorService/:path*`,
      },
    ];
  },
};

export default nextConfig;
