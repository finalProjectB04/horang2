"use client";
import ListTitle from "@/components/common/ListTitle";
import React from "react";

const MyPost: React.FC = () => {
  const handleGoMyPosts = (): void => {
    console.log("동작");
  };

  return (
    <>
      <ListTitle TitleName="내가 쓴 글" onClick={handleGoMyPosts} />
    </>
  );
};

export default MyPost;
