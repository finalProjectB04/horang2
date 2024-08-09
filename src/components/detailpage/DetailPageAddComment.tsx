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
    <main className="mobile:mt-[140px] mobile:max-w-[375px] mobile:mx-auto tablet:mt-4 tablet:max-w-[1024px] tablet:mx-auto desktop:mt-4 desktop:max-w-[1440px] desktop:mx-auto">
      {userId && (
        <div className="mobile:pl-[22px] mobile:flex mobile:items-center mobile:py-3 tablet:flex tablet:items-center tablet:mb-4 tablet:py-3 desktop:flex desktop:items-center desktop:mb-4 desktop:py-3">
          {profileUrl && (
            <Image src={profileUrl || "/assets/images/profile_ex.png"} alt="유저 프로필 사진" width={20} height={20} />
          )}
          <span className="mobile:text-base mobile:font-bold mobile:ml-2 mobile:text-grey-800 tablet:text-xl tablet:font-bold tablet:ml-2 tablet:text-grey-800 desktop:text-2xl desktop:font-bold desktop:ml-2 desktop:text-grey-800">
            {userNickname} 님
          </span>
        </div>
      )}
      <div className="mobile:p-3 mobile:border-none mobile:h-[102px] mobile:border mobile:border-primary-100 mobile:rounded-lg mobile:flex mobile:items-center mobile:bg-grey-50 mobile:h-[150px] mobile:place-items-center tablet:p-4 tablet:border tablet:border-primary-100 tablet:rounded-xl tablet:flex tablet:items-center tablet:bg-grey-50 tablet:h-[200px] tablet:place-items-center desktop:p-4 desktop:border desktop:border-primary-100 desktop:rounded-xl desktop:flex desktop:items-center desktop:bg-grey-50 desktop:h-[226px] desktop:place-items-center">
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
          className={`mobile:pt-[25px] mobile:mb-[70px] mobile:pb-[5px] mobile:w-[270px] mobile:p-4 mobile:flex-shrink-0 mobile:rounded-[20px] mobile:bg-grey-100 mobile:text-base mobile:leading-5 mobile:text-grey-600 mobile:pl-[24px] mobile:text-[12px] mobile:mt-[70px] mobile:ml-[12px] ${
            !userId ? "text-grey-500" : "text-grey-900"
          } mobile:border-none mobile:min-h-[24px] mobile:resize-y tablet:max-w-[800px] tablet:p-4 tablet:rounded-l-lg tablet:bg-grey-50 tablet:h-[150px] tablet:flex tablet:flex-col tablet:text-lg tablet:leading-6 tablet:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } tablet:border-none tablet:flex-grow tablet:min-h-[80px] tablet:max-h-[400px] desktop:max-w-[1200px] desktop:p-6 desktop:py-15 desktop:rounded-l-lg desktop:bg-grey-50 desktop:h-[150px] desktop:flex desktop:flex-col desktop:text-[28px] desktop:leading-[40px] desktop:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } desktop:border-none desktop:flex-grow desktop:min-h-[80px] desktop:max-h-[500px]`}
          disabled={!userId}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className={`mobile:ml-3 mobile:p-4 mobile-font-[12px] mobile:font-normal mobile:text-white mobile:p-3 mobile:flex mobile:w-auto mobile:h-[24px] mobile:flex-col mobile:justify-center mobile:items-center mobile:gap-[24px] mobile:text-base mobile:font-black mobile:bg-primary-400 mobile:text-primary-700 mobile:rounded-[20px] mobile:border-2 mobile:border-primary-400 mobile:hover:bg-primary-400 mobile:px-[10px] mobile:ml-[12px] tablet:ml-4 tablet:flex tablet:w-[100px] tablet:h-[60px] tablet:flex-col tablet:justify-center tablet:items-center tablet:gap-2 tablet:text-lg tablet:font-black tablet:bg-primary-100 tablet:text-primary-700 tablet:rounded-xl tablet:border-2 tablet:border-primary-200 tablet:hover:bg-primary-400 desktop:ml-8 desktop:flex desktop:w-[150px] desktop:h-[80px] desktop:flex-col desktop:justify-center desktop:items-center desktop:gap-[10px] desktop:text-[30px] desktop:font-black desktop:bg-primary-100 desktop:text-primary-700 desktop:rounded-[20px] desktop:border-2 desktop:border-primary-200 desktop:hover:bg-primary-400`}
          disabled={!userId}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default DetailPageAddComment;
