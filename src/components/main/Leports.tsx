"use client";

import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MainListTitle } from "../common/MainListTitle";
import { useRouter } from "next/navigation";
import "swiper/swiper-bundle.css";

interface TravelProps {
  searchTerm: string;
}
const FetchLeports = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/tourism/leports");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
export const Leports: React.FC<TravelProps> = ({ searchTerm }) => {
  const [displayCount, setDisplayCount] = useState<number>(20);
  const router = useRouter();

  const {
    data: leports,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["leports"],
    queryFn: FetchLeports,
  });

  const sortedLeports: ApiInformation[] = useMemo(() => {
    if (!leports) return [];

    const filterd: ApiInformation[] = leports.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const shuffled: ApiInformation[] = [...filterd];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
      .sort((a, b) => {
        if (a.firstimage && !b.firstimage) return -1;
        if (!a.firstimage && b.firstimage) return 1;
        return 0;
      })
      .slice(0, displayCount);
  }, [leports, displayCount, searchTerm]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!sortedLeports.length) return null;
  return (
    <>
      <div className=" mx-auto py-8 max-w-[327px] lg:max-w-[1440px] flex flex-col gap-10">
        <MainListTitle TitleName={`레포츠 추천`} onClick={() => router.push("/leports")} />
      </div>
      <div className="  mx-auto max-w-[327px] lg:max-w-[1440px]">
        <div className="lg:flex lg:gap-10 lg:h-[712px]  ">
          {sortedLeports.length > 0 && (
            <Swiper
              modules={[Grid, A11y, Autoplay]}
              spaceBetween={20}
              breakpoints={{
                1024: {
                  slidesPerView: 2,
                },
                0: {
                  slidesPerView: 3,
                },
              }}
              grid={{
                rows: 2,
                fill: "row",
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="rounded-[8px] lg:h-full lg:w-[708px] h-[346px] w-full flex flex-col items-start gap-3 self-stretch mb-5"
              observer={true}
              observeParents={true}
              onInit={(swiper) => {
                setTimeout(() => {
                  swiper.update();
                }, 0);
              }}
            >
              {sortedLeports.map((item: ApiInformation) => (
                <SwiperSlide key={item.contentid} className="h-[166px] lg:h-[346px]">
                  <div
                    className="lg:w-[330px] lg:h-[346px] w-[104px] h-[166px] relative cursor-pointer rounded-[8px] transition-transform duration-300 hover:scale-105"
                    onClick={() => router.push(`/detail/${item.contentid}`)}
                  >
                    <div className="h-[110px] lg:h-[224px] relative rounded-t-[8px] overflow-hidden">
                      {item.firstimage ? (
                        <Image
                          src={item.firstimage}
                          alt={item.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-[8px]"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-[8px]">
                          <span className="text-gray-500 text-xs lg:text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-white w-full h-[56px] lg:h-[122px] overflow-hidden rounded-b-[8px] p-2 lg:px-[14px] lg:py-[28px] flex flex-col gap-1 lg:gap-[10px] absolute bottom-0 left-0 right-0 items-start">
                      <h2 className="text-sm lg:text-xl font-semibold text-gray-800 truncate w-full">{item.title}</h2>
                      <p className="text-gray-600 text-xs lg:text-sm truncate w-full">
                        {item.addr1 || "Address not available"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="flex flex-col lg:gap-6 gap-5 lg:w-[708px] lg:h-full w-full">
            <div className="lg:h-[590px] lg:w-[708px]  h-[260px] w-[327px] relative rounded-[8px] overflow-hidden">
              <Image
                src="/assets/images/ex4.png"
                alt="profile"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
            <div className="lg:h-[94px] lg:w-[708px] h-[42px] w-[327px] relative rounded-[8px] overflow-hidden">
              <Image
                src="/assets/images/ex5.png"
                alt="profile"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
