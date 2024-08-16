import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";

const supabase = createClient();

const AddComment: React.FC<{ postId: string; queryKey: string[] }> = ({ postId, queryKey }) => {
  const queryClient = useQueryClient();
  const { id: userId } = useUserStore((state) => state);
  const [newComment, setNewComment] = useState("");

  const addCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      if (!userId) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("Post_comments")
        .insert([{ post_id: postId, user_id: userId, comments: comment }]);

      if (error) {
        console.error("Error adding comment:", error.message);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewComment("");
    },
    onError: (error) => {
      console.error("Failed to add comment:", error.message);
    },
  });

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addCommentMutation.mutate(newComment);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="mt-4 max-w-[1440px] mx-auto">
      <div className="p-4 border border-primary-100 rounded-xl flex items-center bg-grey-50">
        <textarea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
          className={`w-full sm:w-[90%] lg:w-[1438px] h-[100px] p-2 resize-none bg-grey-50 text-grey-700 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } border-none rounded-l-lg`}
          disabled={!userId}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className="ml-2 sm:ml-4 lg:ml-[38px] w-[100px] sm:w-[120px] lg:w-[150px] h-[50px] sm:h-[55px] lg:h-[60px] text-lg sm:text-xl font-black bg-primary-100 text-primary-700 rounded-xl border border-primary-200 hover:bg-primary-400"
          disabled={!userId}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default AddComment;
