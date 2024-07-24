"use client";

import { DetailTitle } from "@/components/maindetail/DetailTitle";
import { ScrollToTopButton } from "@/components/maindetail/ScrollToTopButton";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { TravelCard } from "@/components/maindetail/TravelCard";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const fetchTravel = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/travel");
  if (!response.ok) {
    throw new Error("Failed to fetch travel data");
  }
  return response.json();
};

const Travel = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const {
    data: travel,
    isLoading,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["travel"],
    queryFn: fetchTravel,
  });

  const filteredTravel = useMemo(() => {
    if (!travel) return [];
    return travel
      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [travel, searchTerm]);

  const displayedTravel = useMemo(() => {
    return filteredTravel.slice(0, displayCount);
  }, [filteredTravel, displayCount]);

  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => prevCount + 10);
    }
  }, [inView]);

  if (isLoading)
    return (
      <div>
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-xl font-semibold mt-4 text-gray-700">불러오는 중입니다...</p>
        </div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex my-6 gap-3">
          <DetailTitle />

          <h3>여행지 추천</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedTravel.map((item) => (
            <TravelCard key={item.contentid} item={item} />
          ))}
        </div>
        {displayedTravel.length < filteredTravel.length && (
          <div ref={ref} className="py-4 text-center">
            Loading more...
          </div>
        )}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Travel;
