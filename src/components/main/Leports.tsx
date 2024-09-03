"use Client";

import { useHandleLikeButtonSwiper } from "@/hooks/detailpage/useHandleLikeButtonSwiper";
import { Likes } from "@/types/Likes.types";
import { ApiInformation } from "@/types/Main";
import { convertToHttps } from "@/utils/convertToHttps";
import { useUserStore } from "@/zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { MainListTitle } from "../common/MainListTitle";
import { NoResultsFound } from "../maindetail/NoResultsFound";

interface TravelProps {
  searchTerm: string;
}

interface ContextType {
  previousLikes: Likes[] | undefined;
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
  const { id: userId } = useUserStore();

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

    const filtered: ApiInformation[] = leports.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const shuffled: ApiInformation[] = [...filtered];
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

  const { likedStates, isError, data, handleLikeButton } = useHandleLikeButtonSwiper({
    travel: sortedLeports,
    contentId: sortedLeports[0]?.contentid || "",
    imageUrl: sortedLeports[0]?.firstimage || "",
    contentTypeId: sortedLeports[0]?.contenttypeid || "",
    title: sortedLeports[0]?.title || "",
    addr1: sortedLeports[0]?.addr1 || "",
    tel: sortedLeports[0]?.tel || "",
    userId: userId || "",
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!sortedLeports.length) return null;

  return (
    <>
      <div className=" mx-auto py-8 max-w-[327px] lg:max-w-[960px] flex flex-col gap-10 ">
        <MainListTitle TitleName={`놀거리 추천`} onClick={() => router.push("/leports")} />
      </div>
      <div className="  mx-auto max-w-[327px] lg:max-w-[960px]">
        <div className="lg:flex lg:gap-[13px] lg:h-[505px]  ">
          {sortedLeports.length > 0 ? (
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
              className="rounded-[8px] lg:h-full lg:w-[670px] h-[346px] w-full flex flex-col items-start gap-3 self-stretch mb-5"
              observer={true}
              observeParents={true}
              onInit={(swiper) => {
                setTimeout(() => {
                  swiper.update();
                }, 0);
              }}
            >
              {sortedLeports.map((item: ApiInformation) => (
                <SwiperSlide key={item.contentid} className="h-[166px] lg:h-[242px]">
                  <div
                    className="lg:w-[220px] lg:h-[242px] w-[104px] h-[166px] relative cursor-pointer rounded-[8px] transition-transform duration-300 hover:scale-105"
                    onClick={() => router.push(`/detail/${item.contentid}`)}
                  >
                    <div className="h-[110px] lg:h-[149.33px] relative rounded-t-[8px] overflow-hidden">
                      {item.firstimage ? (
                        <Image src={convertToHttps(item.firstimage)} alt={item.title} layout="fill" objectFit="cover" />
                      ) : (
                        <div className="w-full h-full bg-grey-200 flex items-center justify-center rounded-t-[8px]">
                          <span className="text-grey-500 text-xs lg:text-sm">No Image</span>
                        </div>
                      )}
                      <button
                        data-contentid={item.contentid}
                        onClick={(event) => handleLikeButton(event)}
                        className="absolute top-2 right-2"
                      >
                        <Image
                          src={
                            likedStates[item.contentid]
                              ? "/assets/images/successLikeIcon.svg"
                              : "/assets/images/defaultLikeIcon.svg"
                          }
                          alt={likedStates[item.contentid] ? "Unlike" : "Like"}
                          width={32}
                          height={32}
                          className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
                        />
                      </button>
                    </div>
                    <div className="bg-white w-full h-[56px] lg:h-[93.34px] overflow-hidden rounded-b-[8px] p-2 lg:px-[14px] lg:py-[10px] flex flex-col gap-1 lg:gap-[5px] absolute bottom-0 left-0 right-0 items-start">
                      <h2 className="text-sm lg:text-base font-semibold text-grey-800 truncate w-full">{item.title}</h2>
                      <p className="text-grey-600 text-xs lg:text-sm truncate w-full">
                        {item.addr1 || "Address not available"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <NoResultsFound />
          )}
          <div className="flex flex-col lg:gap-6 gap-3 lg:w-[708px] lg:h-full w-full">
            <div className="lg:h-[393px] lg:w-[492px]  h-[260px] w-[327px] relative rounded-[8px] overflow-hidden">
              <Image src="/assets/images/ex4.png" alt="profile" fill objectFit="cover" className="object-cover" />
            </div>
            <div
              onClick={() => router.push("/travelMbti")}
              className="cursor-pointer lg:h-[94px] lg:w-[492px] h-[63px] w-[327px] relative rounded-[8px] overflow-hidden"
            >
              <Image src="/assets/images/ex5.png" alt="profile" fill objectFit="contain" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
