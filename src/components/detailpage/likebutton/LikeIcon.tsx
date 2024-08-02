"use client";

import Image from "next/image";
import React from "react";

interface LikeIconProps {
  liked: Boolean;
}

const LikeIcon: React.FC<LikeIconProps> = ({ liked }) => {
  const likeImage = liked ? "/assets/images/successLikeIcon.png" : "/assets/images/defaultLikeIcon.png";
  return <Image src={likeImage} alt={liked ? "Unlike" : "Like"} width={70} height={70} />;
};

export default LikeIcon;
