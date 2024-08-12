import Image from "next/image";
import React from "react";

export const CommunityImage = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="relative w-[1920px] h-[900px] hidden lg:block">
          <Image
            src="/assets/images/community.png"
            alt="background"
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>

        <div className="block  lg:hidden ">
          <div className=" relative w-[375px] h-[295px] ">
            <Image
              src="/assets/images/community.png"
              alt="background"
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};
