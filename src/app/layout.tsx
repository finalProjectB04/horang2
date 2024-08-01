import Header from "@/components/common/Header";
import QueryProvider from "@/provider/QueryProvider";
import type { Metadata } from "next";
import Script from "next/script";
import "swiper/swiper-bundle.css";
import "./globals.css";
import Head from "next/head";
import RecoilProvider from "@/provider/RecoilProvider";

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
      <Head>
        <link rel="stylesheet" href="assets/fonts/pretendard.css" />
      </Head>
      <RecoilProvider>
        <QueryProvider>
          <body className="font-sans mt-[84px]">
            <Header />
            {children}
            <Script
              src="https://developers.kakao.com/sdk/js/kakao.min.js"
              integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
              strategy="beforeInteractive"
            />
          </body>
        </QueryProvider>
      </RecoilProvider>
    </html>
  );
}
