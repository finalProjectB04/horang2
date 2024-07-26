import React from "react";

export const Loding = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      <p className="text-xl font-semibold mt-4 text-gray-700">불러오는 중입니다...</p>
    </div>
  );
};
