"use client";
import Image from "next/image";

export const MainImage = () => {
  return (
    <div className="flex justify-center  w-full h-screen overflow-hidden">
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px]">
        <Image src="/assets/images/ex3.png" alt="profile" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};
