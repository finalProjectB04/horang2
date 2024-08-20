import React from "react";

interface Option {
  answer: string;
  type: string;
}

interface TravelMbtiQuestProps {
  question: string;
  options: Option[];
  onAnswer: (type: string) => void;
  currentQuestion: number;
  totalQuestions: number;
}

const TravelMbtiQuest: React.FC<TravelMbtiQuestProps> = ({
  question,
  options,
  onAnswer,
  currentQuestion,
  totalQuestions,
}) => {
  return (
    <div>
      <p className="text-[12px] text-center text-grey-500">{`${currentQuestion + 1} / ${totalQuestions}`}</p>
      <h2 className="md:text-[18px] lg:text-[18px] sm:text-[16px] text-center mb-4 font-bold sm:mt-6 md:mt-10 lg:mt-12">
        {question}
      </h2>
      <div className="flex flex-col mt-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.type)}
            className="bg-primary-300 text-white sm:text-[14px] sm:p-3 sm:my-1 p-4 my-1 rounded-[8px] shadow-sm hover:bg-primary-500"
          >
            {option.answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TravelMbtiQuest;
