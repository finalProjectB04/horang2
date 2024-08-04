"use client";

import React from "react";
import Link from "next/link";
import { results } from "./results"; // 결과 객체를 가져옵니다.

const ResultPage = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center fixed"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex justify-center items-start h-full pt-10">
        <div className="bg-white p-8 rounded-[40px] w-[500px] max-h-[85%] flex flex-col overflow-auto">
          <header className="py-4 px-6 mb-6">
            <h1 className="text-3xl font-bold text-center">전체 유형 보기</h1>
          </header>

          <main className="flex flex-col items-center justify-center p-4 flex-1  overflow-auto">
            <div className="w-full space-y-4 overflow-auto">
              {/* 각 MBTI 유형에 대한 결과를 나열합니다. */}
              {Object.entries(results).map(([key, { title, description }]) => (
                <Link
                  key={key}
                  href={`/travelMbti/result/${key}`}
                  className="block bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
                  <p className="text-base text-center">{description.slice(0, 100)}...</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/travelMbti" className="bg-primary-300 text-white p-3 rounded shadow-sm hover:bg-primary-500">
                테스트 다시하기
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
