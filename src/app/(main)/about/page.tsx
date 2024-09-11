"use client";

import LoadingPage from "@/app/loading";
import AboutCategorySelector from "@/components/about/AboutCategorySelector";
import AboutPostGrid from "@/components/about/AboutPostGrid";

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
    return <LoadingPage />;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const filteredData = selectedCategory === "전체" ? data : data.filter((post) => post.category === selectedCategory);

  const slicedData = filteredData.slice(0, ITEMS_PER_PAGE);

  return (
    <main className=" w-auto h-auto justify-items-center min-w-[300px]">
      <section className=" w-auto h-auto bg-secondary-700 justify-items-center">
        <Image src="/assets/images/about/intro_main.svg" alt={"3d타이포 몸체"} width={1920} height={1152} />
      </section>
      <section>
        <Image src="/assets/images/about/Rectangle1300.svg" alt={"Rectangle1300"} width={1920} height={12} />
      </section>
      <section className="w-auto h-auto bg-third-800 overflow-x-hidden">
        <div className="flex w-auto">
          <Image src="/assets/images/about/Vector.svg" alt={"Vector"} width={960} height={105} />
          <Image src="/assets/images/about/Vector.svg" alt={"Vector"} width={960} height={105} />
        </div>
        <div className="w-auto h-auto grid mt-[90px] place-items-center"></div>
      </section>
      <section className="w-auto h-auto overflow-x-hidden bg-third-800 flex flex-col items-center justify-center">
        <Image src="/assets/images/about/big_frame.svg" alt={"big_frame"} width={1920} height={3855} />
        <Link href="/location">
          <button
            className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-[16px] rounded-3xl relative top-[-340px]  
    sm:w-[374px] sm:h-[36px] sm:text-[11px] 
    md:w-[468px] md:h-[45px] md:text-[13px]"
          >
            <Image
              src="/assets/images/about/my_near_travel_button.svg"
              alt="내 근처 여행지 찾아보기"
              width={562}
              height={54}
              className="object-contain"
            />
          </button>
        </Link>
      </section>
      <section>
        <Image src="/assets/images/about/my_custom_travel.svg" alt={"my_custom_travel"} width={1920} height={818} />
      </section>

      <section className="bg-third-800"></section>
      <section className="w-full flex flex-col items-center justify-center bg-third-800">
        <div className="w-auto h-auto mt-[100px] mb-[100px]">
          <Image src="/assets/images/about/horang_commu.svg" alt={"horang_commu"} width={1438} height={196} />
        </div>
        <div className="mb-[60px]">
          <AboutCategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
        <div className="w-full max-w-[1440px] ">
          <AboutPostGrid posts={slicedData} selectedCategory={selectedCategory} sortOrder={sortOrder} />
        </div>
        <div className="mt-[34px] flex items-center justify-center">
          <Link href="/community">
            <button
              className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-[24px] rounded-3xl 
                     sm:w-[374px] sm:h-[36px] sm:text-[16px] 
                     md:w-[468px] md:h-[45px] md:text-[20px]"
            >
              호랑모임 바로가기
            </button>
          </Link>
        </div>
        <div className="w-auto h-auto mt-[150px]">
          <Image src="/assets/images/about/my_space.svg" alt={"my_space"} width={1444} height={378} />
        </div>
      </section>
      <section>
        <div className="">
          <Image src="/assets/images/about/about_bottom.svg" alt={"about_bottom"} width={1919} height={407} />
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
{
  /* <Link href="/location">
  <button
    className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-[16px] rounded-3xl  relative top-[-340px]  
sm:w-[374px] sm:h-[36px] sm:text-[11px] 
md:w-[468px] md:h-[45px] md:text-[13px]"
  >
    내 근처 여행지 찾아보기
  </button>
</Link>; */
}
