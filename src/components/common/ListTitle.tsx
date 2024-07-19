import React from "react";
import { MouseEvent } from "react";

interface ListTitleProps {
  TitleName: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ListTitle = ({ TitleName, onClick }: ListTitleProps) => {
  return (
    <div className="w-full flex justify-between border-b-2 p-5 mb-5">
      <h2 className="text-start font-extrabold text-3xl">{TitleName}</h2>
      <button onClick={onClick}>
        더보기 <span>&gt;</span>
      </button>
    </div>
  );
};

export default ListTitle;
