"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { selectCommunityData } from "@/components/posting/select/route";
import { CommunityImage } from "@/components/posting/image/CommunityImage";

interface Post {
  content: string | null;
  created_at: string | null;
  files: string | null;
  id: string;
  title: string | null;
  user_id: string;
  category: string | null;
}

const categories = ["전체", "여행", "음식", "축제", "레포츠", "숙소"];

const getFirstImageUrl = (files: string | null): string | null => {
  if (!files) return null;
  const urls = files.split(",").filter((url) => url.trim() !== "");
  return urls.length > 0 ? urls[0] : null;
};

type SortOrder = "latest" | "oldest" | "none";

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

  const sortedAndFilteredPosts = useMemo(() => {
    if (!data) return [];

    let filteredPosts = selectedCategory === "전체" ? data : data.filter((post) => post.category === selectedCategory);

    if (sortOrder !== "none") {
      return filteredPosts.sort((a, b) => {
        const dateA = new Date(a.created_at || "").getTime();
        const dateB = new Date(b.created_at || "").getTime();
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
      });
    }

    return filteredPosts;
  }, [data, selectedCategory, sortOrder]);

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
        <div className="flex justify-center items-center gap-5 mb-14 ">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 rounded-full border  bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 text-base font-medium"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            className={`px-6 py-3 rounded-full text-base transition duration-150 ease-in-out
      ${sortOrder !== "none" ? "text-black border-2 border-orange-500" : "text-gray-500 hover:text-black"}`}
            onClick={toggleSortOrder}
          >
            {sortOrder === "latest" ? "최신순" : sortOrder === "oldest" ? "오래된순" : "날짜순"}
          </button>

          <button
            onClick={() => router.push("/writing")}
            className="px-8 py-3 rounded-full bg-orange-500 text-white text-base font-medium hover:bg-orange-600 transition duration-150 ease-in-out"
          >
            새 글 작성
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 cursor-pointe">
          {sortedAndFilteredPosts.map((post: Post) => (
            <div
              key={post.id}
              className="rounded-lg overflow-hidden w-[464px]"
              onClick={() => router.push(`/postDetail/${post.id}`)}
            >
              <div className="relative flex flex-col justify-end items-end h-[440px] p-5 gap-5">
                {post.files && (
                  <Image
                    src={getFirstImageUrl(post.files) || "/placeholder-image.jpg"}
                    alt="게시글 이미지"
                    layout="fill"
                    objectFit="contain"
                  />
                )}
              </div>
              <div className="p-4"></div>
              <div className="flex flex-col justify-center items-center h-[140px] px-4 gap-5">
                <h2 className="text-xl font-semibold w-full">{post.title}</h2>
                <p className="text-gray-600 text-sm w-full truncate">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 w-full">
                  <span>{post.category}</span>
                  <span>{new Date(post.created_at || "").toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Community;
