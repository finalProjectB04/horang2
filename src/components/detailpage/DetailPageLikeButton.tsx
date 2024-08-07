"use client";

import { Likes } from "@/types/Likes.types";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const supabase = createClient();

interface LikeButtonProps {
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
}

interface ContextType {
  previousLikes: Likes[] | undefined;
}

const DetailPageLikeButton: React.FC<LikeButtonProps> = ({ contentId, imageUrl, contentTypeId, title, addr1, tel }) => {
  const [liked, setLiked] = useState<Boolean>(false);

  const queryClient = useQueryClient();

  const { id: userId } = useUserStore();

  const { isPending, isError, data } = useQuery<Likes[]>({
    queryKey: ["likes", contentId],
    queryFn: async () => {
      const { data: likes, error } = await supabase.from("Likes").select("*").eq("content_id", contentId);
      if (error) {
        throw error;
      }
      return likes;
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("Likes").delete().match({ user_id: userId, content_id: contentId });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      alert("좋아요가 취소되었습니다");
      queryClient.invalidateQueries({ queryKey: ["likes", contentId] });
    },
    onError: (error) => {
      console.error("뮤테이션 에러: 좋아요 취소실패", error);
    },
  });

  const addMutation = useMutation<Likes, Error, Partial<Likes>, ContextType>({
    mutationFn: async (variables) => {
      if (!userId) {
        alert("로그인 후 좋아요를 누를 수 있습니다.");
        throw new Error("세션 정보가 없습니다.");
      }

      const { data, error } = await supabase
        .from("Likes")
        .insert([
          {
            user_id: userId,
            content_id: contentId,
            image_url: imageUrl,
            content_type_id: contentTypeId,
            title: title,
            address: addr1,
            tel: tel,
          },
        ])
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("좋아요 추가에 실패했습니다.");
      }

      return data as Likes;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["likes", contentId] });
      const previousLikes = queryClient.getQueryData<Likes[]>(["likes", contentId]);

      if (previousLikes) {
        queryClient.setQueryData<Likes[]>(["likes", contentId], [...previousLikes, variables as Likes]);
      } else {
        queryClient.setQueryData<Likes[]>(["likes", contentId], [variables as Likes]);
      }

      return { previousLikes };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", contentId] });
      alert("좋아요 등록이 성공했습니다.");
    },
  });

  useEffect(() => {
    if (data) {
      const result = data.find((item) => item.user_id === userId);
      setLiked(!!result);
    }
  }, [data, userId]);

  if (isPending) {
    return <Image src="/assets/images/defaultLikeIcon.png" alt={"Unlike"} width={70} height={70} />;
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
  }

  const handleLikeButton = async () => {
    try {
      if (liked) {
        deleteMutation.mutate(userId!);
      } else {
        addMutation.mutate({
          user_id: userId,
          content_id: contentId,
          image_url: imageUrl,
          content_type_id: contentTypeId,
          title: title,
          address: addr1,
          tel: tel,
        });
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
    <button onClick={handleLikeButton} disabled={!userId}>
      <Image
        src={likeImage}
        alt={liked ? "Unlike" : "Like"}
        width={96}
        height={96}
        className="desktop:pt-10 desktop:pr-4 desktop:py-2 tablet:w-24 tablet:h-24 tablet:pt-6 tablet:pr-2"
      />
    </button>
  );
};

export default DetailPageLikeButton;
