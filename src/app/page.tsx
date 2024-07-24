"use client";
import { useUserStore } from "@/zustand/userStore";
import { Travel } from "@/components/main/Travel";
import { MainImage } from "@/components/main/MainSwiper";
import Control from "@/components/main/Control";
import { TravelCourse } from "@/components/main/TravelCourse";
import { MidImage } from "@/components/main/MidImage";

const Home = () => {
  // Zustand 스토어에서 상태 값을 가져옵니다.
  const { id, user_email, user_nickname, profile_url } = useUserStore((state) => ({
    id: state.id,
    user_email: state.user_email,
    user_nickname: state.user_nickname,
    profile_url: state.profile_url,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded p-4">
        <div className="mb-2">
          <strong>ID:</strong> {id || "정보 없음"}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {user_email || "정보 없음"}
        </div>
        <div className="mb-2">
          <strong>Nickname:</strong> {user_nickname || "정보 없음"}
        </div>
        <div className="mb-2">
          <strong>Profile URL:</strong> {profile_url || "정보 없음"}
        </div>
      </div>
      <MainImage />
      <Control />
      <Travel></Travel>
      <MidImage />
      {/* <TravelCourse /> */}
    </div>
  );
};

export default Home;
