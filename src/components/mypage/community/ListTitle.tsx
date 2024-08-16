import Image from "next/image";
import React from "react";
import { MouseEvent } from "react";

interface ListTitleProps {
  TitleName: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  src: string;
}

const ListTitle = ({ TitleName, onClick, src }: ListTitleProps) => {
  return (
    <div className="w-full flex items-center justify-between sm:mb-3 sm:px-3 md:mb-5 lg:mb-5">
      <div className="flex items-center">
        <Image
          src={`${src}`}
          alt="Korea Travel Destination"
          width={20}
          height={20}
          className="md:hidden lg:hidden mr-1"
        />
        <Image src={`${src}`} alt="Korea Travel Destination" width={21} height={21} className="sm:hidden" />
        <h2 className="text-start font-extrabold text-secondary-800 sm:text-sm text-xl sm:ml-1 md:ml-3 lg:ml-6">
          {TitleName}
        </h2>
      </div>
      <button className="sm:text-xs" onClick={onClick}>
        호랑이 모임 <span>&gt;</span>
      </button>
    </div>
  );
};

export default ListTitle;
