"use client";

import { getLikePosts } from "@/actions/commnityActions";
import ListTitle from "@/components/mypage/community/ListTitle";
import { formatDateToYears } from "@/utils/formatDate";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Skeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="h-[110px] bg-grey-200 rounded-lg mb-2"></div>
    <div className="h-4 bg-grey-200 rounded mb-1"></div>
    <div className="h-4 bg-grey-200 rounded"></div>
  </div>
);

const LikePost = () => {
  const [myId, setMyId] = useState("");
  const [session, setSession] = useState("");
  const supabase = createClient();

  const router = useRouter();

  useEffect(() => {
    const getSessionData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from("Users").select("*").eq("id", session?.user.id);
        if (data) {
          setMyId(data[0].id);
        }
      }
    };
    getSessionData();
  }, []);

  const handleGoLikePosts = (): void => {
    router.push("community");
  };

  const getLikePostsQuery = useQuery({
    queryKey: ["likePosts", myId],
    queryFn: async () => {
      const likePosts = await getLikePosts({ myId });
      return likePosts;
    },
  });

  return (
    <>
      <ListTitle TitleName="좋아요 한 글" onClick={handleGoLikePosts} src={`/assets/images/community_icon.svg`} />
      <section className="sm:mb-[20px] md:mb-10 lg:mb-10 sm:mx-6">
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-2 md:gap-10 lg:gap-10">
          {getLikePostsQuery.isPending ? (
            Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} />)
          ) : getLikePostsQuery.data?.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg font-bold">아직 좋아요한 게시글이 없습니다.</p>
              <p className="text-sm text-grey-400">호랑이 모임에서 도움이 될 만한 글을 찾아보세요!</p>
            </div>
          ) : (
            getLikePostsQuery.data?.map((post) => {
              return (
                <div
                  key={post.id}
                  className="flex flex-col cursor-pointer"
                  onClick={() => router.push(`postDetail/${post.id}`)}
                >
                  <Image
                    className="sm:block md:hidden lg:hidden w-full h-[110px] object-cover rounded-lg"
                    src={post.files || "/assets/images/community.png"}
                    width={104}
                    height={110}
                    alt="포스트 이미지"
                  />
                  <Image
                    className="sm:hidden md:block lg:block w-full h-[149px] object-cover rounded-lg"
                    src={post.files || "/assets/images/community.png"}
                    width={220}
                    height={149}
                    alt="포스트 이미지"
                  />
                  <div className="text-start sm:py-3 md:py-[19px] lg:py-[19px] sm:px-0 md:px-[9px] lg:px-[9px] grid sm:gap-0 gap-1">
                    <p className="sm:text-[12px] md:text-base lg:text-base font-bold text-secondary-800">
                      {post.title}
                    </p>
                    <p className="sm:text-[10px] md:text-base lg:text-base font-normal text-secondary-700">
                      {formatDateToYears(post.created_at!)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
};

export default LikePost;
