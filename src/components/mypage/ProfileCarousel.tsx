import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import Image from "next/image";

const ProfileCarousel: React.FC = () => {
  const images = [2, 3, 4, 5, 6, 7, 8];
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        const swiper = swiperRef.current.swiper;
        const lastIndex = images.length;

        if (currentIndex === lastIndex) {
          swiper.slideTo(0);
          setCurrentIndex(0);
        } else {
          swiper.slideNext();
          setCurrentIndex(currentIndex + 1);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper h-full"
        style={{ width: "100%", height: "100%" }}
        ref={swiperRef}
      >
        <SwiperSlide className="h-full">
          <Image
            src="/assets/images/korea/korea1.png"
            alt="Korea Travel Destination"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </SwiperSlide>
        {images.map((image, index) => (
          <SwiperSlide key={index} className="h-full">
            <Image
              src={`/assets/images/korea/korea${image}.jpg`}
              alt="Korea Travel Destination"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ProfileCarousel;
