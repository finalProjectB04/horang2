"use client";

import React from "react";
import Link from "next/link";
import { results } from "./results"; // 결과 객체를 가져옵니다.
import { useRouter } from "next/navigation";

const ResultPage = () => {
  const router = useRouter();

  return (
    <div
      className="w-full h-[calc(100vh-84px)] bg-cover bg-center relative"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.svg)" }}
    >
      <div className="flex justify-center items-start h-full py-10 px-4">
        <div className="bg-white p-6 rounded-[40px] w-[500px] h-[80vh] flex flex-col max-h-[80vh] overflow-auto relative">
          <div className="relative pb-16">
            <header className="absolute top-0 left-0 right-0 bg-white p-5 rounded-t-[40px] z-10">
              <h1 className="text-3xl sm:text-xl font-bold text-center">전체 유형 보기</h1>
              <button onClick={() => router.back()} className="absolute top-4 left-4 p-2">
                <img src="/assets/images/back.svg" alt="뒤로가기" className="w-5 h-5" />
              </button>
            </header>
          </div>

          <div className="pt-2 flex flex-col flex-1 p-4 overflow-auto">
            <div className="w-full space-y-4 overflow-auto hidden-scroll">
              {/* 각 MBTI 유형에 대한 결과를 나열합니다. */}
              {Object.entries(results).map(([key, { title, description }]) => (
                <Link
                  key={key}
                  href={`/travelMbti/result/${key}`}
                  className="block bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
                  <p className="text-[16px] sm:text-[14px] text-center">{description.slice(0, 100)}...</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/travelMbti"
                className="bg-primary-300 text-white p-2.5 rounded shadow-sm hover:bg-primary-500 text-[14px]"
              >
                테스트 다시하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
