"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ApiInformation } from "@/types/Main";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination, Scrollbar } from "swiper/modules";
import Image from "next/image";

const fetchRestaurants = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/restaurants");
  if (!response.ok) {
    throw new Error("error");
  }

  return response.json();
};

// 배열을 랜덤하게 섞는 함수
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const Restaurants = () => {
  const [randomCount, setRandomCount] = useState(10); // 표시할 랜덤 항목 수

  const {
    data: restaurantList,
    isLoading,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
    select: (data) => shuffleArray(data).slice(0, randomCount), // 데이터를 섞고 일부만 선택
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Random Restaurants</h1>
      <button
        onClick={() => setRandomCount((prev) => prev + 5)}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Load More
      </button>
      <Swiper
        modules={[Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="rounded-lg shadow-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurantList?.map((item) => (
            <SwiperSlide className="bg-gray-100" key={item.contentid}>
              <img src={item.firstimage} alt={item.title} className="full" />
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};
