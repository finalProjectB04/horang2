"use client";

import React, { useState } from "react";
import Tab from "../common/Tab";
import MyPageCarousel from "./MyPageCarousel";

const WishList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("나의 일정");

  const handleMySchedules = () => {
    setActiveTab("나의 일정");
  };

  const handleMyDestinations = () => {
    setActiveTab("여행지");
  };

  const handleMyAccommodations = () => {
    setActiveTab("숙소");
  };

  return (
    <section className="p-5 mb-5 px-20">
      <div className="flex justify-start mb-5">
        <Tab TapName="나의 일정" isActive={activeTab === "나의 일정"} onClick={handleMySchedules} />
        <Tab TapName="여행지" isActive={activeTab === "여행지"} onClick={handleMyDestinations} />
        <Tab TapName="숙소" isActive={activeTab === "숙소"} onClick={handleMyAccommodations} />
      </div>
      <div className="border-2 border-solid border-gray-500 h-96">
        <MyPageCarousel />
      </div>
    </section>
  );
};

export default WishList;
