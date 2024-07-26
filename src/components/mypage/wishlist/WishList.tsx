"use client";

import React, { useState } from "react";
import Tab from "@/components/common/Tab";
import MyPageCarousel from "./MyPageCarousel";

const WishList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("전체");

  const handleTabClick = (tabName: string): void => {
    setActiveTab(tabName);
  };

  return (
    <section className="mb-5 ">
      <div className="flex justify-start mb-5 px-20">
        <Tab TapName="전체" isActive={activeTab === "전체"} onClick={() => handleTabClick("전체")} />
        <Tab TapName="여행지" isActive={activeTab === "여행지"} onClick={() => handleTabClick("여행지")} />
        <Tab TapName="숙박" isActive={activeTab === "숙박"} onClick={() => handleTabClick("숙박")} />
        <Tab TapName="액티비티" isActive={activeTab === "액티비티"} onClick={() => handleTabClick("액티비티")} />
        <Tab TapName="음식점" isActive={activeTab === "음식점"} onClick={() => handleTabClick("음식점")} />
        <Tab TapName="나의 일정" isActive={activeTab === "나의 일정"} onClick={() => handleTabClick("나의 일정")} />
      </div>
      <div className="h-[600px]">
        {activeTab === "전체" && <MyPageCarousel carouselName="전체" />}
        {activeTab === "여행지" && <MyPageCarousel carouselName="여행지" />}
        {activeTab === "숙박" && <MyPageCarousel carouselName="숙박" />}
        {activeTab === "액티비티" && <MyPageCarousel carouselName="액티비티" />}
        {activeTab === "음식점" && <MyPageCarousel carouselName="음식점" />}
        {activeTab === "나의 일정" && (
          <div className="h-full flex items-center justify-center text-center font-semibold text-3xl">
            일정 관련 컴포넌트
          </div>
        )}
      </div>
    </section>
  );
};

export default WishList;
