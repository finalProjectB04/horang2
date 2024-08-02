import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";

const supabase = createClient();

const AddReply: React.FC<{
  postId: string;
  parentCommentId: string;
  queryKey: string[];
}> = ({ postId, parentCommentId, queryKey }) => {
  const queryClient = useQueryClient();
  const [newReply, setNewReply] = useState("");
  const { id: userId } = useUserStore((state) => state);

  const addReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("Post_commentreplies")
        .insert([{ post_id: postId, parent_comment_id: parentCommentId, user_id: userId, content }]);

      if (error) {
        console.error("Error adding reply:", error.message);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewReply("");
    },
    onError: (error) => {
      console.error("Failed to add reply:", error.message);
    },
  });

  const handleAddReply = () => {
    if (newReply.trim() === "") {
      alert("대댓글 내용을 입력하세요.");
      return;
    }
    addReplyMutation.mutate(newReply);
  };

  return (
    <div>
      <textarea
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        placeholder="대댓글을 입력하세요..."
        className="w-full p-2 border rounded mb-2"
        rows={4}
      />
      <button onClick={handleAddReply} className="bg-blue-500 text-white px-4 py-2 rounded">
        대댓글 작성
      </button>
    </div>
  );
};

export default AddReply;
