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
    <main className=" w-auto h-auto justify-items-center min-w-[300px]">
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
        <div className="w-auto h-auto flex mt-[40px]">
          <Image
            src="/assets/images/about/intro_under_typo.svg"
            alt={"intro_under_typo.svg"}
            width={1920}
            height={248}
          />
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
        <div className="flex ml-[241px] w-auto h-auto pt-[100px]">
          <div>
            <Image
              src="/assets/images/about/trip_around_text.svg"
              alt={"trip_around_text.svg"}
              width={1438}
              height={128}
              className="mb-[24px]"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-[100px]">
          <div className="mb-[24px]">
            <Image src="/assets/images/about/around.svg" alt={"around.svg"} width={1438} height={520} />
          </div>

          <div className="flex items-center justify-center">
            <Link href="/location">
              <button
                className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-[16px] rounded-3xl 
                     sm:w-[374px] sm:h-[36px] sm:text-[11px] 
                     md:w-[468px] md:h-[45px] md:text-[13px]"
              >
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
        <div className="mt-[34px] mb-[667px] flex items-center justify-center">
          <Link href="/community">
            <button
              className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-[24px] rounded-3xl 
                     sm:w-[374px] sm:h-[36px] sm:text-[16px] 
                     md:w-[468px] md:h-[45px] md:text-[20px]"
            >
              커뮤니티 바로가기
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
