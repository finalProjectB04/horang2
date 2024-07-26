"use client";
import { Travel } from "@/components/main/Travel";
import Control from "@/components/main/Control";
import { MainImage } from "@/components/main/image/MainImage";
import { TravelCourse } from "@/components/main/TravelCourse";
import { Leports } from "@/components/main/Leports";
//MainImage 검색오류입니다 신경 안쓰셔도괜찮습니다
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
