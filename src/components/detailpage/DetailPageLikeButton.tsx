"use client";

import { useModal } from "@/context/modal.context";
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
  const modal = useModal();

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
      modal.open({
        title: "알림",
        content: (
          <div className="text-center">
            <p>좋아요가 취소되었습니다.</p>
          </div>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["likes", contentId] });
    },
    onError: (error) => {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 취소 중 에러가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });
    },
  });

  const addMutation = useMutation<Likes, Error, Partial<Likes>, ContextType>({
    mutationFn: async (variables) => {
      if (!userId) {
        modal.open({
          title: "알림",
          content: (
            <div className="text-center">
              <p>로그인 후 좋아요를 누를 수 있습니다.</p>
            </div>
          ),
        });
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
      modal.open({
        title: "알림",
        content: (
          <div className="text-center">
            <p>좋아요 등록이 성공했습니다.</p>
          </div>
        ),
      });
    },
    onError: (error) => {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 등록 중 에러가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ),
      });
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
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>좋아요 상태 업데이트를 실패했습니다.</p>
            <p>{(error as Error).message}</p>
          </div>
        ),
      });
    }
  };

  const likeImage =
    data && data.find((item) => item.user_id === userId)
      ? "/assets/images/successLikeIcon.svg"
      : "/assets/images/defaultLikeIcon.svg";

  return (
    <button onClick={handleLikeButton} disabled={!userId}>
      <Image
        src={likeImage}
        alt={liked ? "Unlike" : "Like"}
        width={64}
        height={64}
        className=" lg:pr-4  md:pt-6 md:pr-2 sm:w-[40px] sm:h-[40px] sm:pt-3"
      />
    </button>
  );
};

export default DetailPageLikeButton;
