"use client";

import { Loding } from "@/components/common/Loading";
import { DetailTitle } from "@/components/maindetail/DetailTitle";
import { ScrollToTopButton } from "@/components/maindetail/ScrollToTopButton";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { TravelCard } from "@/components/maindetail/TravelCard";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const fetchHotel = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/hotel");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

const Hotel = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const {
    data: hotel,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["hotel"],
    queryFn: fetchHotel,
  });

  const filteredHotel = useMemo(() => {
    if (!hotel) return [];
    return hotel
      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [hotel, searchTerm]);

  const displayedHotel = useMemo(() => {
    return filteredHotel.slice(0, displayCount);
  }, [filteredHotel, displayCount]);

  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => prevCount + 10);
    }
  }, [inView]);

  if (isPending) return <Loding />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex my-6 gap-3">
          <DetailTitle />

          <h3>숙소 추천</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedHotel.map((item) => (
            <TravelCard key={item.contentid} item={item} />
          ))}
        </div>
        {displayedHotel.length < filteredHotel.length && (
          <div ref={ref} className="py-4 text-center">
            Loading more...
          </div>
        )}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Hotel;
