import Image from "next/image";
import React from "react";
import { MouseEvent } from "react";

interface ButtonProps {
  buttonName: string;
  bgColor?: string;
  textColor?: string;
  paddingY?: string;
  marginY?: string;
  opacity?: string;
  hover?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ buttonName, bgColor, textColor, paddingY, marginY, opacity, hover, onClick }: ButtonProps) => {
  return (
    <button
      className={`rounded-[10px] border border-solid border-[#ffBe99]
        font-bold ${bgColor ? bgColor : "bg-white"} ${textColor ? textColor : "text-[#993700]"} ${
        marginY ? marginY : ""
      } ${paddingY ? paddingY : "py-1"} [&+&]:mx-1 px-4 ${opacity} ${
        hover ? "hover:bg-[#ffBe99] hover:text-[#020e36]" : ""
      } w-[206px] h-[60px] flex items-center justify-center`}
      onClick={onClick}
    >
      <Image src={`/assets/images/Vector.png`} alt="Korea Travel Destination" width={10} height={10} className="mr-2" />
      <span>{buttonName}</span>
    </button>
  );
};

export default Button;
