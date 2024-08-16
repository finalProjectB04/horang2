"use client";

import LoadingPage from "@/app/loading";
import { DetailTitle } from "@/components/maindetail/DetailTitle";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { TravelCard } from "@/components/maindetail/TravelCard";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface TourismListProps {
  contentTypeId: number;
  title: string;
}

const fetchTourismData = async (contentTypeId: number): Promise<ApiInformation[]> => {
  const response = await fetch(`/api/main/tourism?contentTypeId=${contentTypeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tourism data for contentTypeId ${contentTypeId}`);
  }
  return response.json();
};

const KOREAN_CONSONANTS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const getInitialConsonant = (str: string) => {
  const firstChar = str.charAt(0);
  const unicodeValue = firstChar.charCodeAt(0);

  if (unicodeValue >= 44032 && unicodeValue <= 55203) {
    const consonantIndex = Math.floor((unicodeValue - 44032) / 588);
    return KOREAN_CONSONANTS[consonantIndex];
  }

  return firstChar.toUpperCase();
};

export const TourismList: React.FC<TourismListProps> = ({ contentTypeId, title }) => {
  const [displayCount, setDisplayCount] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedConsonant, setSelectedConsonant] = useState<string>("");
  const { ref, inView } = useInView();

  const {
    data: tourismData,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["tourism", contentTypeId],
    queryFn: () => fetchTourismData(contentTypeId),
  });

  const filteredData = useMemo(() => {
    if (!tourismData) return [];
    return tourismData
      .filter((item) => {
        const titleLower = item.title.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        const initialConsonant = getInitialConsonant(item.title);

        const matchesSearch = titleLower.includes(searchTermLower);
        const matchesConsonant = selectedConsonant === "" || initialConsonant === selectedConsonant;

        return matchesSearch && matchesConsonant;
      })
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [tourismData, searchTerm, selectedConsonant]);

  const displayedData = useMemo(() => {
    return filteredData.slice(0, displayCount);
  }, [filteredData, displayCount]);

  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => prevCount + 12);
    }
  }, [inView]);

  if (isPending) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="mx-auto py-8 max-w-[960px] flex flex-col gap-10">
        <div className="flex my-6 gap-3">
          <DetailTitle />
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {KOREAN_CONSONANTS.map((consonant) => (
            <button
              key={consonant}
              onClick={() => setSelectedConsonant(selectedConsonant === consonant ? "" : consonant)}
              className={`px-3 py-1 rounded ${
                selectedConsonant === consonant ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
            >
              {consonant}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-8 max-w-[960px]">
          {displayedData.map((item) => (
            <TravelCard key={item.contentid} item={item} />
          ))}
        </div>
        {displayedData.length < filteredData.length && (
          <div ref={ref} className="py-4 text-center">
            Loading more...
          </div>
        )}
      </div>
    </>
  );
};
