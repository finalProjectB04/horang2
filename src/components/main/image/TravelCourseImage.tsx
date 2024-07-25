"use client";
import Image from "next/image";

export const TravelCourseImage = () => {
  return (
    <div className="flex justify-center  w-full h-screen ">
      <div className="relative w-full h-full max-w-[717px] max-h-[590px]">
        <Image src="/assets/images/ex4.png" alt="profile" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};
