import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const supabase = createClient();

interface Reply {
  id: string;
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
      const { error } = await supabase.from("Post_commentreplies").delete().eq("id", replyId);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, replyId: string) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveEdit(replyId);
    }
  };

  return (
    <li className="border p-4 rounded-lg mb-2">
      {editingReplyId === reply.id ? (
        <div>
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, reply.id)}
            className="w-full p-2 border rounded mb-2"
            rows={4}
          />
          <button onClick={() => handleSaveEdit(reply.id)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            저장
          </button>
          <button onClick={() => setEditingReplyId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
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
              <p className="font-semibold">{reply.user_nickname}</p>
              {reply.user_id === userId && (
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => handleEditReply(reply.id, reply.content)}
                    className="px-4 py-2 border-primary-200 font-black bg-primary-100 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteReply(reply.id)}
                    className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-gray-800">{reply.content}</p>
          </div>
        </div>
      )}
    </li>
  );
};

export default ReplyItem;
