"use client";

import LoadingPage from "@/app/loading";
import { SearchBar } from "@/components/maindetail/SearchBar";
import { TravelCard } from "@/components/maindetail/TravelCard";
import { RegionSelector } from "@/components/maindetail/RegionSelector";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BackgroundImage } from "./BackgroundImage";
import { SkeletonCard } from "./SkeletonCard";
import { NoResultsFound } from "./NoResultsFound";
import { useUserStore } from "@/zustand/userStore";
import Control from "../main/Control";
interface TourismListProps {
  contentTypeId: number;
  title: string;
  img: string;
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

export const TourismList: React.FC<TourismListProps> = ({ contentTypeId, title, img }) => {
  const [displayCount, setDisplayCount] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedConsonant, setSelectedConsonant] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSigungu, setSelectedSigungu] = useState<string>("");
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { id: userId } = useUserStore();
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
        const matchesRegion = selectedRegion === "" || item.addr1.includes(selectedRegion);
        const matchesSigungu = selectedSigungu === "" || item.addr1.includes(selectedSigungu);

        return matchesSearch && matchesConsonant && matchesRegion && matchesSigungu;
      })
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      });
  }, [tourismData, searchTerm, selectedConsonant, selectedRegion, selectedSigungu]);

  const displayedData = useMemo(() => {
    return filteredData.slice(0, displayCount);
  }, [filteredData, displayCount]);

  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => prevCount + 12);
    }
  }, [inView]);

  const handleSearch = (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const handleRegionSelect = (region: string, sigungu: string) => {
    setSelectedRegion(region);
    setSelectedSigungu(sigungu);
    setIsRegionSelectorOpen(false);
  };

  if (isPending) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <BackgroundImage img={img}>
        <div className="hidden lg:block">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            onRegionSelectorOpen={() => setIsRegionSelectorOpen(true)}
          />
        </div>
      </BackgroundImage>
      <Control />
      <div className="flex my-6 gap-3 mx-auto max-w-[960px] mt-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_1893_11600)">
            <path
              d="M8.77022 10.1112H1.61133L7.43855 14.2762L5.22855 21.4446L11.0558 17.0151L16.8924 21.4446L14.673 14.2762L20.5002 10.1112H13.3413L11.0558 2.55566L8.77022 10.1112ZM20.8402 21.4446L19.0836 15.7684L23.0313 12.9446H19.7824L16.8736 15.0223L18.2524 19.4801L20.8402 21.4446ZM16.7224 8.22233L15.0036 2.55566L14.0213 5.814L14.7486 8.22233H16.7224Z"
              fill="#FF5C00"
            />
          </g>
          <defs>
            <clipPath id="clip0_1893_11600">
              <rect width="22.6667" height="22.6667" fill="white" transform="translate(0.666748 0.666504)" />
            </clipPath>
          </defs>
        </svg>
        <h3 className="text-[19px] font-bold">{title}</h3>
      </div>

      <div className="mx-auto py-8 max-w-[960px] flex flex-col items-center justify-center ">
        <div className="flex flex-wrap gap-[2px]   lg:gap-2 lg:mb-4">
          {KOREAN_CONSONANTS.map((consonant) => (
            <button
              key={consonant}
              onClick={() => setSelectedConsonant(selectedConsonant === consonant ? "" : consonant)}
              className={`px-3 py-1 rounded ${
                selectedConsonant === consonant ? "bg-orange-500 text-white" : "bg-grey-200"
              }`}
            >
              {consonant}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1  lg:gap-[26px] py-8 max-w-[327px] lg:max-w-[960px]">
          {isSearching ? (
            Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
          ) : displayedData.length > 0 ? (
            displayedData.map((item) => (
              <TravelCard
                key={item.contentid}
                item={item}
                user_id={userId || ""}
                imageUrl={item.firstimage || ""}
                contentTypeId={item.contenttypeid || ""}
                title={item.title || ""}
                addr1={item.addr1 || ""}
                tel={item.tel || ""}
                contentId={""}
              />
            ))
          ) : (
            <NoResultsFound />
          )}
        </div>
        {!isSearching && displayedData.length < filteredData.length && (
          <div ref={ref} className="py-4 text-center">
            불러오는중..
          </div>
        )}
      </div>
      {isRegionSelectorOpen && (
        <RegionSelector onSelect={handleRegionSelect} onClose={() => setIsRegionSelectorOpen(false)} />
      )}
    </>
  );
};
