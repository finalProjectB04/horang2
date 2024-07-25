import React, { MouseEvent } from "react";

interface TapProps {
  TapName: string;
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Tab = ({ TapName, isActive, onClick }: TapProps) => {
  return (
    <button
      className={`${
        isActive
          ? "text-black font-extrabold border-b-8 border-orange-500"
          : "text-gray-300 hover:text-black font-extrabold"
      } m-3 text-3xl mb-5`}
      onClick={onClick}
    >
      {TapName}
    </button>
  );
};

export default Tab;
