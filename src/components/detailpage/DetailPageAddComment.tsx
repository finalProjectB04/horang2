"use client";

import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

const supabase = createClient();

interface DetailPageAddCommentProps {
  contentId: string;
  contenTypeId: string;
}

const DetailPageAddComment: React.FC<DetailPageAddCommentProps> = ({ contentId, contenTypeId }) => {
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();
  const { id: userId, user_email: userEmail, user_nickname: userNickname, profile_url: profileUrl } = useUserStore();

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        console.log("User is not logged in. Comment cannot be added.");
        throw new Error("로그인 후 댓글을 작성할 수 있습니다.");
      }

      const response = await supabase.from("Comments").insert([
        {
          user_id: userId,
          content_id: contentId,
          comment,
          content_type_id: contenTypeId,
          user_email: userEmail,
          user_nickname: userNickname,
          user_profile_url: profileUrl,
        },
      ]);

      if (response.error) {
        throw response.error;
      }
    },
    onSuccess: () => {
      setComment("");
      alert("댓글 작성 성공!");
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
    },
    onError: (error: Error) => {
      alert(`댓글 작성 실패: ${error.message}`);
    },
  });

  const handleAddComment = () => {
    addCommentMutation.mutate();
  };

  return (
    <main className="mt-4 max-w-[1440px] mx-auto">
      {userId && (
        <div className="flex items-center mb-4 py-3">
          {profileUrl && (
            <Image src={profileUrl || "/assets/images/profile_ex.png"} alt="유저 프로필 사진" width={25} height={25} />
          )}
          <span className="text-2xl font-bold ml-2 text-grey-700">{userNickname} 님</span>
        </div>
      )}
      <div className="p-4 border border-primary-100 rounded-xl flex items-center bg-grey-50 py-12">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
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
    </main>
  );
};

export default DetailPageAddComment;
