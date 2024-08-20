import { formatDateToYears } from "@/utils/formatDate";
import React from "react";

interface DateSeperatorProps {
  date: string;
}

const DateSeperator: React.FC<DateSeperatorProps> = ({ date }) => {
  return (
    <div className="flex justify-center items-center my-[18px]">
      <div className="flex-1 border-t border-primary-600 w-[110px]"></div>
      <div className="text-center text-primary-600 mx-4 font-bold text-[12px]">{formatDateToYears(date)}</div>
      <div className="flex-1 border-t border-primary-600 w-[110px]"></div>
    </div>
  );
};

export default DateSeperator;
