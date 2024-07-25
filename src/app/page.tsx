"use client";
import { Travel } from "@/components/main/Travel";
import Control from "@/components/main/Control";
import { MainImage } from "@/components/main/image/MainImage";
import { TravelCourse } from "@/components/main/TravelCourse";
import { Leports } from "@/components/main/Leports";

const Home = () => {
  return (
    <div>
      <MainImage />
      <Control />
      <Travel />
      <Leports />
      <TravelCourse />
    </div>
  );
};

export default Home;
