import React from "react";
import LikePost from "./LikePost";
import MyPost from "./MyPost";
import Advertisement from "@/components/common/Advertisement";

const Community: React.FC = () => {
  return (
    <section className="w-[1440px]">
      <MyPost />
      <LikePost />
    </section>
  );
};

export default Community;
