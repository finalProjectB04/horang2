"use client";

import CategorySelector from "@/components/posting/postcomponents/CategorySelector";
import PostGrid from "@/components/posting/postcomponents/PostGrid";
import { SortOrder } from "@/components/posting/postcomponents/SortSelector";
import { selectCommunityData } from "@/components/posting/select/route";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ITEMS_PER_PAGE = 3;

const AboutPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const { data, isPending, isError } = useQuery({
    queryKey: ["community"],
    queryFn: selectCommunityData,
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "none") return "latest";
      if (prev === "latest") return "oldest";
      if (prev === "oldest") return "likes";
      return "none";
    });
  };

  if (isPending) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const slicedData = data.slice(0, ITEMS_PER_PAGE);
  return (
    <main className=" w-auto h-auto justify-items-center">
      <section className=" w-auto h-auto bg-secondary-700 justify-items-center">
        <Image src="/assets/images/about/intro_main.png" alt={"3d타이포 몸체"} width={1920} height={1152} />
      </section>
      <section>
        <Image src="/assets/images/about/Rectangle1300.svg" alt={"Rectangle1300"} width={1920} height={12} />
      </section>
      <section className="w-auto h-auto bg-third-800 overflow-x-hidden">
        <div className="flex w-auto">
          <Image src="/assets/images/about/Vector.svg" alt={"Vector"} width={960} height={105} />
          <Image src="/assets/images/about/Vector.svg" alt={"Vector"} width={960} height={105} />
        </div>
        <div className="ml-[241px] pt-[105px]">
          <div className="flex items-center space-x-4">
            <Image src="/assets/images/about/text1.svg" alt={"text1.svg"} width={259} height={24} />
            <Image src="/assets/images/about/Horang.svg" alt={"Horang.svg"} width={132} height={35} />
          </div>
          <div className="mt-[24px] w-[calc(259px+132px+16px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
          <p className="mt-[24px] text-white text-[24px] font-normal">호랑과 함께 국내여행을 진행해 보세요</p>
        </div>
        <div className="w-auto h-auto flex">
          <Image src="/assets/images/about/composition1.png" alt={"composition1.png"} width={1920} height={812} />
        </div>
        <div className="w-auto h-auto flex">
          <Image src="/assets/images/about/composition2.svg" alt={"composition2.svg"} width={1920} height={609} />
        </div>
        <div className="flex w-auto h-auto flex">
          <Image src="/assets/images/about/composition3.svg" alt={"composition3.svg"} width={1920} height={668} />
        </div>
        <div className="flex ml-[241px] pt-[100px]">
          <div>
            <Image
              src="/assets/images/about/my_trip_around_text.svg"
              alt={"my_trip_around_text.svg"}
              width={178}
              height={29}
              className="mb-[24px]"
            />
            <div className="w-[calc(364px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
            <p
              className="text-white text-[24px] font-bold mt-[24px]"
              style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}
            >
              지금 내 주변에서 숨겨진 핫플레이스를 찾아보세요! 🌟
            </p>
            <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
              GPS로 내 위치를 확인하고, 20km 이내의 멋진 관광지를 탐험해보세요!
            </p>
            <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
              지도를 마음껏 탐색하며 새로운 여행지를 발견하고, 관광지 마커를 클릭하면 그곳의 매력적인 정보를 한눈에
              확인할 수 있습니다.
            </p>
            <p
              className="text-white text-[24px] font-normal mb-[20px]"
              style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}
            >
              어디에 숨겨져 있는지 모르는 매력적인 핫플레이스들을 발견하고, 내 주변에서 새로운 모험을 시작해보세요! ✨
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-[100px]">
          <div className="mb-[24px]">
            <Image src="/assets/images/about/around.svg" alt={"around.svg"} width={1438} height={520} />
          </div>

          <div className="flex items-center justify-center">
            <Link href="/location">
              <button className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-lg rounded-3xl">
                내 근처 여행지 찾아보기
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="w-auto h-auto">
        <Image src="/assets/images/about/composition5.svg" alt={"composition5.svg"} width={1920} height={738} />
      </section>
      <section className="bg-third-800">
        <div>
          <Image src="/assets/images/about/composition6.svg" alt={"composition6.svg"} width={1920} height={735} />
        </div>
        <div>
          <Image src="/assets/images/about/Frame369.svg" alt={"Frame369.svg"} width={1920} height={447} />
        </div>
      </section>
      <section className="w-full flex flex-col items-center justify-center">
        <div className="mb-[60px]">
          <CategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
        <div className="w-full max-w-[1440px]">
          <PostGrid posts={slicedData} selectedCategory={selectedCategory} sortOrder={sortOrder} />
        </div>
        <div className="mt-[34px] mb-[667px]">
          <Link href="/community">
            <button className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-lg rounded-3xl">
              커뮤니티 바로가기
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
