import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "@/app/loading";
import ErrorPage from "@/app/error";
import axios from "axios";

type Like = {
  id: string;
  image_url: string;
  title: string;
  address: string;
  tel: string;
  content_type_id: number;
  content_id: number;
};

interface MyPageCarouselProps {
  carouselName: string;
}

const MyPageCarousel = ({ carouselName }: MyPageCarouselProps) => {
  const { id } = useUserStore();
  const router = useRouter();

  const getCarouselType = (name: string): number | undefined => {
    const contentTypeMap: { [key: string]: number | undefined } = {
      전체: undefined,
      여행지: 12,
      숙소: 32,
      놀거리: 28,
      음식점: 39,
      "축제 및 행사": 15,
    };

    return contentTypeMap[name];
  };

  const contentType = getCarouselType(carouselName);

  const {
    data: likes = [],
    error,
    isPending,
  } = useQuery<Like[]>({
    queryKey: ["likes", id, contentType, carouselName],
    queryFn: async () => {
      const url = contentType ? `/api/filterlikes?id=${id}&contentType=${contentType}` : `/api/likes?id=${id}`;

      const cacheKey = `likes-${id}-${contentType || ""}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(url, {
        headers: { "Cache-Control": "max-age=3600" },
      });

      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      return response.data;
    },
    enabled: !!id,
  });

  if (isPending) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (likes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center font-semibold text-3xl">
        좋아요한 장소가 없습니다.
      </div>
    );
  }

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
        {likes.map((like: Like) => (
          <SwiperSlide
            key={`${like.id}-${like.content_id}`}
            className="h-full relative cursor-pointer"
            onClick={() => router.push(`[${like.content_id}]/detailpage`)}
          >
            <Image
              src={like.image_url}
              alt={like.title}
              className="object-cover w-full h-full"
              width={600}
              height={200}
            />
            <div className="absolute inset-y-0 left-0 w-[12%] bg-white opacity-70"></div>
            <div className="absolute inset-y-0 right-0 w-[12%] bg-white opacity-70"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/10 to-transparent pb-6">
              <p className="text-2xl font-bold text-white">{like.title}</p>
              <p className="text-sm text-gray-400">{like.address}</p>
              {like.tel && <p className="text-sm text-gray-300">{like.tel}</p>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default MyPageCarousel;
