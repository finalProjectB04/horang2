"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import { A11y, Autoplay, Pagination, Scrollbar } from "swiper/modules";
import Image from "next/image";

export const MainSwiper = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <Swiper
        modules={[Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="rounded-lg shadow-xl"
      >
        <SwiperSlide className="bg-gray-100">
          <div className="relative w-full aspect-w-16 aspect-h-9">
            <Image
              src="https://images.unsplash.com/photo-1721504483802-6503a4ba6eeb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={`Slide`}
              width={1920}
              height={1440}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="bg-gray-100">
          <div className="relative w-full aspect-w-16 aspect-h-9">
            <Image
              src="https://images.unsplash.com/photo-1721504483802-6503a4ba6eeb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={`Slide`}
              width={1920}
              height={1440}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide className="bg-gray-100">
          <div className="relative w-full aspect-w-16 aspect-h-9">
            <Image
              src="https://images.unsplash.com/photo-1721504483802-6503a4ba6eeb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={`Slide`}
              width={1920}
              height={1440}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide className="bg-gray-100">
          <div className="relative w-full aspect-w-16 aspect-h-9">
            <Image
              src="https://images.unsplash.com/photo-1721504483802-6503a4ba6eeb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={`Slide`}
              width={1920}
              height={1440}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
