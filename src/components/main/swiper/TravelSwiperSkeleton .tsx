import { useMediaQuery } from "react-responsive";

const TravelSwiperSkeleton = () => {
  const isLgScreen = useMediaQuery({ minWidth: 1024 });
  const skeletonItems = Array(4).fill(null);

  return (
    <div
      className={`w-full ${
        isLgScreen
          ? "h-[280px]"
          : "rounded-[8px] lg:h-full lg:w-[708px] h-[346px] flex flex-col items-start gap-3 self-stretch"
      }`}
    >
      <div className={`flex ${isLgScreen ? "flex-row" : " lg:flex-row"} gap-4`}>
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className={`${
              isLgScreen ? "w-[220px] h-[280px]" : "lg:w-[330px] lg:h-[346px] w-[104px] h-[166px]"
            } relative rounded-[6px] bg-grey-200 animate-pulse`}
          >
            <div className={`${isLgScreen ? "h-[150px]" : "lg:h-[224px] h-[110px]"} bg-grey-300 rounded-t-[6px]`}></div>
            <div
              className={`${
                isLgScreen
                  ? "w-full h-[130px] px-[10px] py-[20px] gap-[8px]"
                  : "lg:w-full lg:h-[122px] lg:px-[14px] lg:py-[28px] lg:gap-[10px] p-2 gap-1.5 h-[56px]"
              } bg-grey-100 rounded-b-[6px] flex flex-col`}
            >
              <div className={`${isLgScreen ? "h-6 w-3/4" : "lg:h-7 h-4 w-3/4"} bg-grey-300 rounded`}></div>
              <div className={`${isLgScreen ? "h-4 w-1/2" : "lg:h-5 h-3 w-1/2"} bg-grey-300 rounded mt-2`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelSwiperSkeleton;
