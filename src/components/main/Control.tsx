import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Control = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center space-x-4 p-4   ">
      <Image
        src={"/assets/images/hotel.png"}
        alt="호텔"
        width={100}
        height={100}
        onClick={() => router.push("/Hotel")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/travel.png"}
        alt="여행"
        width={100}
        height={100}
        onClick={() => router.push("/travel")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/restaurants.png"}
        alt="레스토랑"
        width={100}
        height={100}
        onClick={() => router.push("/restaurant")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/festival.png"}
        alt="축제"
        width={100}
        height={100}
        onClick={() => router.push("/festival")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/leports.png"}
        alt="레포츠"
        width={100}
        height={100}
        onClick={() => router.push("/leport")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
    </div>
  );
};

export default Control;
