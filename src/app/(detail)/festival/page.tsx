"use client";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const fetchFestival = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/festival");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: festival,
    isPending,
    isError,
  } = useQuery<ApiInformation[]>({
    queryKey: ["festival"],
    queryFn: fetchFestival,
  });

  const filteredFestival = useMemo(() => {
    if (!festival) return [];
    return festival.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [festival, searchTerm]);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">페스티벌</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="페스티벌 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Swiper spaceBetween={30} slidesPerView={4} direction={"horizontal"}>
        {filteredFestival.map((item) => (
          <SwiperSlide key={item.contentid}>
            <div className="flex flex-col items-center">
              <Image
                src={item.firstimage}
                alt={item.title}
                width={200}
                height={200}
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 text-center font-semibold">{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Page;
