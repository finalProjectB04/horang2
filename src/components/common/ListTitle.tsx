import Image from "next/image";
import React from "react";
import { MouseEvent } from "react";

interface ListTitleProps {
  TitleName: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const ListTitle = ({ TitleName, onClick }: ListTitleProps) => {
  return (
    <div className="w-full flex items-center justify-between sm:mb-3 sm:px-3 md:mb-5 lg:mb-5">
      <div className="flex items-center">
        <Image
          src={`/assets/images/foot.png`}
          alt="Korea Travel Destination"
          width={20}
          height={20}
          className="md:hidden lg:hidden mr-1"
        />
        <Image
          src={`/assets/images/foot.png`}
          alt="Korea Travel Destination"
          width={21}
          height={21}
          className="sm:hidden"
        />
        <h2 className="text-start font-extrabold text-secondary-800 sm:text-sm text-xl sm:ml-1 md:ml-3 lg:ml-6">
          {TitleName}
        </h2>
      </div>
      {/* <button className="sm:text-xs" onClick={onClick}>
        더보기 <span>&gt;</span>
      </button> */}
    </div>
  );
};

export default ListTitle;
