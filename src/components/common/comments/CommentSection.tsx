"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import CommentList from "./CommentList";
import AddComment from "./AddComment";

const supabase = createClient();

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { id: userId } = useUserStore((state) => state);
  const queryKey = ["comments", postId];

  const { data: comments = [], isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Post_comments")
        .select(
          `
          post_comment_id,
          created_at,
          post_id,
          user_id,
          comments,
          Users:user_id (user_nickname) 
        `,
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error.message);
        throw new Error(error.message);
      }

      return data.map((item: any) => ({
        post_comment_id: item.post_comment_id,
        created_at: item.created_at,
        post_id: item.post_id,
        user_id: item.user_id,
        comments: item.comments,
        user_nickname: item.Users?.user_nickname || "",
      }));
    },
  });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">댓글</h2>
      {isError ? (
        <div className="text-center py-10 text-red-500">댓글을 불러오는 중 오류가 발생했습니다.</div>
      ) : (
        <>
          <CommentList comments={comments} userId={userId} queryKey={queryKey} />
          {userId ? <AddComment postId={postId} queryKey={queryKey} /> : <p>로그인 후 댓글을 작성할 수 있습니다.</p>}
        </>
      )}
    </div>
  );
};

export default CommentSection;
