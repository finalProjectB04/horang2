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
      className="relative flex items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="bg-white p-8 rounded-[40px] border border-grey-300 w-[500px] min-h-screen flex flex-col items-center">
        <header className="py-4 px-6 flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-center">여행 MBTI 테스트</h1>
        </header>

        <main className="flex flex-col items-center justify-center flex-1 p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">여행 MBTI 테스트에 오신 것을 환영합니다!</h2>
          <p className="mb-4 text-lg text-center">
            여행에 대한 당신의 성향을 알아보고 <br />
            적합한 여행 스타일을 확인하세요.
          </p>
          <button
            onClick={handleStart}
            className="bg-primary-300 text-white p-3 rounded shadow-sm hover:bg-primary-500"
          >
            시작하기
          </button>
        </main>
      </div>
    </div>
  );
};

export default TravelMbti;
