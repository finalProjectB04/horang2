"use client";
import { Travel } from "@/components/main/Travel";
import Control from "@/components/main/Control";
import { MainImage } from "@/components/main/image/MainImage";
import { Leports } from "@/components/main/Leports";
import { useState } from "react";
import { Festival } from "@/components/main/Festival";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <MainImage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Control />
      <Travel searchTerm={searchTerm} />
      <Leports searchTerm={searchTerm} />
      <Festival searchTerm={searchTerm} />
    </div>
  );
};

export default Home;
