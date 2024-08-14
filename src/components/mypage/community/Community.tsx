import React from "react";
import LikePost from "./LikePost";
import MyPost from "./MyPost";

const Community: React.FC = () => {
  return (
    <section className="sm:w-[375px] md:w-[960px] lg:w-[960px] sm:mt-[20px] md:mt-[20px] lg:mt-[20px]">
      <MyPost />
      <LikePost />
    </section>
  );
};

export default Community;
