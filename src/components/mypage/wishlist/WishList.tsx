"use client";

import React, { useState } from "react";
import Tab from "@/components/common/Tab";
import MyPageCarousel from "./MyPageCarousel";

const tabs = ["전체", "여행지", "숙소", "놀거리", "음식점", "축제 및 행사"];

const WishList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("전체");

  return (
    <section className="flex flex-col justify-center items-center">
      <div className="flex justify-start mb-5 px-2 w-full max-w-[960px]">
        {tabs.map((tab) => (
          <Tab key={tab} TapName={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
        ))}
      </div>
      <div className="sm:h-[200px] lg:h-[500px] w-full max-w-[1280px]">
        {tabs.map((tab) => activeTab === tab && <MyPageCarousel key={tab} carouselName={tab} />)}
      </div>
    </section>
  );
};

export default WishList;
