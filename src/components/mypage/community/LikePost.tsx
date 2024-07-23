"use client";
import ListTitle from "@/components/common/ListTitle";
import React from "react";

const LikePost: React.FC = () => {
  const handleGoLikePosts = () => {
    console.log("동작");
  };

  return (
    <>
      <ListTitle TitleName="좋아요 한 글" onClick={handleGoLikePosts} />
    </>
  );
};

export default LikePost;
