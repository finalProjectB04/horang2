"use client";

import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MainListTitle } from "../common/MainListTitle";
import { useRouter } from "next/navigation";
import { Swiper as SwiperType } from "swiper/types";
import { Mobilemode } from "./mobile/Mobilemode";
import "swiper/swiper-bundle.css";
interface LeportsProps {
  searchTerm: string;
}
const fetchLeports = async (): Promise<ApiInformation[]> => {
  const response = await fetch("/api/main/tourism/leports");
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};
export const Leports = ({ searchTerm }: LeportsProps) => {
  const [displayCount, setDisplayCount] = useState<number>(20);
  const router = useRouter();

  const {
    data: leports,
    isPending,
    error,
  } = useQuery<ApiInformation[], Error>({
    queryKey: ["leports"],
    queryFn: fetchLeports,
  });

  const sortedLeports: ApiInformation[] = useMemo(() => {
    if (!leports) return [];

    const filterd: ApiInformation[] = leports.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const shuffled: ApiInformation[] = [...filterd];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
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

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="hidden lg:block">
        <div className="container mx-auto max-w-[1440px]">
          <div className="mx-auto  py-8 max-w-[1440px] flex flex-col gap-10">
            <MainListTitle TitleName={`레포츠 추천`} onClick={() => router.push("/leports")} />
          </div>
          <div className="flex gap-10 h-[712px]">
            {sortedLeports.length > 0 && (
              <Swiper
                key={searchTerm}
                modules={[Grid, A11y, Autoplay]}
                spaceBetween={40}
                slidesPerView={2}
                grid={
                  {
                    rows: 2,
                    fill: "row",
                  } as const
                }
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="rounded-[8px] h-full w-[708px]"
                observer={true}
                observeParents={true}
                onInit={(swiper: SwiperType) => {
                  setTimeout(() => {
                    swiper.update();
                  }, 0);
                }}
              >
                {sortedLeports.map((item: ApiInformation) => (
                  <SwiperSlide key={item.contentid} className="h-[346px]">
                    <div
                      className="bg-gray-100 w-[330px] h-[346px] relative overflow-hidden cursor-pointer rounded-[9.11px]  transition-transform duration-300 hover:scale-105"
                      onClick={() => router.push(`/detail/${item.contentid}`)}
                    >
                      <div className="h-[224px] relative">
                        {item.firstimage ? (
                          <Image
                            src={item.firstimage}
                            alt={item.title}
                            width={330}
                            height={224}
                            className="w-full h-[224px] object-cover rounded-t-[9.11px]"
                          />
                        ) : (
                          <div className="w-full h-[224px] bg-gray-200 flex items-center justify-center rounded-t-[9.11px]">
                            <span className="text-gray-500">No Image Available</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-white w-full h-[122px] overflow-hidden rounded-b-[9.11px] px-[14px] py-[28px] flex flex-col gap-[10px]">
                        <h2 className="text-xl font-semibold text-gray-800 truncate">{item.title}</h2>
                        <p className="text-gray-600 text-sm truncate">{item.addr1 || "Address not available"}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <div className="flex flex-col gap-6 w-[708px] h-full">
              <div className="h-[590px] relative rounded-[9.11px] overflow-hidden">
                <Image
                  src="/assets/images/ex4.png"
                  alt="profile"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              </div>
              <div className="h-[94px] relative rounded-[9.11px] overflow-hidden">
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
      </div>
      <div className=" mx-auto block sm:hidden lg:hidden">
        <div className="mx-auto py-8 max-w-[327px] flex flex-col gap-10">
          <MainListTitle TitleName={`레포츠 추천`} onClick={() => router.push("/leports")} />
        </div>
        <Mobilemode slider={sortedLeports} searchTerm={searchTerm} />

        <div className="flex flex-col items-center gap-5 w-full">
          <div className="h-[260px] w-[327px] relative rounded-[9.11px] overflow-hidden">
            <Image
              src="/assets/images/ex4.png"
              alt="profile"
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
          </div>
          <div className="h-[42px] w-[327px] relative rounded-[9.11px] overflow-hidden">
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
    </>
  );
};
