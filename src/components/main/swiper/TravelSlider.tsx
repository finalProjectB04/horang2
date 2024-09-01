"use client";

import { Likes } from "@/types/Likes.types";
import { ApiInformation } from "@/types/Main";
import { convertToHttps } from "@/utils/convertToHttps";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import SwiperCore from "swiper";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHandleLikeButtonSwiper } from "./../../../hooks/detailpage/useHandleLikeButtonSwiper";
import TravelSwiperSkeleton from "./TravelSwiperSkeleton ";
interface MainTravelSliderProps {
  travel: ApiInformation[];
  contentId: string;
  imageUrl: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  tel: string;
  userId: string;
}
interface ContextType {
  previousLikes: Likes[] | undefined;
}

export const MainTravelSlider: React.FC<MainTravelSliderProps> = ({ travel }) => {
  const isLgScreen = useMediaQuery({ minWidth: 1024 });
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const router = useRouter();

  const { id: userId } = useUserStore();

  const item = travel[0] as ApiInformation;

  const { likedStates, isError, isPending, data, handleLikeButton } = useHandleLikeButtonSwiper({
    travel,
    contentId: item.contentid,
    imageUrl: item.firstimage,
    contentTypeId: item.contenttypeid,
    title: item.title,
    addr1: item.addr1,
    tel: item.tel || "",
    userId: userId || "",
  });

  useEffect(() => {
    if (swiper) {
      swiper.update();
    }
  }, [isLgScreen, swiper]);

  if (isPending) {
    return <TravelSwiperSkeleton />;
  }

  if (isError) {
    return <div>에러가 감지되었습니다....</div>;
  }

  const likeImage =
    data && data.find((like: { user_id: string | null }) => like.user_id === userId)
      ? "/assets/images/successLikeIcon.svg"
      : "/assets/images/defaultLikeIcon.svg";

  return (
    <Swiper
      modules={[Grid, A11y, Autoplay]}
      spaceBetween={20}
      onSwiper={setSwiper}
      breakpoints={{
        320: {
          slidesPerView: Math.min(3, travel.length),
          grid: {
            rows: 2,
            fill: "row",
          },
        },
        1024: {
          slidesPerView: Math.min(4, travel.length),
          slidesPerGroup: Math.min(4, travel.length),
          grid: undefined,
        },
      }}
      autoplay={travel.length > 4 ? { delay: 5000, disableOnInteraction: false } : false}
      className={`w-full ${
        isLgScreen
          ? "h-[280px]"
          : "rounded-[8px] lg:h-full lg:w-[708px] h-[346px] flex flex-col items-start self-stretch"
      }`}
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
                <div>
                  <Image
                    src={convertToHttps(item.firstimage)}
                    alt={item.title}
                    fill
                    objectFit="cover"
                    className="rounded-t-[8px]"
                  />
                  <button
                    data-contentid={item.contentid}
                    onClick={(event) => handleLikeButton(event)}
                    disabled={!userId}
                    className="absolute top-2 right-2 opacity-70"
                  >
                    <Image
                      src={
                        likedStates[item.contentid]
                          ? "/assets/images/successLikeIcon.svg"
                          : "/assets/images/defaultLikeIcon.svg"
                      }
                      alt={likedStates[item.contentid] ? "Unlike" : "Like"}
                      width={32}
                      height={32}
                    />
                  </button>
                </div>
              ) : (
                <Image
                  src="/assets/images/null_image.svg"
                  alt={item.title}
                  fill
                  objectFit="cover"
                  className="rounded-t-[8px]"
                />
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
                } font-semibold text-grey-800 truncate w-full`}
              >
                {item.title}
              </h2>
              <p className={`text-grey-600 ${isLgScreen ? "text-xs" : "lg:text-sm text-xs"} truncate w-full`}>
                {item.addr1 || "Address not available"}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
