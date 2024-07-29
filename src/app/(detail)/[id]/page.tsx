"use client";

import { Loading } from "@/components/common/Loading";
import { DetailTitle } from "@/components/maindetail/DetailTitle";
import { ScrollToTopButton } from "@/components/maindetail/ScrollToTopButton";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { TravelCard } from "@/components/maindetail/TravelCard";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

// 관광 유형을 정의하는 인터페이스
interface TourismListProps {
  contentTypeId: number;
  title: string;
}

// contentTypeId를 카테고리로 매핑하는 객체
const categoryMapping: Record<number, string> = {
  39: "restaurant",
  12: "attraction",
  32: "accommodation",
  // 필요에 따라 더 많은 매핑을 추가할 수 있습니다
};

// 관광 데이터를 가져오는 함수
const fetchTourismData = async (contentTypeId: number): Promise<ApiInformation[]> => {
  const response = await fetch(`/api/main/tourism?contentTypeId=${contentTypeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tourism data for contentTypeId ${contentTypeId}`);
  }
  return response.json();
};

const TourismList: React.FC<TourismListProps> = ({ contentTypeId, title }) => {
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
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

  // contentTypeId에 따른 카테고리 결정
  const category = categoryMapping[contentTypeId] || "unknown";

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
      setDisplayCount((prevCount) => prevCount + 10);
    }
  }, [inView]);

  if (isPending) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex my-6 gap-3">
          <DetailTitle />
          <h3>
            {title} ({category})
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedData.map((item) => (
            <TravelCard key={item.contentid} item={item} category={category} />
          ))}
        </div>
        {displayedData.length < filteredData.length && (
          <div ref={ref} className="py-4 text-center">
            Loading more...
          </div>
        )}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default TourismList;
