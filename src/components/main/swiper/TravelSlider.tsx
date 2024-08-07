import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import { ApiInformation } from "@/types/Main";
import type { Swiper as SwiperType } from "swiper";
import { MainTravelCard } from "./MainTravelCard";
import "swiper/swiper-bundle.css";

interface MainTravelSliderProps {
  travel: ApiInformation[];
  isPending: boolean;
  error: Error | null;
}

export const MainTravelSlider: React.FC<MainTravelSliderProps> = ({ travel, isPending, error }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    if (swiperInstance && !isPending && !error) {
      swiperInstance.update();
    }
    setIsClient(true);
  }, [swiperInstance, isPending, error, travel]);

  if (isPending) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isClient) return null;

  return (
    <Swiper
      modules={[Autoplay, A11y]}
      spaceBetween={40}
      slidesPerView={4}
      slidesPerGroup={4}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      className=" w-full h-[346px]"
      onSwiper={(swiper: SwiperType) => setSwiperInstance(swiper)}
    >
      {travel.map((item) => (
        <SwiperSlide key={item.contentid} className="w-[330px] h-[346px]">
          <MainTravelCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
