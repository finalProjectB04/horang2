"use client";

import { FetchLeports } from "@/app/api/main/Tour/AllFetch/leports/route";
import { Loading } from "@/components/common/Loading";

import { DetailTitle } from "@/components/maindetail/DetailTitle";
import { ScrollToTopButton } from "@/components/maindetail/ScrollToTopButton";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { TravelCard } from "@/components/maindetail/TravelCard";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Leports = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const {
    data: leports,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["leports"],
    queryFn: FetchLeports,
  });

  const filteredLeports = useMemo(() => {
    if (!leports) return [];
    return leports
      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [leports, searchTerm]);

  const displayedLeports = useMemo(() => {
    return filteredLeports.slice(0, displayCount);
  }, [filteredLeports, displayCount]);

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

          <h3>액티비티 추천</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedLeports.map((item) => (
            <TravelCard key={item.contentid} item={item} />
          ))}
        </div>
        {displayedLeports.length < filteredLeports.length && (
          <div ref={ref} className="py-4 text-center">
            Loading more...
          </div>
        )}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Leports;
