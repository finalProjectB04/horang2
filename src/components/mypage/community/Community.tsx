import React from "react";
import LikePost from "./LikePost";
import MyPost from "./MyPost";

const Community: React.FC = () => {
  return (
    <section className="w-[1440px] mt-[260px]">
      <MyPost />
      <LikePost />
    </section>
  );
};

export default Community;
