import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import { ApiInformation } from "@/types/Main";
import { MainTravelCard } from "./MainTravelCard";

interface TravelSliderProps {
  travel: ApiInformation[];
}

export const MainTravelSlider = ({ travel }: TravelSliderProps) => (
  <Swiper
    modules={[A11y, Autoplay]}
    spaceBetween={20}
    slidesPerView={4}
    slidesPerGroup={4}
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    className="rounded-lg "
  >
    {travel.map((item) => (
      <SwiperSlide key={item.contentid}>
        <MainTravelCard item={item} />
      </SwiperSlide>
    ))}
  </Swiper>
);
