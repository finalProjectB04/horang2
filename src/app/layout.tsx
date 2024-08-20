import { ModalProvider } from "@/context/modal.context";
import QueryProvider from "@/provider/QueryProvider";
import type { Metadata } from "next";
import Head from "next/head";
import Script from "next/script";
import "swiper/swiper-bundle.css";
import "./globals.css";

import ClientHeader from "@/components/common/Header/ClientHeader";

export const metadata: Metadata = {
  title: "horang",
  description: "나만의 국내 여행 추천 서비스",
  icons: {
    icon: "/assets/images/favicon.png",
  },
  openGraph: {
    title: "horang",
    description: "나만의 국내 여행 추천 서비스",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/images/thumbnail.png`,
        alt: "horang thumbnail",
      },
    ],
    url: process.env.NEXT_PUBLIC_BASE_URL,
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
      <QueryProvider>
        <ModalProvider>
          <body className="font-sans mt-[84px]">
            <ClientHeader />
            {children}
            <Script src="https://developers.kakao.com/sdk/js/kakao.min.js" />
          </body>
        </ModalProvider>
      </QueryProvider>
    </html>
  );
}
