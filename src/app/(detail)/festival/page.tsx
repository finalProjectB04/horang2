"use client";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper의 기본 CSS를 import

const fetchFestival = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/festival");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
const Page = () => {
  const {
    data: festival,
    isPending,
    isError,
  } = useQuery<ApiInformation[]>({
    queryKey: ["festival"],
    queryFn: fetchFestival,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <h1>페스티벌</h1>
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        direction={"horizontal"} // 가로 방향으로 설정
      >
        {festival.map((item) => (
          <SwiperSlide key={item.contentid}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Image src={item.firstimage} alt="사진" width={200} height={200} objectFit="cover" />
              <p>{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Page;
