import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import AddReply from "./AddReply";
import ReplyItem from "./ReplyItem";
import Image from "next/image";

const supabase = createClient();

interface Comment {
  post_comment_id: string;
  created_at: string | null;
  post_id: string;
  user_id: string;
  comments: string;
  user_nickname?: string;
}

interface Reply {
  id: string;
  parent_comment_id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  user_nickname?: string;
}

const CommentItem: React.FC<{
  comment: Comment;
  userId: string | null;
  queryKey: string[];
}> = ({ comment, userId, queryKey }) => {
  const queryClient = useQueryClient();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false);

  const deleteReplies = async (commentId: string) => {
    const { error: deleteRepliesError } = await supabase
      .from("Post_commentreplies")
      .delete()
      .eq("parent_comment_id", commentId);

    if (deleteRepliesError) {
      console.error("Error deleting replies:", deleteRepliesError.message);
      throw new Error(deleteRepliesError.message);
    }
  };

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteReplies(commentId);

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
      queryClient.invalidateQueries({ queryKey });
      setEditingCommentId(null);
      setEditingContent("");
    },
    onError: (error) => {
      console.error("Failed to update comment:", error.message);
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

  const { data: replies = [], isError: isRepliesError } = useQuery({
    queryKey: ["replies", comment.post_comment_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Post_commentreplies")
        .select(
          `
          id,
          parent_comment_id,
          created_at,
          post_id,
          user_id,
          content,
          Users:user_id (user_nickname) 
        `,
        )
        .eq("parent_comment_id", comment.post_comment_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching replies:", error.message);
        throw new Error(error.message);
      }

      return data.map((item: any) => ({
        id: item.id,
        parent_comment_id: item.parent_comment_id,
        created_at: item.created_at,
        post_id: item.post_id,
        user_id: item.user_id,
        content: item.content,
        user_nickname: item.Users?.user_nickname || "",
      })) as Reply[];
    },
  });

  return (
    <li className="border-b py-4 bg-gray-50">
      {editingCommentId === comment.post_comment_id ? (
        <div className="bg-white p-4 rounded shadow">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={4}
          />
          <button
            onClick={() => handleSaveEdit(comment.post_comment_id)}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
          >
            저장
          </button>
          <button
            onClick={() => setEditingCommentId(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      ) : (
        <div className="flex items-start space-x-4">
          <Image
            src="/assets/images/profile_ex.png"
            alt="유저 프로필 사진"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{comment.user_nickname}</p>
              {comment.user_id === userId && (
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => handleEditComment(comment.post_comment_id, comment.comments)}
                    className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.post_comment_id)}
                    className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-gray-800">{comment.comments}</p>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
            >
              {showReplies ? "대댓글 숨기기" : "대댓글 보기"}
            </button>
            {showReplies && (
              <div className="ml-4 mt-2">
                {isRepliesError ? (
                  <p className="text-red-500">대댓글을 불러오는 중 오류가 발생했습니다.</p>
                ) : (
                  <ul>
                    {replies.map((reply) => (
                      <ReplyItem
                        key={reply.id}
                        reply={reply}
                        userId={userId}
                        queryKey={["replies", comment.post_comment_id]}
                      />
                    ))}
                  </ul>
                )}
                {userId && (
                  <AddReply
                    parentCommentId={comment.post_comment_id}
                    postId={comment.post_id}
                    queryKey={["replies", comment.post_comment_id]}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export default CommentItem;
