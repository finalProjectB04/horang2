import React from "react";
import LikePost from "./LikePost";
import MyPost from "./MyPost";

const Community: React.FC = () => {
  return (
    <section className="sm:w-[375px] md:w-[1024px] lg:w-[1440px] sm:mt-[20px] md:mt-[120px] lg:mt-[260px]">
      <MyPost />
      <LikePost />
    </section>
  );
};

export default Community;
