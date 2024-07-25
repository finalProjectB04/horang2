import { Comments } from "@/types/Comments.types";
import { fetchSessionData } from "@/utils/fetchSession";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

interface DetailPagePostListProps {
  contentId: string;
}

const DetailPagePostList: React.FC<DetailPagePostListProps> = ({ contentId }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const {
    data: sessionData,
    isLoading: pendingSessionData,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  const {
    data: commentData,
    isLoading: pendingComments,
    error: commentError,
  } = useQuery<Comments[], Error, Comments[]>({
    queryKey: ["comments", contentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("Comments").select("*").eq("content_id", contentId);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const handleUpdate = async (commentId: string) => {
    const { error } = await supabase
      .from("Comments")
      .update({ comment: newComment })
      .eq("comment_id", commentId)
      .single();

    if (error) {
      console.error("Error updating comment:", error.message);
    } else {
      setEditCommentId(null);
      setNewComment("");
    }
  };

  const handleDelete = async (commentId: string) => {
    console.log("Deleting comment with ID:", commentId);
    const { error } = await supabase.from("Comments").delete().eq("comment_id", commentId).single();

    if (error) {
      console.error("Error deleting comment:", error.message);
    } else {
    }
  };

  const handleEdit = (comment: Comments) => {
    setEditCommentId(comment.comment_id);
    setNewComment(comment.comment || "");
  };

  if (pendingSessionData || pendingComments) {
    return <div>불러오는중...</div>;
  }

  if (sessionError) {
    return <h1>에러가 발생했습니다: {sessionError.message}</h1>;
  }

  if (commentError) {
    return <h1>에러가 발생했습니다: {commentError.message}</h1>;
  }

  return (
    <div className="mt-4 max-w-[1440px] mx-auto">
      {commentData &&
        commentData.map((comment: Comments, index) => (
          <div
            className="p-4 border border-gray-300 rounded-lg flex flex-col items-start mx-auto mb-4"
            key={comment.comment_id ? comment.comment_id : `comment-${index}`}
          >
            <div className="flex items-center w-full">
              <Image
                src="/assets/images/profile_ex.png"
                alt="유저 프로필 사진"
                width={45}
                height={45}
                className="mr-4"
              />
              <div>
                <h1 className="font-bold py-2">작성자: {comment.user_email} 님</h1>
                <h2 className="py-2">{comment.created_at}</h2>
              </div>
            </div>
            <div className="ml-12 mt-2 w-full">
              {editCommentId === comment.comment_id ? (
                <div>
                  <textarea
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button onClick={() => handleUpdate(comment.comment_id)}>저장</button>
                  <button onClick={() => setEditCommentId(null)}>취소</button>
                </div>
              ) : (
                <p className="py-2">{comment.comment}</p>
              )}
              {sessionData && sessionData.user.id === comment.user_id && (
                <div>
                  <button onClick={() => handleEdit(comment)}>수정</button>
                  <button onClick={() => handleDelete(comment.comment_id)}>삭제</button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default DetailPagePostList;
