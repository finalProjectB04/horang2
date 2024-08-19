"use client";
import { Travel } from "@/components/main/Travel";
import Control from "@/components/main/Control";
import { MainImage } from "@/components/main/image/MainImage";
import { Leports } from "@/components/main/Leports";
import { useState } from "react";
import { Festival } from "@/components/main/Festival";
import MidImage from "@/components/main/image/MidImage";
import Header from "@/components/common/Header";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsonant, setSelectedConsonant] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSigungu, setSelectedSigungu] = useState<string>("");
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState<boolean>(false);

  return (
    <main>
      <div className="flex flex-col justify-center items-center">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MainImage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Control />
      <Travel searchTerm={searchTerm} />
      <div className="flex flex-col justify-center items-center">
        <MidImage />
      </div>
      <div className="mb-[70px]">
        <Leports searchTerm={searchTerm} />
      </div>

      <Festival searchTerm={searchTerm} />
    </main>
  );
};

export default Home;
