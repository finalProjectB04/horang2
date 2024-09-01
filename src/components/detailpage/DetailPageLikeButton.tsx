"use client";

import { useHandleLikeButton } from "@/hooks/detailpage/useHandleLikeButton";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import React from "react";

interface LikeButtonProps {
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
  userId: string;
}

const DetailPageLikeButton: React.FC<LikeButtonProps> = ({ contentId, imageUrl, contentTypeId, title, addr1, tel }) => {
  const { id: userId } = useUserStore();
  const { liked, isError, isPending, data, handleLikeButton } = useHandleLikeButton({
    contentId,
    imageUrl,
    contentTypeId,
    title,
    addr1,
    tel,
    userId: userId || "",
  });

  const likeImage =
    data && data.find((item) => item.user_id === userId)
      ? "/assets/images/successLikeIcon.svg"
      : "/assets/images/defaultLikeIcon.svg";

  if (isPending) {
    return (
      <Image
        src="/assets/images/defaultLikeIcon.svg"
        alt={"Unlike"}
        width={32}
        height={32}
        className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
      />
    );
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
  }

  return (
    <button onClick={handleLikeButton} disabled={!userId}>
      <Image
        src={likeImage}
        alt={liked ? "Unlike" : "Like"}
        width={32}
        height={32}
        className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
      />
    </button>
  );
};

export default DetailPageLikeButton;
