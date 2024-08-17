import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useModal } from "@/context/modal.context";

const supabase = createClient();

const AddComment: React.FC<{ postId: string; queryKey: string[] }> = ({ postId, queryKey }) => {
  const queryClient = useQueryClient();
  const { id: userId } = useUserStore((state) => state);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const commentTimestamps = useRef<number[]>([]);
  const modal = useModal(); // Use modal for notifications

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
      setCommentCount((prev) => prev + 1);
      commentTimestamps.current.push(Date.now());

      if (commentTimestamps.current.length > 3) {
        commentTimestamps.current.shift();
      }

      const timeDiff = commentTimestamps.current[commentTimestamps.current.length - 1] - commentTimestamps.current[0];

      if (timeDiff < 3000 && commentTimestamps.current.length === 3) {
        setIsBlocked(true);
        modal.open({
          title: "차단",
          content: <div className="text-center">댓글을 너무 빠르게 작성하셨습니다. 5초 후에 다시 시도해주세요.</div>,
        });
        setTimeout(() => setIsBlocked(false), 5000);
      }
    },
    onError: (error) => {
      console.error("Failed to add comment:", error.message);
    },
  });

  const handleAddComment = () => {
    if (isBlocked) {
      modal.open({
        title: "차단",
        content: <div className="text-center">댓글을 너무 빠르게 작성하셨습니다. 잠시 후 다시 시도해주세요.</div>,
      });
      return;
    }

    if (newComment.trim() === "") {
      modal.open({
        title: "경고",
        content: <div className="text-center">댓글 내용을 입력하세요.</div>,
      });
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
      <div className="p-4 border border-primary-100 rounded-xl flex items-center bg-grey-50 sm:flex-row sm:space-x-2 sm:p-3 sm:border-none">
        <textarea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
          className={`w-full h-[100px] sm:h-[40px] p-2 resize-none sm:bg-[#E6E6E6] bg-grey-50 text-grey-700 sm:text-[14px] sm:leading-5 sm:text-grey-600 sm:flex-grow sm:pl-[24px] ${
            !userId ? "text-grey-500" : "text-grey-900"
          } border-none rounded-l-lg sm:rounded-r-lg`}
          disabled={!userId || isBlocked}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 sm:mt-0 sm:w-[60px] sm:h-[40px] sm:text-[12px] sm:font-bold sm:text-white sm:bg-primary-400 sm:rounded-2xl w-[70px] h-[40px] text-lg font-black bg-primary-100 text-primary-700 rounded-xl border border-primary-200 hover:bg-primary-400"
          disabled={!userId || isBlocked}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default AddComment;
