"use client";
import { ContentItem } from "@/types/ContentItem.type";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DetailPageSwiper: React.FC<{ contentItemData: ContentItem }> = ({ contentItemData }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {contentItemData.data.firstimage && (
          <SwiperSlide>
            <Image src={contentItemData.data.firstimage} alt="First Image" width={1440} height={350} priority />
          </SwiperSlide>
        )}
        {contentItemData.data.firstimage2 && (
          <SwiperSlide>
            <Image src={contentItemData.data.firstimage2} alt="Second Image" width={1440} height={350} priority />
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  );
};

export default DetailPageSwiper;
