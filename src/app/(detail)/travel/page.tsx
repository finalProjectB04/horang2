"use client";

import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const fetchTravel = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/Tour/travel");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
    const shuffled = shuffleArray([...travel]);
    return shuffled.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [travel, searchTerm]);

  const displayedTravel = useMemo(() => {
    return filteredTravel.slice(0, displayCount);
  }, [filteredTravel, displayCount]);

  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => prevCount + 10);
    }
  }, [inView]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Random Travel</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search travel destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedTravel.map((item) => (
          <div key={item.contentid} className="bg-white rounded-lg shadow-md overflow-hidden">
            {item.firstimage && <img src={item.firstimage} alt={item.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.addr1 || "Address not available"}</p>
            </div>
          </div>
        ))}
      </div>
      {displayedTravel.length < filteredTravel.length && (
        <div ref={ref} className="py-4 text-center">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default Travel;
