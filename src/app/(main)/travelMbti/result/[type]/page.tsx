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
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg flex flex-col">
        <header className="bg-primary-300 text-white py-4 px-6 flex items-center justify-between mb-4">
          <Link href="/travelMbti" className="bg-gray-500 text-white p-2 rounded shadow-sm hover:bg-gray-600">
            뒤로가기
          </Link>
          <h1 className="text-2xl font-bold">호랑이 유형 테스트 결과</h1>
        </header>
        <main className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 text-center">
            <header className="mb-6">
              <h2 className="text-3xl font-semibold mb-4">당신의 호랑이 유형은:</h2>
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
  );
};

export default TypeResultPage;
