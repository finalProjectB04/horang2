import Header from "@/components/common/Header";
import QueryProvider from "@/provider/QueryProvider";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "swiper/swiper-bundle.css";
import Head from "next/head";

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
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          strategy="beforeInteractive"
        />
      </Head>
      <body className="font-sans">
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
