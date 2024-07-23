"use client";

import React, { useState } from "react";
import Tab from "@/components/common/Tab";
import MyPageCarousel from "./MyPageCarousel";

const WishList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("전체");

  const handleAllTab = () => {
    setActiveTab("전체");
  };

  const handleAccommodationTab = () => {
    setActiveTab("숙박");
  };

  const handleActivityTab = () => {
    setActiveTab("액티비티");
  };

  const handleRestaurantTab = () => {
    setActiveTab("음식점");
  };

  const handleMySchedulesTab = () => {
    setActiveTab("나의 일정");
  };

  return (
    <section className="p-5 mb-5 px-20">
      <div className="flex justify-start mb-5">
        <Tab TapName="전체" isActive={activeTab === "전체"} onClick={handleAllTab} />
        <Tab TapName="숙박" isActive={activeTab === "숙박"} onClick={handleAccommodationTab} />
        <Tab TapName="액티비티" isActive={activeTab === "액티비티"} onClick={handleActivityTab} />
        <Tab TapName="음식점" isActive={activeTab === "음식점"} onClick={handleRestaurantTab} />
        <Tab TapName="나의 일정" isActive={activeTab === "나의 일정"} onClick={handleMySchedulesTab} />
      </div>
      <div className="border-2 border-solid border-gray-500 h-96">
        {activeTab === "전체" && <MyPageCarousel />}
        {activeTab === "숙박" && <MyPageCarousel />}
        {activeTab === "액티비티" && <MyPageCarousel />}
        {activeTab === "음식점" && <MyPageCarousel />}
        {activeTab === "나의 일정" && "일정 관련 컴포넌트"}
      </div>
    </section>
  );
};

export default WishList;
