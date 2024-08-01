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
      <p className="text-center text-grey-500">{`${currentQuestion + 1} / ${totalQuestions}`}</p>
      <h2 className="text-[24px] mb-4 font-bold mt-10">{question}</h2>
      <div className="flex flex-col">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.type)}
            className="bg-primary-300 text-white text-[18px] p-4 my-2 rounded-[8px] shadow-sm hover:bg-primary-500"
          >
            {option.answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TravelMbtiQuest;
