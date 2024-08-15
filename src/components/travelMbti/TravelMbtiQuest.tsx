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
      <h2 className="text-[16px] text-center mb-4 font-bold mt-8">{question}</h2>
      <div className="flex flex-col mt-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.type)}
            className="bg-primary-300 text-white text-[14px] p-3 my-1 rounded-[8px] shadow-sm hover:bg-primary-500"
          >
            {option.answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TravelMbtiQuest;
