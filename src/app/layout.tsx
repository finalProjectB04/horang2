import Header from "@/components/common/Header";
import QueryProvider from "@/provider/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
<<<<<<< HEAD
=======
import Header from "@/components/common/Header";

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
>>>>>>> a3fdf835b04ce416689db320e139c55baa989cb4

const inter = Inter({ subsets: ["latin"] });
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services,clusterer`;

export const metadata: Metadata = {
  title: "horang",
  description: "나만의 국내 여행 추천 서비스",
};
declare global {
  interface Window {
    Kakao: any;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <head>
        <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="beforeInteractive" />
      </head>
=======
      <script type="text/javascript" src={KAKAO_SDK_URL} async></script>
>>>>>>> a3fdf835b04ce416689db320e139c55baa989cb4
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
