// PostGrid.tsx
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Post } from "@/types/Post.types";
import { SortOrder } from "@/app/(post)/community/page";
import PostLike from "./PostLike";

interface PostGridProps {
  posts: Post[] | undefined;
  selectedCategory: string;
  sortOrder: SortOrder;
}

const getFirstImageUrl = (files: string | null): string | null => {
  if (!files) return null;
  const urls = files.split(",").filter((url) => url.trim() !== "");
  return urls.length > 0 ? urls[0] : null;
};

const PostGrid: React.FC<PostGridProps> = ({ posts, selectedCategory, sortOrder }) => {
  const router = useRouter();

  const sortedAndFilteredPosts = useMemo(() => {
    if (!posts) return [];

    let filteredPosts =
      selectedCategory === "전체" ? posts : posts.filter((post) => post.category === selectedCategory);

    switch (sortOrder) {
      case "latest":
        return filteredPosts.sort((a, b) => {
          const dateA = new Date(a.created_at || "").getTime();
          const dateB = new Date(b.created_at || "").getTime();
          return dateB - dateA;
        });
      case "oldest":
        return filteredPosts.sort((a, b) => {
          const dateA = new Date(a.created_at || "").getTime();
          const dateB = new Date(b.created_at || "").getTime();
          return dateA - dateB;
        });
      case "likes":
        return filteredPosts.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
      default:
        return filteredPosts;
    }
  }, [posts, selectedCategory, sortOrder]);

  return (
    <div className="flex flex-wrap justify-between">
      {sortedAndFilteredPosts.map((post: Post) => (
        <div
          key={post.id}
          className="w-[calc(33.333%-16px)] mb-8 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => router.push(`/postDetail/${post.id}`)}
        >
          <div className="relative h-[280px]">
            {post.files && (
              <Image
                src={getFirstImageUrl(post.files) || "/placeholder-image.jpg"}
                alt="게시글 이미지"
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 truncate">{post.title}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{post.category}</span>
              <span>{new Date(post.created_at || "").toLocaleDateString()}</span>
              <PostLike post_id={post.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
