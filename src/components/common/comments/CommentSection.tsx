"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";

const supabase = createClient();

interface Comment {
  post_comment_id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  comments: string;
  user_nickname?: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
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
      })) as Comment[];
    },
  });

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
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
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error.message);
    },
  });

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    addCommentMutation.mutate(newComment);
  };

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

  if (isError) return <div className="text-center py-10 text-red-500">댓글을 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">댓글</h2>
      <div className="mb-4">
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
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
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
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
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
      {userId ? (
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
      ) : (
        <p>로그인 후 댓글을 작성할 수 있습니다.</p>
      )}
    </div>
  );
};

export default CommentSection;
