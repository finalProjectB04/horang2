"use client";

import { useModal } from "@/context/modal.context";
import { useLikes } from "@/hooks/detailpage/useLikes";
import { Likes } from "@/types/Likes.types";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const { isPending, isError, data } = useLikes(contentId, userId);

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
        throw new Error();
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
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>에러가 발생했습니다</p>
            </div>
          ),
        });
        throw new Error();
      }

      if (!data) {
        modal.open({
          title: "에러",
          content: (
            <div className="text-center">
              <p>데이터가 없습니다</p>
            </div>
          ),
        });
        throw new Error();
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
            <p>장소가 나의 공간에</p>
            <p>추가되었습니다.</p>
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
    return (
      <Image
        src="/assets/images/defaultLikeIcon.svg"
        alt={"Unlike"}
        width={32}
        height={32}
        className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
      />
    );
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
  }

  const handleLikeButton = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.stopPropagation();
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
        width={32}
        height={32}
        className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
      />
    </button>
  );
};

export default DetailPageLikeButton;
