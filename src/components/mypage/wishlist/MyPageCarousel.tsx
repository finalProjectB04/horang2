"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";

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
  const [likes, setLikes] = useState<Like[]>([]);
  const router = useRouter();

  let contentType: number | undefined;

  if (carouselName === "전체") {
    contentType = undefined;
  } else if (carouselName === "여행지") {
    contentType = 12;
  } else if (carouselName === "액티비티") {
    contentType = 28;
  } else if (carouselName === "숙박") {
    contentType = 32;
  } else if (carouselName === "음식점") {
    contentType = 39;
  }

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/likes?id=${id}`, { cache: "force-cache" });
        const data = await response.json();
        setLikes(data);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    const fetchFilterLikes = async () => {
      try {
        const response = await fetch(`/api/filterlikes?id=${id}&contentType=${contentType}`, { cache: "force-cache" });
        const data = await response.json();
        setLikes(data);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    if (carouselName === "전체") {
      fetchLikes();
    } else {
      fetchFilterLikes();
    }
  }, [id, contentType]);

  // axios 캐시 처리 문제로 임시 fetch로 바꿈
  // useEffect(() => {
  //   const fetchLikes = async () => {
  //     try {
  //       const response = await instance.get(`/likes?id=${id}`);
  //       setLikes(response.data);
  //     } catch (error) {
  //       console.error("Error fetching likes:", error);
  //     }
  //   };

  //   const fetchFilterLikes = async () => {
  //     try {
  //       const response = await instance.get(`/filterlikes?id=${id}&contentType=${contentType}`);
  //       setLikes(response.data);
  //     } catch (error) {
  //       console.error("Error fetching likes:", error);
  //     }
  //   };

  //   if (carouselName === "전체") {
  //     fetchLikes();
  //   } else {
  //     fetchFilterLikes();
  //   }
  // }, [id, contentType]);

  if (!likes || likes.length === 0) {
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
        {likes?.map((like) => (
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
