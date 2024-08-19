"use client";
import { useModal } from "@/context/modal.context";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";

// 새로 정의한 인터페이스들
interface PostLike {
  post_id: string;
  user_id: string;
}

interface PostLikeQueryData {
  data: PostLike[];
  userLike: boolean;
}

const DEFAULT_HEART = (
  <Image
    src="/assets/images/defaultLikeIcon.svg"
    alt="빈하트"
    width={48}
    height={32}
    className=" w-5 h-5  lg:w-[30px] lg:h-[30px] "
  />
);
const PUSHED_HEART = (
  <Image
    src="/assets/images/successLikeIcon.svg"
    alt="하트"
    width={48}
    height={32}
    className="w-5 h-5  lg:w-[30px] lg:h-[30px] "
  />
);

interface PostLikeProps {
  post_id: string;
  onLikesChange: (likes: number) => void;
  initialLikes: number;
}

const PostLike: React.FC<PostLikeProps> = React.memo(({ post_id, onLikesChange, initialLikes }) => {
  const supabase = createClient();
  const { id: user_id } = useUserStore();
  const queryClient = useQueryClient();
  const modal = useModal();

  const {
    data: getLikes,
    isError: isLikesError,
    error: likesError,
  } = useQuery({
    queryKey: ["postLike", post_id],
    queryFn: async () => {
      if (!post_id) throw new Error("Post ID is missing");
      const { data, error } = await supabase.from("Post_likes").select("*").eq("post_id", post_id);
      if (error) throw error;
      const userLike = !!data?.find((like) => like.user_id === user_id);
      return { data: data || [], userLike } as PostLikeQueryData;
    },
    enabled: !!post_id,
    initialData: { data: [], userLike: false } as PostLikeQueryData,
  });

  useEffect(() => {
    if (getLikes) {
      onLikesChange(getLikes.data.length);
    }
  }, [getLikes, onLikesChange]);

  const handleAddLike = useCallback(async (): Promise<void> => {
    if (!user_id) {
      modal.open({
        title: "오류",
        content: (
          <div className="text-center">
            <p>좋아요는 로그인 유저만</p>
            <p>가능합니다</p>
          </div>
        ),
      });
      return;
    }
    if (!post_id) {
      modal.open({
        title: "오류",
        content: (
          <div className="text-center">
            <p>게시물 ID가 없습니다</p>
          </div>
        ),
      });
      return;
    }
    if (!getLikes?.userLike) {
      const { error } = await supabase.from("Post_likes").insert({ post_id, user_id });
      if (error) throw error;
    } else {
      const { error } = await supabase.from("Post_likes").delete().eq("user_id", user_id).eq("post_id", post_id);
      if (error) throw error;
    }
  }, [user_id, post_id, getLikes?.userLike, supabase]);

  const addMutation = useMutation({
    mutationFn: handleAddLike,
    onMutate: async () => {
      if (!user_id) {
        modal.open({
          title: "오류",
          content: (
            <div className="text-center">
              <p>좋아요는 로그인 유저만</p>
              <p>가능합니다</p>
            </div>
          ),
        });
        return;
      }
      await queryClient.cancelQueries({ queryKey: ["postLike", post_id] });
      const previousLikes = queryClient.getQueryData(["postLike", post_id]) as PostLikeQueryData | undefined;
      queryClient.setQueryData(["postLike", post_id], (old: PostLikeQueryData | undefined) => {
        if (!old) return old;
        return {
          data: !old.userLike
            ? [...old.data, { post_id, user_id }]
            : old.data.filter((like: PostLike) => like.user_id !== user_id),
          userLike: !old.userLike,
        };
      });
      return { previousLikes };
    },
    onError: (err: Error, _: void, context: { previousLikes: PostLikeQueryData | undefined } | undefined) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(["postLike", post_id], context.previousLikes);
      }
      console.error("Error updating like:", err);
      if (typeof window !== "undefined") {
        modal.open({
          title: "오류",
          content: (
            <div className="text-center">
              <p>좋아요 업데이트중</p>
              <p>오류가 발생했습니다</p>
            </div>
          ),
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postLike", post_id] });
    },
  });
  if (isLikesError) {
    return <div>좋아요 정보를 불러오는 중 오류가 발생했습니다: {(likesError as Error).message}</div>;
  }

  const likeCount = getLikes?.data?.length ?? initialLikes;

  return (
    <div>
      <div className="w-full pr-2 flex flex-row gap-x-3">
        <button
          onClick={(event) => {
            event.stopPropagation();
            addMutation.mutate();
          }}
          disabled={!user_id}
        >
          <div className=" flex-shrink-0 flex items-center justify-center ">
            <span>{getLikes?.userLike ? PUSHED_HEART : DEFAULT_HEART}</span>
            <span>{likeCount}</span>
          </div>
        </button>
      </div>
    </div>
  );
});

PostLike.displayName = "PostLike";

export default PostLike;
