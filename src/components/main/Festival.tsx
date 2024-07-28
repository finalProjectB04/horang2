"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ApiInformation } from "@/types/Main";
import { useRouter } from "next/navigation";
import { MainListTitle } from "../common/MainListTitle";
import { MainTravelSlider } from "./swiper/TravelSlider";

interface FestivalProps {
  searchTerm: string;
}

const fetchFestival = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/festival");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
export const Festival = ({ searchTerm }: FestivalProps) => {
  const [displayCount, setDisplayCount] = useState(25);
  const router = useRouter();
  const {
    data: festival,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["festival"],
    queryFn: fetchFestival,
  });

  const sortedFestival = useMemo(() => {
    if (!festival) return [];

    const filterd = festival.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
  }, [festival, displayCount, searchTerm]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="mx-auto  py-8 max-w-[1440px] flex flex-col gap-10">
        <MainListTitle TitleName={`축제 및 행사`} onClick={() => router.push("/travel")} />
      </div>
      <div className=" mx-auto  max-w-[1440px] h-[346px] flex flex-col gap-10">
        <MainTravelSlider travel={sortedFestival} isPending={isPending} error={error} />
      </div>
    </>
  );
};
