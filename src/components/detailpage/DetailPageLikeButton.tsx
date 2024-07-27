"use client";

import React, { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import { supabase } from "@/utils/supabase/client";

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
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  //supabase ssr로 임포트하면 안되구 client 임포트 하면 좋아요 기능 작동하네요
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
  }, []);

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

  const { isPending, isError, data } = useQuery({
    queryKey: ["likes", contentId],
    queryFn: async () => {
      const { data: likes, error } = await supabase.from("Likes").select("user_id").eq("content_id", contentId);

      if (error) {
        throw error;
      }
      return likes;
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await supabase.from("Likes").delete().match({ user_id: userId, content_id: contentId });
    },
    onSuccess: () => {
      alert("좋아요가 취소되었습니다");
      queryClient.invalidateQueries({ queryKey: ["likes", contentId] });
    },
    onError: (error) => {
      console.error("뮤테이션 에러: 좋아요 취소실패", error);
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      // 나중에 모달로 띄우고 로그인 페이지로 라우터 쓰거나..기타 활용해볼것.
      if (!userId) {
        alert("로그인 후 좋아요를 누를 수 있습니다.");
        throw new Error("세션 정보가 없습니다.");
      }

      const response = await supabase.from("Likes").insert([
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
    },
    onSuccess: () => {
      alert("좋아요 등록이 성공했습니다.");
      queryClient.invalidateQueries({ queryKey: ["likes", contentId] });
    },
    onError: (error) => {
      console.error("뮤테이션 에러: 좋아요 등록 실패", error);
    },
  });

  useEffect(() => {
    if (data) {
      const result = data.find((item) => item.user_id === userId);
      setLiked(!!result);
    }
  }, [data, userId]);

  if (isPending) {
    return <div>불러오는중...</div>;
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
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

  const likeImage =
    data && data.find((item) => item.user_id === userId)
      ? "/assets/images/successLikeIcon.png"
      : "/assets/images/defaultLikeIcon.png";

  return (
    <button onClick={handleLikeBtn} disabled={!userId}>
      <Image src={likeImage} alt={liked ? "Unlike" : "Like"} width={70} height={70} />
    </button>
  );
};
export default DetailPageLikeButton;
