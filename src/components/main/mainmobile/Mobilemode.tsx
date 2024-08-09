"use client";

import { ApiInformation } from "@/types/Main";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/grid";

interface TravelProps {
  searchTerm: string;
  slider: ApiInformation[];
}

export const Mobilemode: React.FC<TravelProps> = ({ slider }) => {
  const router = useRouter();
  if (!slider.length) return null;
  return (
    <div className="mx-auto max-w-[327px]">
      <div className="flex flex-col gap-5">
        {slider.length > 0 && (
          <Swiper
            modules={[Grid, A11y, Autoplay]}
            spaceBetween={10}
            slidesPerView={3}
            grid={{
              rows: 2,
              fill: "row",
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="rounded-[8px] h-[346px] w-full flex flex-col items-start gap-3 self-stretch"
            observer={true}
            observeParents={true}
            onInit={(swiper) => {
              setTimeout(() => {
                swiper.update();
              }, 0);
            }}
          >
            {slider.map((item: ApiInformation) => (
              <SwiperSlide key={item.contentid}>
                <div
                  className="w-[104px] h-[166px] flex-shrink-0 relative cursor-pointer rounded-[9.11px] transition-transform duration-300 hover:scale-105"
                  onClick={() => router.push(`/detail/${item.contentid}`)}
                >
                  <div className="h-full relative">
                    {item.firstimage ? (
                      <Image
                        src={item.firstimage}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-[9.11px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-[9.11px]">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-2 flex flex-col items-start gap-1.5 self-stretch">
                    <h2 className="text-sm font-semibold text-gray-800 truncate w-full">{item.title}</h2>
                    <p className="text-gray-600 text-xs truncate w-full">{item.addr1 || "Address not available"}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};
