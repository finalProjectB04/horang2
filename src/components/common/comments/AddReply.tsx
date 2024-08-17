import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useModal } from "@/context/modal.context";

const supabase = createClient();

const AddReply: React.FC<{
  postId: string;
  parentCommentId: string;
  queryKey: string[];
}> = ({ postId, parentCommentId, queryKey }) => {
  const queryClient = useQueryClient();
  const { id: userId } = useUserStore((state) => state);
  const [newReply, setNewReply] = useState("");
  const [replyCount, setReplyCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const replyTimestamps = useRef<number[]>([]);
  const modal = useModal();

  const addReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("Post_commentreplies")
        .insert([{ post_id: postId, parent_comment_id: parentCommentId, user_id: userId, content }]);

      if (error) {
        modal.open({
          title: "에러",
          content: <div className="text-center">대댓글 작성 중 오류가 발생했습니다.</div>,
        });
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewReply("");
      setReplyCount((prev) => prev + 1);
      replyTimestamps.current.push(Date.now());

      if (replyTimestamps.current.length > 3) {
        replyTimestamps.current.shift();
      }

      const timeDiff = replyTimestamps.current[replyTimestamps.current.length - 1] - replyTimestamps.current[0];

      if (timeDiff < 3000 && replyTimestamps.current.length === 3) {
        setIsBlocked(true);
        modal.open({
          title: "차단",
          content: <div className="text-center">대댓글을 너무 빠르게 작성하셨습니다. 5초 후에 다시 시도해주세요.</div>,
        });
        setTimeout(() => setIsBlocked(false), 5000);
      }
    },
    onError: (error) => {
      modal.open({
        title: "실패",
        content: <div className="text-center">대댓글 작성에 실패했습니다. 다시 시도해주세요.</div>,
      });
    },
  });

  const handleAddReply = () => {
    if (isBlocked) {
      modal.open({
        title: "차단",
        content: <div className="text-center">대댓글을 너무 빠르게 작성하셨습니다. 잠시 후 다시 시도해주세요.</div>,
      });
      return;
    }

    if (newReply.trim() === "") {
      modal.open({
        title: "경고",
        content: <div className="text-center">대댓글 내용을 입력하세요.</div>,
      });
      return;
    }
    addReplyMutation.mutate(newReply);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddReply();
    }
  };

  return (
    <div className="mt-[20px] mx-4 mb-4">
      <div className="p-2 border border-primary-100 rounded-xl bg-grey-50 flex items-center sm:flex-row sm:space-x-2 sm:p-3 sm:border-none">
        <textarea
          value={newReply}
          onChange={(event) => setNewReply(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={userId ? "대댓글을 작성하세요" : "대댓글 작성은 로그인한 유저만 가능합니다"}
          className={`w-full h-[70px] sm:h-[40px] p-2 resize-none sm:bg-[#E6E6E6] bg-grey-50 text-grey-700 sm:text-[14px] sm:leading-5 sm:text-grey-600 sm:flex-grow sm:pl-[24px] ${
            !userId ? "text-grey-500" : "text-grey-900"
          } border-none rounded-l-lg sm:rounded-r-lg`}
          disabled={!userId || isBlocked}
          maxLength={2000}
        />
        <button
          onClick={handleAddReply}
          className="mt-2 sm:mt-0 sm:w-[60px] sm:h-[40px] sm:text-[12px] sm:font-bold sm:text-white sm:bg-primary-400 sm:rounded-2xl w-[70px] h-[40px] text-lg font-black bg-primary-100 text-primary-700 rounded-xl border border-primary-200 hover:bg-primary-400"
          disabled={!userId || isBlocked}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default AddReply;
