"use client";
import React from "react";
import ListTitle from "../common/ListTitle";

const MyPost: React.FC = () => {
  const handleGoMyPosts = () => {
    console.log("동작");
  };

  return (
    <>
      <ListTitle TitleName="내가 쓴 글" onClick={handleGoMyPosts} />
    </>
  );
};

export default MyPost;
