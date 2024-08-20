import React from "react";
import { useMediaQuery } from "react-responsive";

const TravelSwiperSkeleton = () => {
  const isLgScreen = useMediaQuery({ minWidth: 1024 });
  const isMdScreen = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const skeletonItems = isLgScreen ? Array(4).fill(null) : Array(6).fill(null);

  return (
    <div
      className={`w-full ${
        isLgScreen
          ? "h-[280px]"
          : "rounded-[8px] lg:h-full lg:w-[708px] h-[346px] flex flex-col items-start self-stretch"
      }`}
    >
      <div
        className={`grid ${
          isLgScreen ? "grid-cols-4 gap-5" : isMdScreen ? "grid-cols-3 gap-4" : "grid-cols-3 gap-2 grid-rows-2"
        }`}
      >
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className={`${
              isLgScreen ? "w-[220px] h-[280px]" : isMdScreen ? "w-[220px] h-[280px]" : "w-[104px] h-[166px]"
            } relative rounded-[6px] bg-grey-200 animate-pulse`}
          >
            <div
              className={`${isLgScreen || isMdScreen ? "h-[150px]" : "h-[110px]"} bg-grey-300 rounded-t-[6px]`}
            ></div>
            <div
              className={`${
                isLgScreen || isMdScreen ? "w-full h-[130px] px-[10px] py-[20px] gap-[8px]" : "p-2 gap-1.5 h-[56px]"
              } bg-grey-100 rounded-b-[6px] flex flex-col`}
            >
              <div className={`${isLgScreen || isMdScreen ? "h-6 w-3/4" : "h-4 w-3/4"} bg-grey-300 rounded`}></div>
              <div className={`${isLgScreen || isMdScreen ? "h-4 w-1/2" : "h-3 w-1/2"} bg-grey-300 rounded mt-2`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelSwiperSkeleton;
