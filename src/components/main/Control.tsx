import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Control = () => {
  const router = useRouter();

  const buttons = [
    { path: "/travel", imageSrc: "/assets/images/controlImages/travel.png", alt: "Travel" },
    { path: "/hotel", imageSrc: "/assets/images/controlImages/hotel.png", alt: "Hotel" },
    { path: "/leports", imageSrc: "/assets/images/controlImages/leports.png", alt: "Leports" },
    { path: "/restaurant", imageSrc: "/assets/images/controlImages/restaurants.png", alt: "Restaurant" },
    { path: "/festival", imageSrc: "/assets/images/controlImages/festival.png", alt: "Festival" },
  ];

  return (
    <div className="flex  items-center justify-center p-11 gap-[10px] flex-shrink-0  ">
      {buttons.map((button, index) => (
        <Image
          key={index}
          src={button.imageSrc}
          alt={button.alt}
          width={164}
          height={215}
          onClick={() => router.push(button.path)}
          className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
        />
      ))}
    </div>
  );
};

export default Control;
