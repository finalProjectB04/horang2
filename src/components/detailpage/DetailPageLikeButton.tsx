"use client";

import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { supabase } from "../common/contexts/supabase.context";

interface LikeBtnProps {
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
}

const DetailPageLikeButton: React.FC<LikeBtnProps> = ({ contentId, imageUrl, contentTypeId, title, addr1, tel }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        setUserId(session.user.id);
        await ensureUserExists(session.user.id);
      }
    };
    fetchSession();
  }, []); //급하게 pr 올리느라 못바꿨는데 추후 이것도 useQuery로 바꿀게요

  const ensureUserExists = async (userId: string) => {
    const { data: user, error } = await supabase.from("Users").select("id").eq("id", userId).single();

    if (error && error.code === "PGRST116") {
      // 사용자 id를 like 테이블에 추가
      const { error: insertError } = await supabase.from("Users").insert([{ id: userId }]);

      if (insertError) {
        console.error("유저정보(소셜로그인 사용자 데이터 like 테이블 입력) 입력실패:", insertError);
      }
    } else if (error) {
      console.error("유저 정보 가져오기 오류", error);
    }
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["likes", contentId],
    queryFn: async () => {
      const { data: likes, error } = await supabase.from("Likes").select("user_id").eq("content_id", contentId);

      if (error) {
        throw error;
      }
      return likes;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("Likes").delete().match({ user_id: userId, content_id: contentId });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setLikeCount((prev) => prev - 1);
    },
    onError: (error) => {
      console.error("뮤테이션 에러: 좋아요 취소실패", error);
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      // 나중에 모달로 띄우고 로그인 페이지로 라우터 쓰거나..기타 활용해볼것.
      if (!userId) {
        alert("로그인 후 이용해 주세요.");
        throw new Error("세션 정보가 없습니다.");
      }

      const { error } = await supabase.from("Likes").insert([
        {
          user_id: userId,
          content_id: contentId,
          image_url: imageUrl,
          content_type_id: contentTypeId,
          title: title,
          address: addr1,
          tel: tel,
        },
      ]);

      if (error) {
        console.error("좋아요 추가 실패", error);
        throw error;
      } else {
        console.log("좋아요가 성공적으로 등록되었습니다.");
      }
    },
    onSuccess: () => {
      setLikeCount((prev) => prev + 1);
    },
    onError: (error) => {
      console.error("뮤테이션 에러: 좋아요 등록 실패", error);
    },
  });

  useEffect(() => {
    if (data) {
      const result = data.find((item) => item.user_id === userId);
      setLiked(!!result);
      setLikeCount(data.length);
    }
  }, [data, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred...</div>;
  }

  const handleLikeBtn = async () => {
    try {
      if (liked) {
        deleteMutation.mutate(userId!);
      } else {
        addMutation.mutate();
      }
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error("좋아요 상태 업데이트를 실패했습니다", error);
    }
  };

  const likeImage = liked ? "/assets/images/Property 1=Default.png" : "/assets/images/Property 1=fail.png";

  return (
    <button onClick={handleLikeBtn} disabled={!userId}>
      <Image src={likeImage} alt={liked ? "Unlike" : "Like"} width={70} height={70} />
    </button>
  );
};
export default DetailPageLikeButton;
