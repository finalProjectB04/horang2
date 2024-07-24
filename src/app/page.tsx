"use client";
import { useUserStore } from "@/zustand/userStore";
import { Travel } from "@/components/main/Travel";
import { MainImage } from "@/components/main/MainSwiper";
import Control from "@/components/main/Control";
import { TravelCourse } from "@/components/main/TravelCourse";
import { MidImage } from "@/components/main/MidImage";

const Home = () => {
  return (
    <div>
      <MainImage />
      <Control />
      <Travel></Travel>
      <MidImage />
      {/* <TravelCourse /> */}
    </div>
  );
};

export default Home;
