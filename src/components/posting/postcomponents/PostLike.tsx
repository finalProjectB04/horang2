"use client";
import React, { useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DEFAULT_HEART = "🤍";
const PUSHED_HEART = "❤️";

interface PostLikeProps {
  post_id: string;
  onLikesChange: (likes: number) => void;
  initialLikes: number;
}

const PostLike: React.FC<PostLikeProps> = React.memo(({ post_id, onLikesChange, initialLikes }) => {
  const supabase = createClient();
  const { id: user_id } = useUserStore();
  const queryClient = useQueryClient();

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
      return { data: data || [], userLike };
    },
    enabled: !!post_id,
    initialData: { data: [], userLike: false },
  });

  useEffect(() => {
    if (getLikes) {
      onLikesChange(getLikes.data.length);
    }
  }, [getLikes, onLikesChange]);

  const handleAddLike = useCallback(async (): Promise<void> => {
    if (!user_id) {
      alert("로그인이 필요한 서비스입니다");
      return;
    }
    if (!post_id) {
      alert("게시물 ID가 없습니다");
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
        alert("로그인이 필요한 서비스입니다");
        return;
      }
      await queryClient.cancelQueries({ queryKey: ["postLike", post_id] });
      const previousLikes = queryClient.getQueryData(["postLike", post_id]);
      queryClient.setQueryData(["postLike", post_id], (old: any) => {
        if (!old) return old;
        return {
          data: !old.userLike
            ? [...old.data, { post_id, user_id }]
            : old.data.filter((like: any) => like.user_id !== user_id),
          userLike: !old.userLike,
        };
      });
      return { previousLikes };
    },
    onError: (err, _, context: any) => {
      if (context) {
        queryClient.setQueryData(["postLike", post_id], context.previousLikes);
      }
      console.error("Error updating like:", err);
      if (typeof window !== "undefined") {
        alert("좋아요 업데이트 중 오류가 발생했습니다.");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postLike", post_id] });
    },
  });

  if (isLikesError) {
    console.error("Likes query error:", likesError);
    return <div>좋아요 정보를 불러오는 중 오류가 발생했습니다: {(likesError as Error).message}</div>;
  }

  const likeCount = getLikes?.data?.length ?? initialLikes;

  return (
    <div>
      <div className="w-full px-2 py-3 flex flex-row gap-x-3">
        <button onClick={() => addMutation.mutate()} disabled={!user_id}>
          <span className="text-2xl">{getLikes?.userLike ? PUSHED_HEART : DEFAULT_HEART}</span>
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
});

PostLike.displayName = "PostLike";

export default PostLike;
