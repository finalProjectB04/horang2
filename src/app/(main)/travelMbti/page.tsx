"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TravelMbtiQuest from "@/components/travelMbti/TravelMbtiQuest";
import { questions } from "./question";

const TravelMbti = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [resultType, setResultType] = useState<string | null>(null);
  const router = useRouter();

  const handleAnswer = (type: string) => {
    setAnswers((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalResultType = Object.keys(answers).reduce((a, b) => (answers[a] > answers[b] ? a : b));
      setResultType(finalResultType);
      // 결과를 계산한 후 결과 페이지로 이동
      router.push(`/travelMbti/result/${finalResultType}`);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg flex flex-col">
        <header className=" py-4 px-6 flex items-center justify-between mb-4">
          {currentQuestion > 0 && (
            <button onClick={handleBack} className="bg-gray-500 text-white p-2 rounded shadow-sm hover:bg-gray-600">
              뒤로가기
            </button>
          )}
          <h1 className="text-2xl font-bold">여행 MBTI 테스트</h1>
        </header>

        <main className="flex flex-col items-center justify-center p-4">
          {/* 프로그래스바 */}
          <div className="w-full bg-gray-200 rounded-full mb-4">
            <div
              className="bg-primary-300 text-xs font-medium text-center text-white p-1 leading-none rounded-full"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            >
              {/* {`${currentQuestion + 1} / ${questions.length}`} */}
            </div>
          </div>
          {!testStarted ? (
            <>
              <h2 className="text-2xl font-bold mb-4">여행 MBTI 테스트에 오신 것을 환영합니다!</h2>
              <p className="mb-4 text-lg">
                여행에 대한 당신의 성향을 알아보고 <br />
                적합한 여행 스타일을 확인하세요.
              </p>
              <button
                onClick={() => setTestStarted(true)}
                className="bg-primary-300 text-white p-3 rounded shadow-sm hover:bg-primary-500"
              >
                시작하기
              </button>
            </>
          ) : resultType === null ? (
            <div className="w-full">
              <TravelMbtiQuest
                question={questions[currentQuestion].question}
                options={questions[currentQuestion].options}
                onAnswer={handleAnswer}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
              />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">결과를 확인하세요!</h2>
              <p>결과 페이지로 자동 이동합니다...</p>
              {/* 결과 페이지로 자동 리디렉션 중임을 알리는 메시지 */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TravelMbti;
