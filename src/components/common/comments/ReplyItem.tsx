import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface Reply {
  id: string; // 대댓글의 고유 ID
  parent_comment_id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  user_nickname?: string;
}

const ReplyItem: React.FC<{
  reply: Reply;
  userId: string | null;
  queryKey: string[];
}> = ({ reply, userId, queryKey }) => {
  const queryClient = useQueryClient();
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const updateReplyMutation = useMutation({
    mutationFn: async ({ replyId, newContent }: { replyId: string; newContent: string }) => {
      const { data, error } = await supabase
        .from("Post_commentreplies")
        .update({ content: newContent })
        .eq("id", replyId)
        .select("*");

      if (error) {
        console.error("Error updating reply:", error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditingReplyId(null);
      setEditingContent("");
    },
    onError: (error) => {
      console.error("Failed to update reply:", error.message);
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const { error } = await supabase.from("Post_commentreplies").delete().eq("id", replyId); // 고유 ID로 대댓글 삭제

      if (error) {
        console.error("Error deleting reply:", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Failed to delete reply:", error.message);
    },
  });

  const handleEditReply = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditingContent(content);
  };

  const handleSaveEdit = (replyId: string) => {
    if (editingContent.trim() === "") {
      alert("대댓글 내용이 비어 있습니다.");
      return;
    }
    updateReplyMutation.mutate({ replyId, newContent: editingContent });
  };

  const handleDeleteReply = (replyId: string) => {
    if (window.confirm("정말로 이 대댓글을 삭제하시겠습니까?")) {
      deleteReplyMutation.mutate(replyId);
    }
  };

  return (
    <li className="border-b py-2">
      {editingReplyId === reply.id ? ( // 수정 기준을 id로 설정
        <div>
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={4}
          />
          <button
            onClick={() => handleSaveEdit(reply.id)} // 수정 기준을 id로 설정
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            저장
          </button>
          <button onClick={() => setEditingReplyId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
            취소
          </button>
        </div>
      ) : (
        <div>
          <p>{reply.content}</p>
          <p className="text-sm text-gray-500">작성자: {reply.user_nickname}</p>
          {reply.user_id === userId && (
            <div className="mt-2">
              <button
                onClick={() => handleEditReply(reply.id, reply.content)} // 수정 기준을 id로 설정
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteReply(reply.id)} // 삭제 기준을 id로 설정
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ReplyItem;
