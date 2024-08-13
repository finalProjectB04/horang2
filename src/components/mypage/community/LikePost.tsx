"use client";

import { getLikePosts } from "@/actions/commnityActions";
import ListTitle from "@/components/common/ListTitle";
import { formatDateToYears } from "@/utils/formatDate";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    console.log("동작"); // 추후 기능 추가 여부
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
      <ListTitle TitleName="좋아요 한 글" onClick={handleGoLikePosts} />
      <section className="sm:mb-[20px] md:mb-[65px] lg:mb-[65px] sm:mx-6">
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-2 md:gap-10 lg:gap-10">
          {getLikePostsQuery.data?.map((post) => {
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
                  className="sm:hidden md:block lg:block w-full h-[224px] object-cover rounded-lg"
                  src={post.files || "/assets/images/community.png"}
                  width={330}
                  height={224}
                  alt="포스트 이미지"
                />
                <div className="text-start sm:py-3 md:py-7 lg:py-7 sm:px-0 md:px-[14px] lg:px-[14px] grid sm:gap-0 gap-2">
                  <p className="sm:text-[12px] md:text-2xl lg:text-2xl font-bold text-secondary-800">{post.title}</p>
                  <p className="sm:text-[10px] md:text-2xl lg:text-2xl font-normal text-secondary-700">
                    {formatDateToYears(post.created_at!)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default LikePost;
