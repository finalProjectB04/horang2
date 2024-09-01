import { useModal } from "@/context/modal.context";
import { Likes } from "@/types/Likes.types";
import { ApiInformation } from "@/types/Main";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useLikes } from "./useLikes";

interface MainTravelSliderProps {
  travel: ApiInformation[];
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

export const useHandleLikeButtonSwiper = ({
  travel,
  contentId,
  imageUrl,
  contentTypeId,
  title,
  addr1,
  tel,
}: MainTravelSliderProps) => {
  const modal = useModal();

  const supabase = createClient();
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  const { id: userId } = useUserStore();
  const item = travel[0] as ApiInformation;
  const { isPending, isError, data } = useLikes(travel[0].contentid, userId);

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("Likes").delete().match({ user_id: userId, content_id: item.contentid });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      modal.open({
        title: "알림",
        content: "좋아요가 취소되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["likes", item.contentid] });
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
            content_id: variables.content_id,
            image_url: variables.image_url,
            content_type_id: variables.content_type_id,
            title: variables.title,
            address: variables.address,
            tel: variables.tel,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
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
      await queryClient.cancelQueries({ queryKey: ["likes", variables.content_id] });
      const previousLikes = queryClient.getQueryData<Likes[]>(["likes", variables.content_id]);

      if (previousLikes) {
        const newLikes = [...previousLikes, variables as Likes];
        queryClient.setQueryData<Likes[]>(["likes", variables.content_id], newLikes);
      } else {
        queryClient.setQueryData<Likes[]>(["likes", variables.content_id], [variables as Likes]);
      }

      return { previousLikes };
    },

    onSettled: (variables) => {
      modal.open({
        title: "알림",
        content: "나의 공간에 추가되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["likes", variables?.content_id] });
    },

    onError: (error, variables, context) => {
      modal.open({
        title: "에러",
        content: "에러가 발생했습니다.",
      });

      if (context?.previousLikes) {
        queryClient.setQueryData<Likes[]>(["likes", variables?.content_id], context.previousLikes);
      }
    },
  });
  const handleLikeButton = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const contentId = event.currentTarget.getAttribute("data-contentid");

      if (!contentId) {
        modal.open({
          title: "에러",
          content: "Content ID가 없습니다!",
        });

        return;
      }

      try {
        if (!userId) {
          modal.open({
            title: "알림",
            content: "로그인 후 이용가능합니다.",
          });
          return;
        }
        if (likedStates[contentId]) {
          deleteMutation.mutate(userId!);
        } else {
          const item = travel.find((item) => item.contentid === contentId);

          if (!item) {
            modal.open({
              title: "에러",
              content: "Item not found 에러",
            });
            return;
          }

          addMutation.mutate({
            user_id: userId!,
            content_id: item.contentid,
            image_url: item.firstimage,
            content_type_id: item.contenttypeid,
            title: item.title,
            address: item.addr1,
            tel: item.tel,
          });
        }

        setLikedStates((prevStates) => ({
          ...prevStates,
          [contentId]: !prevStates[contentId],
        }));
      } catch (error) {
        modal.open({
          title: "에러",
          content: "좋아요 상태 업데이트를 실패했습니다.",
        });
      }
    },
    [likedStates, addMutation, deleteMutation, userId, modal, travel],
  );

  useEffect(() => {
    if (data) {
      const newLikedStates = travel.reduce((acc, item) => {
        const result = data.find((like) => like.user_id === userId && like.content_id === item.contentid);
        acc[item.contentid] = !!result;
        return acc;
      }, {} as Record<string, boolean>);
      setLikedStates(newLikedStates);
    }
  }, [data, travel, userId]);
  return { likedStates, isError, isPending, data, handleLikeButton };
};
