// Community.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { selectCommunityData } from "@/components/posting/select/route";
import { CommunityImage } from "@/components/posting/image/CommunityImage";
import PostGrid from "@/components/posting/postcomponents/PostGrid";
import CategorySelector from "@/components/posting/postcomponents/CategorySelector";
import SortSelector from "@/components/posting/postcomponents/SortSelector";

export interface Post {
  content: string | null;
  created_at: string | null;
  files: string | null;
  id: string;
  title: string | null;
  user_id: string;
  category: string | null;
}

export type SortOrder = "latest" | "oldest" | "none";

const Community: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const { data, isPending, isError } = useQuery<Post[], Error>({
    queryKey: ["community"],
    queryFn: selectCommunityData,
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "none" || prev === "oldest") return "latest";
      return "oldest";
    });
  };

  if (isPending) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-14">
        <CommunityImage />
      </div>

      <div className="container w-[1440px] mx-auto ">
        <div className="flex justify-start gap-5 mb-14 ">
          <CategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <SortSelector sortOrder={sortOrder} onSortChange={toggleSortOrder} />
          <button
            onClick={() => router.push("/writing")}
            className="px-8 py-3 rounded-full bg-orange-500 text-white text-base font-medium hover:bg-orange-600 transition duration-150 ease-in-out"
          >
            새 글 작성
          </button>
        </div>
        <PostGrid posts={data} selectedCategory={selectedCategory} sortOrder={sortOrder} />
      </div>
    </>
  );
};

export default Community;
