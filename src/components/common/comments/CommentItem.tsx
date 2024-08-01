import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import ReplySection from "./ReplySection";

const supabase = createClient();

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId }) => {
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const { id: userId } = useUserStore((state) => state);

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, newContent }: { commentId: string; newContent: string }) => {
      const { data, error } = await supabase
        .from("Post_comments")
        .update({ comments: newContent })
        .eq("post_comment_id", commentId)
        .select("*");

      if (error) {
        console.error("Error updating comment:", error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setEditingCommentId(null);
      setEditingContent("");
    },
    onError: (error) => {
      console.error("Failed to update comment:", error.message);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("Post_comments").delete().eq("post_comment_id", commentId);

      if (error) {
        console.error("Error deleting comment:", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error.message);
    },
  });

  const addReplyMutation = useMutation({
    mutationFn: async (reply: string, parentCommentId: string) => {
      if (!userId) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("Post_commentreplies")
        .insert([{ parent_comment_id: parentCommentId, post_id: postId, user_id: userId, content: reply }]);

      if (error) {
        console.error("Error adding reply:", error.message);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewReply("");
    },
    onError: (error) => {
      console.error("Failed to add reply:", error.message);
    },
  });

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editingContent.trim() === "") {
      alert("댓글 내용이 비어 있습니다.");
      return;
    }
    updateCommentMutation.mutate({ commentId, newContent: editingContent });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleAddReply = (parentCommentId: string) => {
    if (newReply.trim() === "") {
      alert("답글 내용을 입력하세요.");
      return;
    }
    addReplyMutation.mutate(newReply, parentCommentId);
  };

  return (
    <li key={comment.post_comment_id} className="border-b py-2">
      {editingCommentId === comment.post_comment_id ? (
        <div>
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={4}
          />
          <button
            onClick={() => handleSaveEdit(comment.post_comment_id)}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            저장
          </button>
          <button onClick={() => setEditingCommentId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
            취소
          </button>
        </div>
      ) : (
        <div>
          <p>{comment.comments}</p>
          <p className="text-sm text-gray-500">작성자: {comment.user_nickname}</p>
          {comment.user_id === userId && (
            <div className="mt-2">
              <button
                onClick={() => handleEditComment(comment.post_comment_id, comment.comments)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteComment(comment.post_comment_id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                삭제
              </button>
            </div>
          )}
          <ReplySection
            replies={comment.replies}
            handleAddReply={(content) => handleAddReply(comment.post_comment_id)}
            newReply={newReply}
            setNewReply={setNewReply}
          />
        </div>
      )}
    </li>
  );
};

export default CommentItem;
