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

  const handleScrollDown = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 640) {
      window.scrollTo({
        top: 400,
        behavior: "smooth",
      });
    } else if (screenWidth > 640 && screenWidth <= 1024) {
      window.scrollTo({
        top: 700,
        behavior: "smooth",
      });
    } else if (screenWidth > 1024 && screenWidth <= 1366) {
      window.scrollTo({
        top: 1350,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className=" w-full h-auto justify-items-center min-w-[300px]">
      <section className=" w-auto h-auto bg-secondary-700 justify-items-center">
        <Image src="/assets/images/about/intro_main.svg" alt={"3d타이포 몸체"} width={1920} height={1152} />
        <div className="absolute inset-0 flex items-center justify-center mt-[900px] sm:-mt-[150px] md:-mt-[270px]">
          <button onClick={handleScrollDown} className="sm:w-[25px] sm:h-[25px] md:w-[50px] md:h-[50px]">
            <Image src="/assets/images/about/scroll_down.svg" width={80} height={80} alt="스크롤 다운 버튼" />
          </button>
        </div>
      </section>
      <section>
        <Image src="/assets/images/about/Rectangle1300.svg" alt={"이음선"} width={1920} height={12} />
      </section>
      <section className="w-auto h-auto bg-third-800 overflow-x-hidden">
        <div className="flex w-auto">
          <Image src="/assets/images/about/Vector.svg" alt={"물결무늬"} width={960} height={105} />
          <Image src="/assets/images/about/Vector.svg" alt={"물결무늬"} width={960} height={105} />
        </div>
        <div className="w-auto h-auto grid mt-[90px] place-items-center"></div>
      </section>
      <section className="w-auto h-auto overflow-x-hidden bg-third-800 flex flex-col items-center justify-center">
        <Image src="/assets/images/about/big_frame3.svg" alt={"메인프레임"} width={1920} height={3468} />
        <div className="grid grid-cols-4 gap-1 place-items-center absolute top-[175%] sm:top-[75%] md:top-[77%] left-[10%] right-[10%]">
          <Image
            src="/assets/images/about/horang_function_text.svg"
            alt={"호랑이 기능을 소개합니다 텍스트"}
            width={364}
            height={300}
          />
          <Link href={"/about"}>
            {" "}
            <Image
              src="/assets/images/about/about_horang_square.svg"
              alt={"호랑소개 바로가기"}
              width={364}
              height={310}
            />
          </Link>
          <Link href={"/travel"}>
            {" "}
            <Image
              src="/assets/images/about/travel_recommend_square.svg"
              alt={"여행지추천 바로가기"}
              width={364}
              height={310}
            />
          </Link>
          <Link href={"location"}>
            {" "}
            <Image
              src="/assets/images/about/my_near_travel_square.svg"
              alt={"내 근처 여행지 바로가기"}
              width={364}
              height={310}
            />
          </Link>
          <Link href={"/travelMbti"}>
            {" "}
            <Image
              src="/assets/images/about/my_travel_square.svg"
              alt={"나만의 여행 바로가기"}
              width={364}
              height={310}
            />
          </Link>
          <Link href={"/community"}>
            {" "}
            <Image
              src="/assets/images/about/horang_commu_suqare.svg"
              alt={"호랑모임 바로가기"}
              width={364}
              height={310}
            />
          </Link>
          <Link href={"/mypage"}>
            {" "}
            <Image src="/assets/images/about/my_page_square.svg" alt={"나의공간 바로가기"} width={364} height={310} />
          </Link>
        </div>

        <div className="relative h-auto w-auto">
          <Link href={"/travel"}>
            <button className="relative lg:top-[-1320px] lg:mr-[860px]  sm:top-[-270px] md:top-[-550px] sm:mr-[130px] md:mr-[270px]">
              <Image
                src="/assets/images/about/introduce_travel_button.svg"
                alt="여행지 소개"
                width={562}
                height={54}
                className="object-contain sm:w-[145px] sm:h-[18px] md:w-[300px] md:h-[36px]"
              />
            </button>
          </Link>
        </div>
        <div className="bg-primary-400 flex items-center justify-center text-white text-[16px] rounded-3xl relative top-[-100px] sm:top-[-42px] md:top-[-50px] sm:text-[11px] md:text-[13px]">
          <Link href="/location">
            <Image
              src="/assets/images/about/my_near_travel_button.svg"
              alt="내 근처 여행지 찾아보기"
              width={562}
              height={54}
              className="object-contain w-full sm:w-[274px] sm:h-[30px] md:w-[468px] md:h-[45px]"
            />
          </Link>
        </div>
      </section>
      <section>
        <Image src="/assets/images/about/my_custom_travel.svg" alt={"my_custom_travel"} width={1920} height={818} />
      </section>

      <section className="bg-third-800"></section>
      <section className="w-full flex flex-col items-center justify-center bg-third-800">
        <div className="w-auto h-auto mt-[100px] mb-[100px] sm:mt-[30px] sm:mb-[30px] md:mt-[50px] md:mb-[50px] ">
          <Image
            src="/assets/images/about/horang_commu.svg"
            alt={"horang_commu"}
            width={1438}
            height={196}
            className="w-full sm:w-[274px] md:w-[568px]"
          />
        </div>
        <div className="mb-[60px]">
          <AboutCategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
        <div className="w-full max-w-[1440px] ">
          <AboutPostGrid posts={slicedData} selectedCategory={selectedCategory} sortOrder={sortOrder} />
        </div>
        <div className="mt-[34px] flex items-center justify-center">
          <Link href="/community">
            <Image
              src="/assets/images/about/horang_commu_button.svg"
              alt="호랑모임 바로가기 버튼"
              width={562}
              height={54}
              className="cursor-pointer w-full sm:w-[274px] sm:h-[30px] md:w-[468px] md:h-[45px]"
            />
          </Link>
        </div>
        <div className="w-auto h-auto mt-[155px] sm:mt-[50px] md:mt-[50px]">
          <Image
            src="/assets/images/about/my_space.svg"
            alt={"my_space"}
            width={1444}
            height={378}
            className="w-full sm:w-[274px] md:w-[568px] "
          />
        </div>
      </section>
      <section>
        <div className="-mb-10 -mt-2">
          <Image
            src="/assets/images/about/about_bottom.svg"
            alt={"about_bottom"}
            width={1919}
            height={407}
            className="relative"
          />
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
