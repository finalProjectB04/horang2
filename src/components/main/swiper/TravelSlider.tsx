import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { ApiInformation } from "@/types/Main";
import { MainTravelCard } from "./MainTravelCard";

interface TravelSliderProps {
  travel: ApiInformation[];
}

export const MainTravelSlider = ({ travel }: TravelSliderProps) => (
  <Swiper
    modules={[Pagination, A11y, Autoplay]}
    spaceBetween={20}
    slidesPerView={4}
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    onAutoplay={(swiper) => {
      swiper.slideTo(swiper.activeIndex + 4);
    }}
    className="rounded-lg shadow-xl"
  >
    {travel.map((item) => (
      <SwiperSlide key={item.contentid}>
        <MainTravelCard item={item} />
      </SwiperSlide>
    ))}
  </Swiper>
);
