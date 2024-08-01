"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { selectCommunityData } from "@/components/posting/select/route";

interface Post {
  content: string | null;
  created_at: string | null;
  files: string | null;
  id: string;
  title: string | null;
  user_id: string;
  category: string | null;
}

const categories = ["여행", "음식", "축제", "레포츠", "숙소"];

const Community: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isPending, isError } = useQuery<Post[], Error>({
    queryKey: ["community"],
    queryFn: selectCommunityData,
  });

  if (isPending) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const filteredPosts = selectedCategory ? data?.filter((post) => post.category === selectedCategory) : data;

  const getFirstImageUrl = (files: string | null): string | null => {
    if (!files) return null;
    const urls = files.split(",").filter((url) => url.trim() !== "");
    const firstUrl = urls.length > 0 ? urls[0] : null;
    console.log("First image URL:", firstUrl); // 로그 추가
    return firstUrl;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">커뮤니티</h1>
      <div
        onClick={() => router.push("/writing")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block cursor-pointer"
      >
        새 글 작성
      </div>
      <div className="mb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`mr-2 mb-2 px-3 py-1 rounded ${
            selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`mr-2 mb-2 px-3 py-1 rounded ${
              selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts &&
          filteredPosts.map((post: Post) => (
            <div key={post.id} className="border rounded-lg p-4 shadow-md">
              {post.files && (
                <div className="mb-4 w-16 h-9 relative">
                  <Image
                    src={getFirstImageUrl(post.files) || "/placeholder-image.jpg"}
                    alt="게시글 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.content?.substring(0, 50)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>작성자: {post.user_id}</span>
                <span>{new Date(post.created_at!).toLocaleDateString()}</span>
              </div>
              <p className="mt-2">#{post.category}</p>
              <Link href={`/postDetail/${post.id}`} className="mt-2 text-blue-500 hover:underline block">
                자세히 보기
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Community;
