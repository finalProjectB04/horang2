"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { results } from "../results";

const TypeResultPage = () => {
  const params = useParams(); // useParams로 URL 파라미터를 가져옵니다.
  const type = params.type as string; // type을 문자열로 변환합니다.

  if (!type || !results[type]) {
    return <div>유효하지 않은 결과입니다.</div>;
  }

  const result = results[type];

  return (
    <div
      className="w-full h-screen bg-cover bg-center fixed"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex justify-center items-start h-full pt-10">
        <div className="bg-white p-8 rounded-[40px] w-[500px] flex flex-col min-h-[85%] max-h-[85%] overflow-auto">
          <div className="relative mb-6">
            <header className="py-4 px-6 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-center">여행 MBTI 결과</h1>
            </header>
            <Link href="/travelMbti" className="absolute top-4 left-4 p-2">
              <img src="/assets/images/back.svg" alt="뒤로가기" className="w-6 h-6" />
            </Link>
          </div>

          <main className="flex flex-col items-center justify-center flex-1 p-4 overflow-auto">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 text-center">
              <header className="mb-6">
                <h2 className="text-3xl font-semibold mb-4">당신의 유형은</h2>
                <h3 className="text-4xl font-bold text-primary-600">{result.title}</h3>
                <p className="mt-4 text-lg">{result.description}</p>
              </header>
              <Link
                href="/travelMbti"
                className="mt-6 bg-primary-300 text-white p-3 rounded shadow-sm hover:bg-primary-500 inline-block"
              >
                다시 시작하기
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TypeResultPage;
