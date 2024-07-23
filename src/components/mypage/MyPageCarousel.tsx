import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

const MyPageCarousel: React.FC = () => {
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper h-full"
        style={{ width: "100%", height: "100%" }}
      >
        <SwiperSlide className="h-full">
          <Image
            src="/assets/images/korea/korea2.jpg"
            alt="Korea Image 2"
            className="object-cover w-full h-full"
            layout="fill"
          />
          <div className="absolute inset-y-0 left-0 w-[12%] bg-white opacity-70"></div>
          <div className="absolute inset-y-0 right-0 w-[12%] bg-white opacity-70"></div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <Image
            src="/assets/images/korea/korea3.jpg"
            alt="Korea Image 3"
            className="object-cover w-full h-full"
            layout="fill"
          />
          <div className="absolute inset-y-0 left-0 w-[12%] bg-white opacity-70"></div>
          <div className="absolute inset-y-0 right-0 w-[12%] bg-white opacity-70"></div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <Image
            src="/assets/images/korea/korea4.jpg"
            alt="Korea Image 4"
            className="object-cover w-full h-full"
            layout="fill"
          />
          <div className="absolute inset-y-0 left-0 w-[12%] bg-white opacity-70"></div>
          <div className="absolute inset-y-0 right-0 w-[12%] bg-white opacity-70"></div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default MyPageCarousel;
