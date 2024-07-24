"use client";
import Image from "next/image";

export const MidImage = () => {
  return (
    <div className="flex justify-center  w-full h-screen ">
      <div className="relative w-full  h-full  max-w-[1920px] max-h-[357px]">
        <Image src="/assets/images/midImage.png" alt="profile" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};
