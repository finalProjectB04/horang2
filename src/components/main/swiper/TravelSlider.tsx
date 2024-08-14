import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { ApiInformation } from "@/types/Main";
import Image from "next/image";

import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

interface MainTravelSliderProps {
  travel: ApiInformation[];
}

export const MainTravelSlider: React.FC<MainTravelSliderProps> = ({ travel }) => {
  const isLgScreen = useMediaQuery({ minWidth: 1024 });
  const router = useRouter();

  return (
    <Swiper
      modules={isLgScreen ? [Autoplay, A11y] : [Grid, A11y, Autoplay]}
      spaceBetween={isLgScreen ? 40 : 20}
      slidesPerView={isLgScreen ? 4 : 3}
      slidesPerGroup={isLgScreen ? 4 : undefined}
      grid={
        !isLgScreen
          ? {
              rows: 2,
              fill: "row",
            }
          : undefined
      }
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      className={`w-full ${
        isLgScreen
          ? "h-[280px]"
          : "rounded-[8px] lg:h-full lg:w-[708px] h-[346px] flex flex-col items-start gap-3 self-stretch"
      }`}
      observer={!isLgScreen}
      observeParents={!isLgScreen}
      onInit={
        !isLgScreen
          ? (swiper) => {
              setTimeout(() => {
                swiper.update();
              }, 0);
            }
          : undefined
      }
    >
      {travel.map((item) => (
        <SwiperSlide key={item.contentid} className={isLgScreen ? "w-[220px] h-[280px]" : "h-[166px]"}>
          <div
            className={`${
              isLgScreen ? "w-[220px] h-[280px]" : "lg:w-[330px] lg:h-[346px] w-[104px] h-[166px]"
            } relative cursor-pointer rounded-[6px] transition-transform duration-300 hover:scale-105`}
            onClick={() => router.push(`/detail/${item.contentid}`)}
          >
            <div
              className={`${
                isLgScreen ? "h-[150px]" : "lg:h-[224px] h-[110px]"
              } relative rounded-t-[6px] overflow-hidden`}
            >
              {item.firstimage ? (
                <Image
                  src={item.firstimage}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-[6px]"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-[6px]">
                  <span className="text-gray-500 text-sm">No Image Available</span>
                </div>
              )}
            </div>
            <div
              className={`bg-white ${
                isLgScreen
                  ? "w-full h-[130px] px-[10px] py-[20px] gap-[8px]"
                  : "lg:w-full lg:h-[122px] lg:px-[14px] lg:py-[28px] lg:gap-[10px] p-2 gap-1.5 h-[56px]"
              } overflow-hidden rounded-b-[6px] flex flex-col absolute bottom-0 left-0 right-0 items-start`}
            >
              <h2
                className={`${
                  isLgScreen ? "text-lg" : "lg:text-xl text-sm"
                } font-semibold text-gray-800 truncate w-full`}
              >
                {item.title}
              </h2>
              <p className={`text-gray-600 ${isLgScreen ? "text-xs" : "lg:text-sm text-xs"} truncate w-full`}>
                {item.addr1 || "Address not available"}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
