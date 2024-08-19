import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Control = () => {
  const router = useRouter();

  const buttons = [
    {
      path: "/travel",
      imageSrc: "/assets/images/controlImages/travel1.png",
      alt: "Travel",
      name: "추천 여행지",
    },
    { path: "/hotel", imageSrc: "/assets/images/controlImages/hotel1.png", alt: "Hotel", name: "숙소" },
    { path: "/leports", imageSrc: "/assets/images/controlImages/leports1.png", alt: "Leports", name: "놀거리" },
    {
      path: "/restaurant",
      imageSrc: "/assets/images/controlImages/restaurants1.png",
      alt: "Restaurant",
      name: "음식점",
    },
    {
      path: "/festival",
      imageSrc: "/assets/images/controlImages/festival1.png",
      alt: "Festival",
      name: "축제 및 행사",
    },
  ];

  return (
    <>
      <div className="hidden lg:block">
        <div className="flex mx-auto w-[600px]">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="w-[109px] h-[143px] flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
              onClick={() => router.push(button.path)}
            >
              <div className="w-[67px] h-[63px] mb-2 relative">
                <Image src={button.imageSrc} alt={button.alt} layout="fill" objectFit="contain" />
              </div>
              <p className="text-center text-[13px] leading-tight">{button.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="block  lg:hidden ">
        <div className="flex items-center justify-between w-[326px] h-[78px] mx-auto">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="w-[60px] h-[78px] flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
              onClick={() => router.push(button.path)}
            >
              <Image src={button.imageSrc} alt={button.alt} width={30} height={30} className="m-[6px]" />
              <p className="text-center text-[10.173px] font-medium leading-[10.173px] tracking-[-0.254px]">
                {button.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Control;
