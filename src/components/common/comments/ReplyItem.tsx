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
    <li className="border border-primary-100 p-4 rounded-lg mb-2 mx-auto" style={{ marginRight: "50px" }}>
      {editingReplyId === reply.id ? (
        <div>
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, reply.id)}
            className="w-full p-2 border border-primary-100 rounded-lg mb-2"
            rows={4}
          />
          <button
            onClick={() => handleSaveEdit(reply.id)}
            className="px-4 py-2 mr-2 border-primary-200 font-black bg-primary-100 rounded"
          >
            저장
          </button>
          <button
            onClick={() => setEditingReplyId(null)}
            className="px-4 py-2 bg-white text-primary-600 border border-orange-300 rounded font-black"
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
            style={{ marginLeft: "5px" }} // 좌측 간격 조정
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{reply.user_nickname}</p>
              {reply.user_id === userId && (
                <div className="flex space-x-2 justify-end" style={{ marginRight: "5px" }}>
                  <span
                    onClick={() => handleEditReply(reply.id, reply.content)}
                    className="cursor-pointer"
                    style={{ fontSize: "12px", color: "black" }} // 수정 텍스트 스타일
                  >
                    수정
                  </span>
                  <span
                    onClick={() => handleDeleteReply(reply.id)}
                    className="cursor-pointer"
                    style={{ fontSize: "12px", color: "black" }} // 삭제 텍스트 스타일
                  >
                    삭제
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-gray-800" style={{ fontSize: "14px" }}>
              {reply.content}
            </p>
          </div>
        </div>
      )}
    </li>
  );
};

export default ReplyItem;
