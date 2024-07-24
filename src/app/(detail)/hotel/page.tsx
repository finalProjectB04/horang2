"use client";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

const fetchHotel = async (): Promise<ApiInformation[]> => {
  const res = await fetch("/api/main/Tour/hotel");
  if (!res) {
    throw new Error("error");
  }
  return res.json();
};
const Page = () => {
  const [serachTerm, setSerachTerm] = useState("");
  const {
    data: hotel,
    isPending,
    isError,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["hotel"],
    queryFn: fetchHotel,
  });

  const filteredHotel = useMemo(() => {
    if (!hotel) return [];
    return hotel.filter((item) => item.title.toLowerCase().includes(serachTerm.toLowerCase()));
  }, [hotel, serachTerm]);

  if (isPending) {
    return <div>isPending</div>;
  }
  if (isError) {
    return <div>isError</div>;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={serachTerm}
          onChange={(e) => setSerachTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Swiper spaceBetween={30} slidesPerView={4} direction={"horizontal"}>
        {filteredHotel.map((item) => (
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
              <p>{item.addr1}</p>
              <p className="mt-2 text-center font-semibold">{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Page;
