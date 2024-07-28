"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";
import { MainListTitle } from "../common/MainListTitle";
import { MainTravelSlider } from "./swiper/TravelSlider";
import { FetchTravel } from "@/app/api/main/Tour/AllFetch/travel/route";
import { Loading } from "../common/Loading";

interface TravelProps {
  searchTerm: string;
}

export const Travel: React.FC<TravelProps> = ({ searchTerm }) => {
  const [displayCount, setDisplayCount] = useState(25);
  const router = useRouter();
  const {
    data: travel,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["travel"],
    queryFn: FetchTravel,
  });

  const sortedAndFilteredTravel = useMemo(() => {
    if (!travel) return [];

    const filtered = travel.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const shuffled = [...filtered];
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
  }, [travel, displayCount, searchTerm]);
  console.log(2);
  if (isPending) {
    return <div>로딩중</div>;
  }

  if (error) {
    return <div>에러</div>;
  }
  console.log(1);
  return (
    <>
      <div className="mx-auto  py-8 max-w-[1440px] flex flex-col gap-10">
        <MainListTitle TitleName={`추천 여행지 `} onClick={() => router.push("/travel")} />
      </div>
      <div className=" mx-auto  max-w-[1440px] h-[346px] flex flex-col gap-10">
        <MainTravelSlider travel={sortedAndFilteredTravel} isPending={isPending} error={error} />
      </div>
    </>
  );
};
