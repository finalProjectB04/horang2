"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ApiInformation } from "@/types/Main";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import ListTitle from "../common/ListTitle";
import { useRouter } from "next/navigation";
import Image from "next/image";

// import "swiper/swiper.min.css";

const fetchTravel = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/travel");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export const Travel = () => {
  const [displayCount, setDisplayCount] = useState(25);
  const router = useRouter();
  const {
    data: travel,
    isLoading,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["travel"],
    queryFn: fetchTravel,
  });

  const sortedTravel = useMemo(() => {
    if (!travel) return [];

    // 데이터를 먼저 섞습니다 (Fisher-Yates 알고리즘 사용)
    const shuffled = [...travel];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 섞인 데이터를 이미지 유무에 따라 정렬하고 displayCount만큼 잘라냅니다
    return shuffled
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      })
      .slice(0, displayCount);
  }, [travel, displayCount]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <ListTitle TitleName={`지금뜨는 핫플레이스`} onClick={() => router.push("/travel")} />

      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onAutoplay={(swiper) => {
          swiper.slideTo(swiper.activeIndex + 4);
        }}
        className="rounded-lg shadow-xl"
      >
        {sortedTravel.map((item) => (
          <SwiperSlide className="bg-gray-100" key={item.contentid}>
            {item.firstimage ? (
              <Image
                src={item.firstimage}
                alt={item.title}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.addr1 || "Address not available"}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
