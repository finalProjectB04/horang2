"use client";

import Image from "next/image";

export const MainSwiper = () => {
  return (
    <div className="max-w-screen-xl mx-auto ">
      <div className="relative w-full aspect-w-16 aspect-h-9">
        <Image
          src="/assets/images/ex3.png"
          alt="profile"
          width={1920}
          height={1080}
          className="object-cover rounded-lg w-full h-full"
        />
      </div>
    </div>
  );
};
