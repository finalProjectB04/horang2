"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";
import { MainListTitle } from "../common/MainListTitle";
import { MainTravelSlider } from "./swiper/TravelSlider";
import { FetchTravelCourse } from "@/app/api/main/Tour/AllFetch/travelcourse/route";

export const TravelCourse = () => {
  const [displayCount, setDisplayCount] = useState(25);
  const router = useRouter();
  const {
    data: travelCourse,
    isLoading,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["travel"],
    queryFn: FetchTravelCourse,
  });

  const sortedTravel = useMemo(() => {
    if (!travelCourse) return [];

    // 데이터를 먼저 섞습니다 (Fisher-Yates 알고리즘 사용)
    const shuffled = [...travelCourse];
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
  }, [travelCourse, displayCount]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <MainListTitle TitleName={`여행코스 추천`} onClick={() => router.push("/travelCourse")} />
      <MainTravelSlider travel={sortedTravel} />
    </div>
  );
};
