"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TravelMbtiQuest from "@/components/travelMbti/TravelMbtiQuest";
import { questions } from "../question";

const SurveyPage = () => {
  const [testStarted, setTestStarted] = useState(true); // 설문조사는 시작된 상태로 설정
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
    <div
      className="w-full h-screen bg-cover bg-center fixed"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex justify-center items-start h-full pt-10">
        <div className="bg-white p-8 rounded-[40px] w-[500px] flex flex-col min-h-[85%] max-h-[85%] overflow-auto">
          <div className="relative mb-6">
            <header className="py-4 px-6 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-center">여행 MBTI 테스트</h1>
            </header>
            {currentQuestion > 0 && (
              <button onClick={handleBack} className="absolute top-4 left-4 p-2 rounded">
                <img src="/assets/images/back.svg" alt="뒤로가기" className="w-6 h-6" />
              </button>
            )}
          </div>

          <main className="flex flex-col items-center justify-center flex-1 p-4 overflow-auto">
            {/* 프로그래스바 */}
            <div className="w-full bg-grey-200 rounded-full mb-2">
              <div
                className="bg-primary-300 text-[12px] font-medium text-center text-white p-1 leading-none rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              >
                {/* {`${currentQuestion + 1} / ${questions.length}`} */}
              </div>
            </div>
            {testStarted && resultType === null ? (
              <div className="w-full text-center">
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
                <h2 className="text-xl font-semibold mb-4">결과를 확인하세요!</h2>
                <p>결과 페이지로 자동 이동합니다...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
