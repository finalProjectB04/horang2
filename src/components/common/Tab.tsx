import React, { MouseEvent } from "react";

interface TapProps {
  TapName: string;
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Tab = ({ TapName, isActive, onClick }: TapProps) => {
  return (
    <div>
      <button
        className={`sm:hidden md:block lg:block ${
          isActive
            ? "text-secondary-800 font-extrabold border-b-8 border-orange-500"
            : "text-gray-300 hover:text-secondary-800 font-extrabold"
        } m-3 text-3xl mb-5`}
        onClick={onClick}
      >
        {TapName}
      </button>
      <button
        className={`sm:block md:hidden lg:hidden ${
          isActive
            ? "text-secondary-800 font-bold border-b-4 border-orange-500"
            : "text-gray-300 hover:text-secondary-800 font-bold"
        } m-2 text-[12px] mb-2`}
        onClick={onClick}
      >
        {TapName}
      </button>
    </div>
  );
};

export default Tab;
