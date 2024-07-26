"use client";
import { FetchLeports } from "@/app/api/main/Tour/AllFetch/leports/route";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { A11y, Autoplay, Grid, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MainListTitle } from "../common/MainListTitle";
import { useRouter } from "next/navigation";

interface TravelProps {
  searchTerm: string;
}
export const Leports = ({ searchTerm }: TravelProps) => {
  const [displayCount, setDisplayCount] = useState(25);
  const router = useRouter();
  const {
    data: leports,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["leports"],
    queryFn: FetchLeports,
  });

  const sortedLeports = useMemo(() => {
    if (!leports) return [];

    const filterd = leports.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const shuffled = [...filterd];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      })
      .slice(0, displayCount);
  }, [leports, displayCount, searchTerm]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <MainListTitle TitleName={`액티비티 추천`} onClick={() => router.push("/leport")} />
      <div className="flex gap-6 h-[700px]">
        <Swiper
          modules={[Grid, A11y, Autoplay]}
          spaceBetween={10}
          slidesPerView={2}
          grid={{
            rows: 2,
            fill: "row",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="rounded-lg h-full w-1/2"
        >
          {sortedLeports.map((item) => (
            <SwiperSlide key={item.contentid} className="h-[340px]">
              <div className="relative bg-white rounded-lg overflow-hidden shadow-md h-full">
                <div className="h-[240px] relative">
                  {item.firstimage ? (
                    <Image src={item.firstimage} alt={item.title} layout="fill" objectFit="cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4 h-[80px] overflow-hidden">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.addr1 || "Address not available"}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex flex-col gap-6 w-1/2 h-full">
          <div className="h-[584px] relative rounded-lg overflow-hidden">
            <Image src="/assets/images/ex4.png" alt="profile" layout="fill" objectFit="cover" />
          </div>
          <div className="h-[94px] relative rounded-lg overflow-hidden">
            <Image src="/assets/images/ex5.png" alt="profile" layout="fill" objectFit="cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
