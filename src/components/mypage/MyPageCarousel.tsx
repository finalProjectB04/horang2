
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';
const MyPageCarousel: React.FC = () => {
  return <>
  <Swiper
  effect={'coverflow'}
  grabCursor={true}
  centeredSlides={true}
  slidesPerView={'auto'}
  coverflowEffect={{
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  }}
  pagination={true}
  modules={[EffectCoverflow, Pagination]}
  className="mySwiper"
>
<SwiperSlide className="max-w-[200px] max-h-[200px]">
  <img src="https://swiperjs.com/demos/images/nature-1.jpg" className="w-full h-full object-cover" />
</SwiperSlide>
<SwiperSlide className="max-w-[200px] max-h-[200px]">
  <img src="https://swiperjs.com/demos/images/nature-1.jpg" className="w-full h-full object-cover" />
</SwiperSlide>

<SwiperSlide className="max-w-[200px] max-h-[200px]">
  <img src="https://swiperjs.com/demos/images/nature-1.jpg" className="w-full h-full object-cover" />
</SwiperSlide>

</Swiper>
</>;
};

export default MyPageCarousel;
