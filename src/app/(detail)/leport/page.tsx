"use client";

import { FetchLeports } from "@/app/api/main/Tour/AllFetch/leports/route";
import { SearchBarButton } from "@/components/maindetail/SearchBarButton";
import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const Page = () => {
  const [inputTerm, setInputTerm] = useState(""); // 입력 중인 검색어
  const [searchTerm, setSearchTerm] = useState(""); // 실제 검색에 사용되는 검색어
  const {
    data: leports,
    isPending,
    isError,
  } = useQuery<ApiInformation[]>({
    queryKey: ["leports"],
    queryFn: FetchLeports,
  });

  const filteredLeports = useMemo(() => {
    if (!leports) return [];
    return leports.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [leports, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(inputTerm);
  };

  if (isPending) {
    return <div>로딩</div>;
  }
  if (isError) {
    return <div>에러</div>;
  }

  return (
    <div>
      <SearchBarButton searchTerm={inputTerm} setSearchTerm={setInputTerm} onSearch={handleSearch} />
      {filteredLeports.map((item) => (
        <div key={item.contentid} className="container mx-auto px-4 py-8 relative">
          <Image src={item.firstimage} alt="가게이미지" width={300} height={300} className=" w-full object-cover" />
          <p>{item.title}</p>
          <p>{item.addr1}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;
