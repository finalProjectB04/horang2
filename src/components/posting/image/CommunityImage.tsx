import Image from "next/image";
import React from "react";

export const CommunityImage = () => {
  return (
    <div className="relative w-[1920px] h-[900px]">
      <Image
        src="/assets/images/community.png"
        alt="background"
        layout="fill"
        objectFit="cover"
        className="object-cover"
      />
      <div className="absolute bottom-10 left-0 w-full px-5 md:px-8 lg:px-10">
        <div className="max-w-6xl mx-auto my-36">
          <div className="relative w-full"></div>
        </div>
      </div>
    </div>
  );
};
