"use client";

import React from "react";
import { useRouter } from "next/navigation";

const TravelMbti = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push("travelMbti/survey");
  };

  return (
    <div
      className="w-full h-[calc(100vh-84px)] bg-cover bg-center relative"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.svg)" }}
    >
      <div className="flex justify-center items-start h-full py-10 px-4">
        <div className="bg-white p-6 rounded-[40px] sm:w-[350px] w-[500px] h-[80vh] flex flex-col max-h-[80vh] overflow-auto relative">
          <div className="relative pb-16">
            <header className="absolute top-0 left-0 right-0 bg-white p-5 rounded-t-[40px] z-10">
              <h1 className="text-3xl sm:text-xl font-bold text-center">여행 MBTI 테스트</h1>
            </header>
          </div>

          <main className="flex flex-col items-center justify-center flex-1 p-4 overflow-auto">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">
              여행 MBTI 테스트에 오신 것을 <br />
              환영합니다!
            </h2>
            <p className="mb-4 text-[16px] sm:text-[14px] text-center">
              여행에 대한 당신의 성향을 알아보고 <br />
              적합한 여행 스타일을 확인하세요.
            </p>
            <button
              onClick={handleStart}
              className="bg-primary-300 text-white p-2.5 rounded shadow-sm hover:bg-primary-500 text-[14px]"
            >
              시작하기
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TravelMbti;
