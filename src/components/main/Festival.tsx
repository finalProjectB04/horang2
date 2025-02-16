"use client";

import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MainListTitle } from "../common/MainListTitle";
import { NoResultsFound } from "../maindetail/NoResultsFound";
import { MainTravelSlider } from "./swiper/TravelSlider";

interface FestivalProps {
  searchTerm: string;
}

const fetchFestival = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/tourism/festival");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
export const Festival = ({ searchTerm }: FestivalProps) => {
  const [displayCount, setDisplayCount] = useState<number>(20);
  const router = useRouter();
  const {
    data: festival,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["festival"],
    queryFn: fetchFestival,
  });

  const sortedFestival: ApiInformation[] = useMemo(() => {
    if (!festival) return [];

    const filterd: ApiInformation[] = festival.filter((item) =>
      item.addr1.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const shuffled: ApiInformation[] = [...filterd];
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
      <div className="mx-auto max-w-[327px]  py-8 lg:max-w-[960px] flex flex-col lg:gap-10">
        <MainListTitle TitleName={`축제 및 행사`} onClick={() => router.push("/festival")} />
      </div>
      <div className=" mx-auto  lg:max-w-[960px] lg:h-[243px] flex flex-col lg:gap-10 max-w-[327px]">
        {sortedFestival.length > 0 ? (
          <MainTravelSlider
            travel={sortedFestival}
            contentId={""}
            imageUrl={""}
            contentTypeId={""}
            title={""}
            addr1={""}
            tel={""}
            userId={""}
          />
        ) : (
          <NoResultsFound />
        )}
      </div>
    </>
  );
};
