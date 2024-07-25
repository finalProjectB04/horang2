"use client";
import Image from "next/image";

export const MidImage = () => {
  return (
    <div className="  w-full h-screen ">
      <div className="relative w-full  h-full  max-w-[1920px] max-h-[357px]">
        <Image src="/assets/images/banner.jpg" alt="profile" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};
