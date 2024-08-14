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
const PLACE_ICON = <Image src="/assets/images/post/chkeckpoint.png" alt="장소" width={10} height={16} className="" />;
const DATE_ICON = <Image src="/assets/images/post/icon.png" alt="날짜" width={16} height={16} className="" />;

const PostGrid: React.FC<PostGridProps> = React.memo(({ posts, selectedCategory, sortOrder }) => {
  const router = useRouter();
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});

  const handleLikesChange = useCallback((postId: string, likes: number) => {
    setPostLikes((prev) => {
      if (prev[postId] === likes) return prev;
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
    return <div className="text-center py-8">읽어오지 못했어요.</div>;
  }

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-[15px]">
          {sortedAndFilteredPosts.map((post: Post) => (
            <article
              key={post.id}
              className="rounded-[21px] overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(`/postDetail/${post.id}`)}
            >
              <div className="relative h-[293px]">
                <Image
                  src={getFirstImageUrl(post.files)}
                  alt={`Image for ${post.title}`}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <h3 className="text-[19px] font-semibold mb-2 truncate">{post.title}</h3>
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
      </div>

      <div className="block lg:hidden">
        <div className="flex flex-col gap-4 w-[328px] mx-auto">
          {sortedAndFilteredPosts.map((post: Post) => (
            <article
              key={post.id}
              className="flex items-center overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(`/postDetail/${post.id}`)}
            >
              <div className="relative w-[90px] h-[90px]">
                <Image
                  src={getFirstImageUrl(post.files)}
                  alt={`Image for ${post.title}`}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 pl-5">
                <h3 className="text-base font-semibold mb-1 truncate">{post.title}</h3>
                <p className="flex text-sm text-gray-600 mt-2 line-clamp-2">
                  <svg
                    className="mr-2 mt-[2px]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                  >
                    <circle cx="9.5" cy="9" r="9" fill="#D9D9D9" />
                  </svg>
                  {post.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex">
                    <div className="mr-[10px]">{PLACE_ICON}</div>
                    {post.category}
                  </span>
                  <time className="flex">
                    <div className="mr-[10px]">{DATE_ICON}</div>
                    {new Date(post.created_at || "").toLocaleDateString()}
                  </time>
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
      </div>
    </div>
  );
});

PostGrid.displayName = "PostGrid";

export default PostGrid;
