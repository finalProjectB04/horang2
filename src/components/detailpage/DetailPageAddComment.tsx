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
    <main className="sm:mt-[140px] sm:max-w-[375px] sm:mx-auto md:mt-4 md:max-w-[1024px] md:mx-auto lg:mt-4 lg:max-w-[1440px] lg:mx-auto">
      {userId && (
        <div className="sm:pl-[22px] sm:flex sm:items-center sm:py-3 md:flex md:items-center md:mb-4 md:py-3 lg:flex lg:items-center lg:mb-4 lg:py-3">
          {profileUrl && (
            <Image src={profileUrl || "/assets/images/profile_ex.png"} alt="유저 프로필 사진" width={20} height={20} />
          )}
          <span className="sm:text-base sm:font-bold sm:ml-2 sm:text-grey-800 md:text-xl md:font-bold md:ml-2 md:text-grey-800 lg:text-2xl lg:font-bold lg:ml-2 lg:text-grey-800">
            {userNickname} 님
          </span>
        </div>
      )}
      <div className="sm:p-3 sm:border-none sm:h-[102px] sm:border sm:border-primary-100 sm:rounded-lg sm:flex sm:items-center sm:bg-grey-50 sm:h-[150px] sm:place-items-center md:p-4 md:border md:border-primary-100 md:rounded-xl md:flex md:items-center md:bg-grey-50 md:h-[200px] md:place-items-center lg:p-4 lg:border lg:border-primary-100 lg:rounded-xl lg:flex lg:items-center lg:bg-grey-50 lg:h-[226px] lg:place-items-center">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={
            typeof window !== "undefined" && window.innerWidth <= 375
              ? userId
                ? "댓글달기"
                : "로그인해주세요"
              : userId
              ? "댓글을 작성하세요"
              : "댓글 작성은 로그인한 유저만 가능합니다"
          }
          className={`sm:pt-[25px] sm:mb-[70px] sm:pb-[5px] sm:w-[270px] sm:p-4 sm:flex-shrink-0 sm:rounded-[20px] sm:bg-grey-100 sm:text-base sm:leading-5 sm:text-grey-600 sm:pl-[24px] sm:text-[12px] sm:mt-[70px] sm:ml-[12px] ${
            !userId ? "text-grey-500" : "text-grey-900"
          } sm:border-none sm:min-h-[24px] sm:resize-y md:max-w-[800px] md:p-4 md:rounded-l-lg md:bg-grey-50 md:h-[150px] md:flex md:flex-col md:text-lg md:leading-6 md:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } md:border-none md:flex-grow md:min-h-[80px] md:max-h-[400px] lg:max-w-[1200px] lg:p-6 lg:py-15 lg:rounded-l-lg lg:bg-grey-50 lg:h-[150px] lg:flex lg:flex-col lg:text-[28px] lg:leading-[40px] lg:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } lg:border-none lg:flex-grow lg:min-h-[80px] lg:max-h-[500px]`}
          disabled={!userId}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className={`sm:ml-3 sm:p-4 sm-font-[12px] sm:font-normal sm:text-white sm:p-3 sm:flex sm:w-auto sm:h-[24px] sm:flex-col sm:justify-center sm:items-center sm:gap-[24px] sm:text-base sm:font-black sm:bg-primary-400 sm:text-primary-700 sm:rounded-[20px] sm:border-2 sm:border-primary-400 sm:hover:bg-primary-400 sm:px-[10px] sm:ml-[12px] md:ml-4 md:flex md:w-[100px] md:h-[60px] md:flex-col md:justify-center md:items-center md:gap-2 md:text-lg md:font-black md:bg-primary-100 md:text-primary-700 md:rounded-xl md:border-2 md:border-primary-200 md:hover:bg-primary-400 lg:ml-8 lg:flex lg:w-[150px] lg:h-[80px] lg:flex-col lg:justify-center lg:items-center lg:gap-[10px] lg:text-[30px] lg:font-black lg:bg-primary-100 lg:text-primary-700 lg:rounded-[20px] lg:border-2 lg:border-primary-200 lg:hover:bg-primary-400`}
          disabled={!userId}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default DetailPageAddComment;
