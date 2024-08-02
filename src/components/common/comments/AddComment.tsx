import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";

const supabase = createClient();

const AddComment: React.FC<{
  postId: string;
  queryKey: string[];
}> = ({ postId, queryKey }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const { id: userId } = useUserStore((state) => state);

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

  return (
    <div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="w-full p-2 border rounded mb-2"
        rows={4}
      />
      <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded">
        댓글 작성
      </button>
    </div>
  );
};

export default AddComment;
