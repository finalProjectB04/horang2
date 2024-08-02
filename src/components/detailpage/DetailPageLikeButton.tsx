"use client";

import React from "react";
import LikeButton from "./likebutton/LikeButton";
import { UserSessionProvider } from "./likebutton/UserSessionProvider";

interface DetailPageLikeButtonProps {
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
}

const DetailPageLikeButton: React.FC<DetailPageLikeButtonProps> = ({
  contentId,
  imageUrl,
  contentTypeId,
  title,
  addr1,
  tel,
}) => {
  return (
    <UserSessionProvider>
      <LikeButton
        contentId={contentId}
        imageUrl={imageUrl}
        contentTypeId={contentTypeId}
        title={title}
        addr1={addr1}
        tel={tel}
      />
    </UserSessionProvider>
  );
};

export default DetailPageLikeButton;
