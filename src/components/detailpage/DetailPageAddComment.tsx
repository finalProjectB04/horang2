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
    <main className="desktop:mt-4 desktop:max-w-[1440px] desktop:mx-auto">
      {userId && (
        <div className="desktop:flex desktop:items-center desktop:mb-4 desktop:py-3">
          {profileUrl && (
            <Image src={profileUrl || "/assets/images/profile_ex.png"} alt="유저 프로필 사진" width={25} height={25} />
          )}
          <span className="desktop:text-2xl desktop:font-bold desktop:ml-2 desktop:text-grey-800">
            {userNickname} 님
          </span>
        </div>
      )}
      <div className="desktop:p-4 desktop:border desktop:border-primary-100 desktop:rounded-xl desktop:flex desktop:items-center desktop:bg-grey-50 desktop:h-[226px] desktop:place-items-center">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={userId ? "댓글을 작성하세요" : "댓글 작성은 로그인한 유저만 가능합니다"}
          className={`desktop:max-w-[1200px] desktop:p-6 desktop:py-15 desktop:rounded-l-lg desktop:resize-none desktop:bg-grey-50 desktop:h-[150px] desktop:flex desktop:flex-col desktop:text-[28px] desktop:leading-[40px] desktop:overflow-hidden desktop:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } desktop:border-none desktop:flex-grow desktop:min-h-[80px] desktop:max-h-[500px]`}
          disabled={!userId}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className={`desktop:ml-8 desktop:flex w-[150px] desktop:h-[80px] desktop:flex-col desktop:justify-center desktop:items-center desktop:gap-[10px] desktop:text-[30px] desktop:font-black desktop:bg-primary-100 desktop:text-primary-700 desktop:rounded-[20px] desktop:border-2 desktop:border-primary-200 desktop:hover:bg-primary-400`}
          disabled={!userId}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default DetailPageAddComment;
