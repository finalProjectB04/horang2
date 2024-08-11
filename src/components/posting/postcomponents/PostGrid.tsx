import React, { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Post } from "@/types/Post.types";
import { SortOrder } from "@/app/(post)/community/page";
import PostLike from "./PostLike";

interface PostGridProps {
  posts: Post[] | undefined;
  selectedCategory: string;
  sortOrder: SortOrder;
}

const getFirstImageUrl = (files: string | null): string => {
  if (!files) return "/placeholder-image.jpg";
  const urls = files.split(",").filter((url) => url.trim() !== "");
  return urls.length > 0 ? urls[0] : "/placeholder-image.jpg";
};

const PostGrid: React.FC<PostGridProps> = React.memo(({ posts, selectedCategory, sortOrder }) => {
  const router = useRouter();
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});

  const handleLikesChange = useCallback((postId: string, likes: number) => {
    setPostLikes((prev) => {
      if (prev[postId] === likes) return prev; // 변경이 없으면 이전 상태를 반환
      return { ...prev, [postId]: likes };
    });
  }, []);

  const sortedAndFilteredPosts = useMemo(() => {
    if (!posts) return [];

    let filteredPosts =
      selectedCategory === "전체" ? posts : posts.filter((post) => post.category === selectedCategory);

    return filteredPosts.sort((a, b) => {
      switch (sortOrder) {
        case "latest":
        case "oldest":
          const dateA = new Date(a.created_at || "").getTime();
          const dateB = new Date(b.created_at || "").getTime();
          return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        case "likes":
          return (postLikes[b.id] ?? 0) - (postLikes[a.id] ?? 0);
        default:
          return 0;
      }
    });
  }, [posts, selectedCategory, sortOrder, postLikes]);

  if (!posts || posts.length === 0) {
    return <div className="text-center py-8">No posts found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sortedAndFilteredPosts.map((post: Post) => (
        <article key={post.id} className="rounded-lg overflow-hidden shadow-lg  ">
          <div className="relative h-64">
            <Image
              src={getFirstImageUrl(post.files)}
              alt={`Image for ${post.title}`}
              layout="fill"
              objectFit="cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className=" flex justify-between items-center  text-lg mb-4 line-clamp-2">
              <span className="text-lg font-semibold mb-2 truncate">{post.title}</span>
              <span
                className="rounded-lg overflow-hidden  transition-transform cursor-pointer"
                onClick={() => router.push(`/postDetail/${post.id}`)}
              >
                보기
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{post.category}</span>
              <time>{new Date(post.created_at || "").toLocaleDateString()}</time>
              <PostLike
                post_id={post.id}
                onLikesChange={(likes) => handleLikesChange(post.id, likes)}
                initialLikes={postLikes[post.id] ?? 0}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
});

PostGrid.displayName = "PostGrid";

export default PostGrid;
