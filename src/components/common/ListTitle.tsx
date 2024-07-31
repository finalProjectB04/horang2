import Image from "next/image";
import React from "react";
import { MouseEvent } from "react";

interface ListTitleProps {
  TitleName: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ListTitle = ({ TitleName, onClick }: ListTitleProps) => {
  return (
    <div className="w-full flex justify-between border-b-2 p-5 mb-5">
      <div className="flex">
        <Image
          src={`/assets/images/foot.png`}
          alt="Korea Travel Destination"
          width={32}
          height={32}
          className="mr-10"
        />
        <h2 className="text-start font-extrabold text-3xl">{TitleName}</h2>
      </div>
      <button onClick={onClick}>
        더보기 <span>&gt;</span>
      </button>
    </div>
  );
};

export default ListTitle;
