"use client";

import React from "react";
import Link from "next/link";
import { results } from "./results";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ResultPage = () => {
  const router = useRouter();

  return (
    <div
      className="w-full h-[calc(100vh-84px)] bg-cover bg-bottom relative"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.svg)" }}
    >
      <div className="flex justify-center items-start h-full py-10 sm:py-6 px-4">
        <div className="bg-white p-6 rounded-[40px] w-[500px] sm:w-[350px] h-[80vh] flex flex-col max-h-[80vh] overflow-auto relative">
          <div className="relative pb-16">
            <header className="absolute top-0 left-0 right-0 bg-white p-5 rounded-t-[40px] z-10">
              <h1 className="text-3xl sm:text-xl font-bold text-center">전체 유형 보기</h1>
              <button onClick={() => router.back()} className="absolute top-4 left-4 p-2">
                <img src="/assets/images/back.svg" alt="뒤로가기" className="w-5 h-5" />
              </button>
            </header>
          </div>

          <div className="mt-4 mb-4 flex flex-col flex-1 overflow-auto">
            <div className="w-full space-y-6">
              {/* 각 MBTI 유형에 대한 결과를 나열합니다. */}
              {Object.entries(results).map(([key, { title, description, image }]) => (
                <Link
                  key={key}
                  href={`/travelMbti/result/${key}`}
                  className="flex flex-col bg-white rounded-xl border-2 sm:border border-primary-300 p-10 sm:p-5 shadow shadow-primary-300 shadow-md"
                >
                  <Image
                    src={image || "/assets/images/null_image.svg"}
                    alt={title}
                    width={200}
                    height={200}
                    className="w-full h-auto object-cover mb-4 rounded-xl"
                  />
                  <h2 className="text-2xl font-semibold text-center">{title}</h2>
                  <p className="text-[16px] sm:text-[14px] text-center pt-2">{description.slice(0, 100)}...</p>
                </Link>
              ))}
            </div>
            <button className="mt-8 text-center">
              <Link
                href="/travelMbti"
                className="bg-primary-300 text-white p-3.5 rounded shadow-sm hover:bg-primary-500 text-[14px]"
              >
                테스트 다시하기
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
