import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import ErrorPage from "@/app/error";
import { useUserStore } from "@/zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Pagination } from "swiper/modules";

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
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!id,
  });

  if (isPending) {
    return (
      <div className="w-[1440px] h-full flex items-center justify-center text-center font-semibold text-3xl"></div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  if (likes.length === 0) {
    return (
      <div className="w-[1440px] h-full flex items-center justify-center text-center font-semibold text-3xl">
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
        className="my-page mySwiper"
        style={{ width: "1920px", height: "830px" }}
      >
        {likes.map((like: Like) => (
          <SwiperSlide
            key={`${like.id}-${like.content_id}`}
            className="h-full relative cursor-pointer"
            onClick={() => router.push(`detail/${like.content_id}`)}
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
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/30 to-transparent pb-24">
              <p className="text-3xl font-bold text-yellow-300">{like.title}</p>
              <p className="text-lg text-gray-200">{like.address}</p>
              {like.tel && <p className="text-lg text-gray-200">{like.tel}</p>}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[10%] bg-white" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default MyPageCarousel;
