import Header from "@/components/common/Header";
import QueryProvider from "@/provider/QueryProvider";
import RecoilProvider from "@/provider/RecoilProvider";
import type { Metadata } from "next";
import Head from "next/head";
import Script from "next/script";
import "swiper/swiper-bundle.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "horang",
  description: "나만의 국내 여행 추천 서비스",
  icons: {
    icon: "/assets/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="stylesheet" href="assets/fonts/pretendard.css" />
      </Head>
      <RecoilProvider>
        <QueryProvider>
          <body className="font-sans sm:mt-0 md:mt-[84px] lg:mt-[84px]">
            <Header />
            {children}
            <Script src="https://developers.kakao.com/sdk/js/kakao.min.js" />
          </body>
        </QueryProvider>
      </RecoilProvider>
    </html>
  );
}
