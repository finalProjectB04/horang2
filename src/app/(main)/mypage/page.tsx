import Community from "@/components/mypage/Community";
import Profile from "@/components/mypage/Profile";
import WishList from "@/components/mypage/WishList";
import React from "react";

const myPage: React.FC = () => {
  return (
    <main className="w-full max-w-[1920px] flex justify-center items-center text-center">
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 gap-4">
        <Profile />
        <WishList />
        <Community />
      </div>
    </main>
  );
};

export default myPage;
