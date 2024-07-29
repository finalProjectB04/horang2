import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const ProfileCarousel: React.FC = () => {
  const images = [2, 3, 4, 5, 6, 7, 8];

  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination, Autoplay]}
      className="mySwiper h-full rounded-xl"
      style={{ width: "100%", height: "100%" }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
    >
      <SwiperSlide className="h-full">
        <Image
          src="/assets/images/korea/korea1.png"
          alt="Korea Travel Destination"
          className="w-full h-full"
          width={700}
          height={200}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </SwiperSlide>
      {images.map((image, index) => (
        <SwiperSlide key={index} className="h-full">
          <Image
            src={`/assets/images/korea/korea${image}.jpg`}
            alt="Korea Travel Destination"
            className="w-full h-full"
            width={700}
            height={200}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProfileCarousel;
