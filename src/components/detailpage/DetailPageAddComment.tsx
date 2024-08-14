"use client";

import { useModal } from "@/context/modal.context";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

const supabase = createClient();

interface DetailPageAddCommentProps {
  contentId: string;
  contentTypeId: string;
}

const DetailPageAddComment: React.FC<DetailPageAddCommentProps> = ({ contentId, contentTypeId }) => {
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();
  const { id: userId, user_email: userEmail, user_nickname: userNickname, profile_url: profileUrl } = useUserStore();
  const modal = useModal();

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("로그인 후 댓글을 작성할 수 있습니다.");
      }

      const response = await supabase.from("Comments").insert([
        {
          user_id: userId,
          content_id: contentId,
          comment,
          content_type_id: contentTypeId,
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
      modal.open({
        title: "성공!",
        content: (
          <div className="text-center">
            <p>댓글 작성이 성공했습니다</p>
          </div>
        ),
      });

      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
    },
    onError: (error: Error) =>
      modal.open({
        title: "실패!",
        content: (
          <div className="text-center ">
            <p>댓글 작성이 실패했습니다</p>
            <p>${error.message}</p>
          </div>
        ),
      }),
  });

  const handleAddComment = () => {
    addCommentMutation.mutate();
  };

  return (
    <main className="sm:mt-[140px] sm:max-w-[375px] sm:mt-[50px] sm:mx-auto md:mt-4 md:max-w-[1024px] md:mx-auto lg:mt-4 lg:max-w-[1440px] lg:mx-auto">
      {userId && (
        <div className="sm:pl-[22px] sm:flex sm:items-center sm:py-3 md:flex md:items-center md:mb-4 md:py-3 lg:flex lg:items-center lg:mb-4 lg:py-3">
          {profileUrl && (
            <Image src={profileUrl || "/assets/images/profile_ex.png"} alt="유저 프로필 사진" width={20} height={20} />
          )}
          <span className="sm:text-base sm:font-bold sm:ml-2 sm:text-grey-800 md:text-[17px]  md:font-bold md:ml-2 md:text-grey-800 lg:text-[19px] lg:font-bold lg:ml-2 lg:text-grey-800">
            {userNickname} 님
          </span>
        </div>
      )}
      <div className="sm:p-3 sm:border-none sm:h-[102px] md:bg-grey-100 md:p-4 md:border md:border-primary-100 md:rounded-xl md:h-[120px] lg:p-4 lg:border lg:border-primary-100 lg:rounded-xl lg:h-[151px] flex items-center place-items-center lg:bg-grey-100">
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
          className={`resize-none sm:w-[270px] sm:p-4 sm:flex-shrink-0 sm:rounded-[20px] sm:bg-grey-100 sm:text-[14px] sm:leading-5 sm:text-grey-600 sm:pl-[24px] ${
            !userId ? "text-grey-500" : "text-grey-900"
          } sm:border-none sm:min-h-[24px] sm:resize-y md:max-w-[800px] md:p-4 md:rounded-l-lg md:bg-grey-100 lg:h-[100px] md:flex md:flex-col md:text-[17px] md:leading-6 md:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } md:border-none md:flex-grow md:min-h-[80px] md:max-h-[400px] lg:max-w-[1200px] lg:p-6 lg:py-15 lg:rounded-l-lg lg:bg-grey-100 lg:h-[100px] lg:flex lg:flex-col lg:text-[19px] lg:leading-[40px] lg:text-grey-600 ${
            !userId ? "text-grey-500" : "text-grey-900"
          } lg:border-none lg:flex-grow lg:min-h-[80px] lg:max-h-[500px]`}
          disabled={!userId}
          maxLength={2000}
        />
        <button
          onClick={handleAddComment}
          className={`sm:ml-3 sm:py-[10px] sm:px-[20px] sm:text-[12px] sm:font-bold sm:text-white sm:bg-primary-400 sm:rounded-2xl md:w-[75px] md:h-[40px] md:ml-4 lg:w-[100px] lg:h-[53px] md:flex md:justify-center md:items-center md:text-[17px] md:font-black md:bg-primary-100 md:text-primary-700 md:rounded-xl md:border-2 md:border-primary-200 md:hover:bg-primary-400 lg:ml-8 lg:w-[100px] lg:h-[53px] lg:flex lg:justify-center lg:items-center lg:text-[19px] lg:font-black lg:bg-primary-100 lg:text-primary-700 lg:rounded-[20px] lg:border-2 lg:border-primary-200 lg:hover:bg-primary-400`}
          disabled={!userId}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default DetailPageAddComment;
