import Image from "next/image";
import React from "react";

export const CommunityImage = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="relative w-[1280px] h-[600px] hidden lg:block">
          <Image src="/assets/images/community.png" alt="background" fill objectFit="cover" className="object-cover" />
        </div>

        <div className="block  lg:hidden ">
          <div className=" relative w-[375px] h-[295px] ">
            <Image
              src="/assets/images/community.png"
              alt="background"
              fill
              objectFit="cover"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};
