"use client";

import LoadingPage from "@/app/loading";
import { DetailTitle } from "@/components/maindetail/DetailTitle";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TravelCardMobile } from "./TravelCardMobile";

// 관광 유형을 정의하는 인터페이스
interface TourismListProps {
  contentTypeId: number;
  title: string;
}

// 관광 데이터를 가져오는 함수
const fetchTourismData = async (contentTypeId: number): Promise<ApiInformation[]> => {
  const response = await fetch(`/api/main/tourism?contentTypeId=${contentTypeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tourism data for contentTypeId ${contentTypeId}`);
  }
  return response.json();
};

export const TourismListMobile: React.FC<TourismListProps> = ({ contentTypeId, title }) => {
  const [displayCount, setDisplayCount] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { ref, inView } = useInView();

  // React Query를 사용하여 데이터 fetching
  const {
    data: tourismData,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["tourism", contentTypeId],
    queryFn: () => fetchTourismData(contentTypeId),
  });

  // 검색어에 따라 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!tourismData) return [];
    return tourismData
      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [tourismData, searchTerm]);

  // 화면에 표시할 데이터
  const displayedData = useMemo(() => {
    return filteredData.slice(0, displayCount);
  }, [filteredData, displayCount]);

  // Infinite Scrolling을 위한 useEffect
  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => prevCount + 12);
    }
  }, [inView]);

  if (isPending) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <div className="  block  lg:hidden">
        <div className="flex flex-col justify-center items-center">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className=" max-w-[326px]">
            <div className="flex my-6 gap-3">
              <DetailTitle />
              <h3 className="text-2xl font-bold">{title}</h3>
            </div>
          </div>
          <div className="max-w-[326px] flex flex-wrap gap-1 items-center justify-center ">
            {displayedData.map((item) => (
              <TravelCardMobile key={item.contentid} item={item} />
            ))}
          </div>
          {displayedData.length < filteredData.length && (
            <div ref={ref} className="py-4 text-center">
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
