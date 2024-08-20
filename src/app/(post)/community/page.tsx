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

export type SortOrder = "likes" | "latest" | "oldest" | "none";

const Community: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const { data, isPending, isError } = useQuery({
    queryKey: ["community"],
    queryFn: selectCommunityData,
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "none") return "latest";
      if (prev === "latest") return "oldest";
      if (prev === "oldest") return "likes";
      return "none";
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
      <CommunityImage />

      <div className="container lg:w-[960px] mx-auto lg:my-14 w-[375px] mb-10 mt-4">
        <div className="flex justify-between gap-5 lg:mb-14 mb-4 ml-4">
          <CategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <SortSelector sortOrder={sortOrder} onSortChange={setSortOrder} />
        </div>
        <button
          onClick={() => router.push("/writing")}
          className="hidden lg:block z-20 px-[32px] py-[22px] fixed bottom-8 left-8  rounded-[20px] bg-orange-500 text-white text-base font-medium hover:bg-orange-600 transition duration-150 ease-in-out"
        >
          글쓰기+
        </button>
        <button
          onClick={() => router.push("/writing")}
          className="block lg:hidden z-20 p-[13px] fixed bottom-8 left-8  rounded-full bg-orange-500 text-white text-base font-medium hover:bg-orange-600 transition duration-150 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15 0H13V13H0V15H13V28H15V15H28V13H15V0Z" fill="#FFDECC" />
          </svg>
        </button>
        <PostGrid posts={data} selectedCategory={selectedCategory} sortOrder={sortOrder} />
      </div>
    </>
  );
};

export default Community;
