import { ApiInformation } from "@/types/Main";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  item: ApiInformation;
}

export const MainTravelCard = ({ item }: Props) => {
  const router = useRouter();
  return (
    <div
      className="bg-gray-100 lg:w-[330px] lg:h-[346px] relative overflow-hidden cursor-pointer rounded-[8px]  transition-transform duration-300 hover:scale-105"
      onClick={() => router.push(`/detail/${item.contentid}`)}
    >
      {item.firstimage ? (
        <Image
          src={item.firstimage}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="lg:w-[330px] lg:h-[224px] rounded-[8px]"
        />
      ) : (
        <div className="w-[330px] h-[224px] bg-gray-200 flex items-center justify-center rounded-t-[8px]">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      <div className="bg-white w-full h-[122px] overflow-hidden rounded-b-[8px] px-[14px] py-[28px] flex flex-col gap-[10px]">
        <h2 className="text-xl font-semibold text-gray-800 truncate">{item.title}</h2>
        <p className="text-gray-600 text-sm truncate">{item.addr1 || "Address not available"}</p>
      </div>
    </div>
  );
};
