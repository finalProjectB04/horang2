import { useModal } from "@/context/modal.context";
import { Likes } from "@/types/Likes.types";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLikes } from "./useLikes";

const supabase = createClient();

interface LikeButtonProps {
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
  userId: string;
}

interface ContextType {
  previousLikes: Likes[] | undefined;
}

export const useHandleLikeButton = ({ contentId, imageUrl, contentTypeId, title, addr1, tel }: LikeButtonProps) => {
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
        content: "좋아요가 취소되었습니다",
      });

      queryClient.invalidateQueries({ queryKey: ["likes", contentId] });
    },
    onError: (error) => {
      modal.open({
        title: "에러",
        content: "취소 중 에러가 발생했습니다.",
      });
    },
  });

  const addMutation = useMutation<Likes, Error, Partial<Likes>, ContextType>({
    mutationFn: async (variables) => {
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
          content: "에러가 발생했습니다.",
        });
        throw new Error();
      }

      if (!data) {
        modal.open({
          title: "에러",
          content: "데이터가 없습니다.",
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
        content: "나의 공간에 추가되었습니다.",
      });
    },
    onError: (error) => {
      modal.open({
        title: "에러",
        content: "에러가 발생했습니다.",
      });
    },
  });

  const handleLikeButton = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.stopPropagation();
    try {
      if (!userId) {
        modal.open({
          title: "알림",
          content: "로그인 후 이용가능합니다.",
        });
        return;
      }
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
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      const result = data.find((item) => item.user_id === userId);
      setLiked(!!result);
    }
  }, [data, userId]);

  return { liked, isError, isPending, data, handleLikeButton };
};
