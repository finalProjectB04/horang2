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
      className="w-full h-[calc(100vh-84px)] bg-cover bg-center relative"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.svg)" }}
    >
      <div className="flex justify-center items-start h-full py-10 px-4">
        <div className="bg-white p-6 rounded-[40px] sm:w-[350px] w-[500px] h-[80vh] flex flex-col max-h-[80vh] overflow-auto relative">
          <div className="relative pb-16">
            <header className="absolute top-0 left-0 right-0 bg-white p-5 rounded-t-[40px] z-10">
              <h1 className="text-3xl sm:text-xl font-bold text-center">여행 MBTI 테스트</h1>
              {currentQuestion > 0 && (
                <button onClick={handleBack} className="absolute top-4 left-4 p-2">
                  <img src="/assets/images/back.svg" alt="뒤로가기" className="w-5 h-5" />
                </button>
              )}
            </header>
          </div>

          <div className="pt-2 flex flex-col flex-1 p-4 overflow-auto">
            <div className="w-full bg-grey-200  rounded-full my-2">
              <div
                className="bg-primary-300 p-1 rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              >
                {/* {`${currentQuestion + 1} / ${questions.length}`} */}
              </div>
            </div>
            {testStarted && resultType === null ? (
              <div className="w-full text-cen ter">
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
                <h2 className="text-[16px] font-semibold mb-4">결과를 확인하세요!</h2>
                <p className="text-[14px]">결과 페이지로 자동 이동합니다...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
