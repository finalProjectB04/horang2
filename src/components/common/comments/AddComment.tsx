import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";

const supabase = createClient();

const AddComment: React.FC<{ postId: string; queryKey: string[] }> = ({ postId, queryKey }) => {
  const queryClient = useQueryClient();
  const { id: userId, user_nickname: userNickname, profile_url } = useUserStore((state) => state);
  const [newComment, setNewComment] = useState("");

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="mt-4 max-w-[1440px] mx-auto">
      {userId && (
        <div className="flex items-center mb-4 py-3">
          <Image src={profile_url || "/assets/images/profile_ex.png"} alt="유저 프로필 사진" width={25} height={25} />
          <span className="text-2xl font-bold ml-2 text-grey-700">{userNickname} 님</span>
        </div>
      )}
      <div className="p-4 border border-primary-100 rounded-xl flex items-center bg-grey-50 py-12">
        <textarea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
          className={`w-full p-2 rounded-l-lg resize-none bg-grey-50 text-grey-700 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } border-none flex-grow min-h-[80px] max-h-[500px]`}
          disabled={!userId}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className="mr-5 ml-2 px-4 py-4 text-xl font-black bg-primary-100 text-primary-700 rounded-xl border border-primary-200 hover:bg-primary-400"
          disabled={!userId}
          style={{ width: "100px" }}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default AddComment;
