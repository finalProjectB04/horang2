"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { selectCommunityData } from "@/components/posting/select/route";

interface Post {
  content: string | null;
  created_at: string | null;
  file: string | null;
  id: string;
  title: string | null;
  user_id: string;
}

const Community: React.FC = () => {
  const router = useRouter();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">커뮤니티</h1>
      <div
        onClick={() => router.push("/writing")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block cursor-pointer"
      >
        새 글 작성
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data &&
          data.map((post: Post) => (
            <div key={post.id} className="border rounded-lg p-4 shadow-md">
              {post.file && <Image src={post.file} alt="파일이미지" width={300} height={300} />}
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.content.substring(0, 10)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>작성자: {post.user_id}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
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
