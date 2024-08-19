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
              <div className=" p-2">
                <h3 className="text-lg font-semibold mb-2 truncate">{post.title}</h3>
                <p className="text-grey-600 text-sm mb-4 line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center text-xs text-grey-500">
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
              className="flex items-stretch overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(`/postDetail/${post.id}`)}
            >
              <div className="relative w-[90px] h-[90px] flex-shrink-0">
                <Image
                  src={getFirstImageUrl(post.files)}
                  alt={`Image for ${post.title}`}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                />
              </div>
              <div className="w-[238px]  p-2">
                <h3 className="text-lg font-semibold mb-2 truncate">{post.title}</h3>
                <p className="text-grey-600 text-sm mb-4 line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center text-xs text-grey-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 29" fill="none">
                    <path
                      d="M9 0.199951C4.02429 0.199951 0 3.62715 0 9.19995C0 16.76 9 28.9999 9 28.9999C9 28.9999 18 16.76 18 9.19995C18 3.62715 13.9757 0.199951 9 0.199951Z"
                      fill="#FF5C00"
                    />
                    <circle cx="9.00002" cy="9.19985" r="3.6" fill="white" />
                  </svg>
                  <span>{post.category}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 22 26" fill="none">
                    <path
                      d="M19.5556 3.22228H18.3333V0.777832H15.8889V3.22228H6.11111V0.777832H3.66667V3.22228H2.44444C1.08778 3.22228 0.0122222 4.32228 0.0122222 5.66672L0 22.7778C0 24.1223 1.08778 25.2223 2.44444 25.2223H19.5556C20.9 25.2223 22 24.1223 22 22.7778V5.66672C22 4.32228 20.9 3.22228 19.5556 3.22228ZM19.5556 22.7778H2.44444V10.5556H19.5556V22.7778ZM7.33333 15.4445H4.88889V13.0001H7.33333V15.4445ZM12.2222 15.4445H9.77778V13.0001H12.2222V15.4445ZM17.1111 15.4445H14.6667V13.0001H17.1111V15.4445ZM7.33333 20.3334H4.88889V17.8889H7.33333V20.3334ZM12.2222 20.3334H9.77778V17.8889H12.2222V20.3334ZM17.1111 20.3334H14.6667V17.8889H17.1111V20.3334Z"
                      fill="#FF5C00"
                    />
                  </svg>
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
    </div>
  );
});

PostGrid.displayName = "PostGrid";

export default PostGrid;
