"use client";
import { Travel } from "@/components/main/Travel";
import Control from "@/components/main/Control";

import { MainImage } from "@/components/main/image/MainImage";
import { MidImage } from "@/components/main/image/MidImage";
import { TravelCourseImage } from "@/components/main/image/TravelCourseImage";
import { TravelCourse } from "@/components/main/TravelCourse";

const Home = () => {
  return (
    <div>
      <MainImage />
      <Control />
      <Travel></Travel>

      <TravelCourse />
    </div>
  );
};

export default Home;
