import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Control = () => {
  const router = useRouter();

  const buttons = [
    {
      path: "/travel",
      imageSrc: "/assets/images/controlImages/travel.png",
      alt: "Travel",
      name: "추천 여행지",
    },
    { path: "/hotel", imageSrc: "/assets/images/controlImages/hotel.png", alt: "Hotel", name: "숙소" },
    { path: "/leports", imageSrc: "/assets/images/controlImages/leports.png", alt: "Leports", name: "레포츠" },
    {
      path: "/restaurant",
      imageSrc: "/assets/images/controlImages/restaurants.png",
      alt: "Restaurant",
      name: "음식점",
    },
    { path: "/festival", imageSrc: "/assets/images/controlImages/festival.png", alt: "Festival", name: "축제 및 행사" },
  ];

  return (
    <>
      <div className="hidden lg:block">
        <div className="flex items-center justify-between w-[900px] h-[215px] mx-auto">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="w-[164px] h-[215px] flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
              onClick={() => router.push(button.path)}
            >
              <Image src={button.imageSrc} alt={button.alt} width={84} height={84} className="mb-4" />
              <p className="text-center text-sm">{button.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="block sm:hidden lg:hidden ">
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
