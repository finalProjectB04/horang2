"use client";

import { ApiInformation } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "swiper/swiper-bundle.css";
import { MainListTitle } from "@/components/common/MainListTitle";
import { Mobilemode } from "./Mobilemode";
import { A11y, Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
export const MobileLeports: React.FC<TravelProps> = ({ searchTerm }) => {
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
      <div className="mx-auto py-8 max-w-[327px] flex flex-col gap-10">
        <MainListTitle TitleName={`레포츠 추천`} onClick={() => router.push("/leports")} />
      </div>
      <Mobilemode slider={sortedLeports} searchTerm={searchTerm} />

      <div className="flex flex-col items-center gap-5 w-full">
        <div className="h-[260px] w-[327px] relative rounded-[9.11px] overflow-hidden">
          <Image src="/assets/images/ex4.png" alt="profile" layout="fill" objectFit="cover" className="object-cover" />
        </div>
        <div className="h-[42px] w-[327px] relative rounded-[9.11px] overflow-hidden">
          <Image src="/assets/images/ex5.png" alt="profile" layout="fill" objectFit="cover" className="object-cover" />
        </div>
      </div>
    </>
  );
};
