import React from "react";
import LikePost from "./LikePost";
import MyPost from "./MyPost";

const Community: React.FC = () => {
  return (
    <section>
      <MyPost />
      <LikePost />
    </section>
  );
};

export default Community;
