// Page.tsx
"use client";

import { SearchBarButton } from "@/components/maindetail/SearchBarButton";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const fetchLeports = async (): Promise<ApiInformation[]> => {
  const res = await fetch("/api/main/Tour/leports");
  if (!res.ok) {
    throw new Error("error");
  }
  return res.json();
};

const Page = () => {
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: leports,
    isPending,
    isError,
  } = useQuery<ApiInformation[]>({
    queryKey: ["leports"],
    queryFn: fetchLeports,
  });

  const filteredLeports = useMemo(() => {
    if (!leports) return [];
    return leports.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [leports, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputTerm);
  };

  if (isPending) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">Error occurred while fetching data.</div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <SearchBarButton searchTerm={inputTerm} setSearchTerm={setInputTerm} onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredLeports.map((item) => (
            <div
              key={item.contentid}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-48">
                <Image src={item.firstimage || item.firstimage2} alt={item.title} layout="fill" objectFit="cover" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                <p className="text-gray-600">{item.addr1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
