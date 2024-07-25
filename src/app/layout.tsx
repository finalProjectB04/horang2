import QueryProvider from "@/provider/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "swiper/swiper-bundle.css";

import Header from "@/components/common/Header";

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

const inter = Inter({ subsets: ["latin"] });
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services,clusterer`;

export const metadata: Metadata = {
  title: "horang",
  description: "나만의 국내 여행 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script type="text/javascript" src={KAKAO_SDK_URL} async></script>
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          <div>{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
}
