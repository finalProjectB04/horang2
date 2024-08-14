import React from "react";
import Profile from "@/components/mypage/profile/Profile";
import Community from "@/components/mypage/community/Community";
import WishList from "@/components/mypage/wishlist/WishList";
import Advertisement from "@/components/common/Advertisement";

const myPage: React.FC = () => {
  return (
    <main className="flex justify-center">
      <div className="sm:w-[375px] lg:w-[1280px] flex flex-col justify-center items-center text-center">
        <div className="sm:w-[375px] lg:w-[960px] mx-auto grid grid-cols-1 gap-4">
          <Profile />
        </div>
        <WishList />
        <div className="sm:w-[375px] lg:w-[960px] mx-auto grid grid-cols-1 gap-4">
          <Community />
        </div>
        <Advertisement />
      </div>
    </main>
  );
};

export default myPage;
