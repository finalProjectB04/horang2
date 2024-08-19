"use client";

import { getPosts } from "@/actions/commnityActions";
import ListTitle from "@/components/mypage/community/ListTitle";
import { formatDateToYears } from "@/utils/formatDate";
import { createClient } from "@/utils/supabase/client";
import { createServerSupabaseClient } from "@/utils/supabase/serverAdmin";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Skeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="h-[110px] bg-gray-200 rounded-lg mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-1"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
  </div>
);

const MyPost = () => {
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

  const handleGoMyPosts = (): void => {
    router.push("community");
  };

  const getPostsQuery = useQuery({
    queryKey: ["posts", myId],
    queryFn: async () => {
      const posts = await getPosts({ myId });
      return posts;
    },
  });

  return (
    <>
      <ListTitle TitleName="내가 쓴 글" onClick={handleGoMyPosts} src={`/assets/images/edit_post_icon.svg`} />
      <section className="sm:mb-[20px] md:mb-10 lg:mb-10 sm:mx-6">
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-2 md:gap-10 lg:gap-10">
          {getPostsQuery.isPending ? (
            Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} />)
          ) : getPostsQuery.data?.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg font-bold">아직 작성한 게시글이 없습니다.</p>
              <p className="text-sm text-grey-400">국내 여행에 대한 생생한 정보를 호랑객과 나눠보세요!</p>
            </div>
          ) : (
            getPostsQuery.data?.map((post) => {
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

export default MyPost;
