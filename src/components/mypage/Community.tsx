import React from "react";
import MyPost from "./MyPost";
import LikePost from "./LikePost";

const Community: React.FC = () => {
  return (
    <section>
      <MyPost />
      <LikePost />
    </section>
  );
};

export default Community;
