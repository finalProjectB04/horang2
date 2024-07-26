"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";
import { MainListTitle } from "../common/MainListTitle";
import { MainTravelSlider } from "./swiper/TravelSlider";
import { FetchTravelCourse } from "@/app/api/main/Tour/AllFetch/travelcourse/route";
interface TravelProps {
  searchTerm: string;
}
export const TravelCourse = ({ searchTerm }: TravelProps) => {
  const [displayCount, setDisplayCount] = useState(25);
  const router = useRouter();
  const {
    data: travelCourse,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["travel"],
    queryFn: FetchTravelCourse,
  });

  const sortedTravel = useMemo(() => {
    if (!travelCourse) return [];

    const filterd = travelCourse.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.addr1.toLowerCase().includes(searchTerm.toLowerCase()),
    );

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
  }, [travelCourse, displayCount, searchTerm]);

  if (isPending) {
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
