import React from "react";
import { MouseEvent } from "react";

interface ButtonProps {
  buttonName: string;
  bgColor?: string;
  textColor?: string;
  paddingY?: string;
  marginY?: string;
  buttonWidth?: string;
  opacity?: string;
  hover?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  buttonName,
  bgColor,
  textColor,
  paddingY,
  marginY,
  buttonWidth,
  opacity,
  hover,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`rounded border border-solid border-gray-400 ${bgColor ? bgColor : "bg-white"} ${
        textColor ? textColor : "text-black"
      } ${marginY ? marginY : ""} ${paddingY ? paddingY : "py-1"} [&+&]:mx-1 px-4 ${opacity} ${
        hover ? "hover:bg-[#020e36] hover:text-[#ffdecc]" : ""
      } ${buttonWidth ? buttonWidth : null}`}
      onClick={onClick}
    >
      {buttonName}
    </button>
  );
};

export default Button;
