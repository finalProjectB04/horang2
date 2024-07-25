"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";
import { MainListTitle } from "../common/MainListTitle";
import { MainTravelSlider } from "./swiper/TravelSlider";
import { FetchTravel } from "@/app/api/main/Tour/AllFetch/travel/route";

export const Travel = () => {
  const [displayCount, setDisplayCount] = useState(25);

  const router = useRouter();
  const {
    data: travel,
    isLoading,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["travel"],
    queryFn: FetchTravel,
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
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-xl font-semibold mt-4 text-gray-700">불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <MainListTitle TitleName={`지금뜨는 핫플레이스`} onClick={() => router.push("/travel")} />
      <MainTravelSlider travel={sortedTravel} />
    </div>
  );
};
