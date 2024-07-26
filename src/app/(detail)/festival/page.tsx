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

const fetchFestival = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/festival");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

const Festival = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const {
    data: festival,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["festival"],
    queryFn: fetchFestival,
  });

  const filteredFestival = useMemo(() => {
    if (!festival) return [];
    return festival
      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [festival, searchTerm]);

  const displayedFestival = useMemo(() => {
    return filteredFestival.slice(0, displayCount);
  }, [filteredFestival, displayCount]);

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

          <h3>축제 추천</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedFestival.map((item) => (
            <TravelCard key={item.contentid} item={item} />
          ))}
        </div>
        {displayedFestival.length < filteredFestival.length && (
          <div ref={ref} className="py-4 text-center">
            Loading more...
          </div>
        )}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Festival;
