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
        width={150}
        height={150}
        onClick={() => router.push("/hotel")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/travelCourse.png"}
        alt="여행코스"
        width={150}
        height={150}
        onClick={() => router.push("/travelCourse")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/restaurants.png"}
        alt="레스토랑"
        width={150}
        height={150}
        onClick={() => router.push("/restaurant")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/festival.png"}
        alt="축제"
        width={150}
        height={150}
        onClick={() => router.push("/festival")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <Image
        src={"/assets/images/culturalFacilities.png"}
        alt="문화시설"
        width={150}
        height={150}
        onClick={() => router.push("/culturalFacilities")}
        className="cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      />
    </div>
  );
};

export default Control;
