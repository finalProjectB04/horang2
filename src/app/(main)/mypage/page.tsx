"use client";

import Advertisement from "@/components/common/Advertisement";
import Community from "@/components/mypage/community/Community";
import Profile from "@/components/mypage/profile/Profile";
import WishList from "@/components/mypage/wishlist/WishList";
import React from "react";

const myPage: React.FC = () => {
  return (
    <main className="flex justify-center">
      <div className="w-[1920px] flex flex-col justify-center items-center text-center">
        <div className="w-[1440px] mx-auto grid grid-cols-1 gap-4">
          <Profile />
        </div>
        <WishList />
        <Community />
        <Advertisement />
      </div>
    </main>
  );
};

export default myPage;
