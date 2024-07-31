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
      <h2 className="text-xl mb-4">{question}</h2>
      <div className="flex flex-col">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.type)}
            className="bg-primary-300 text-white p-2 my-2 rounded shadow-sm hover:bg-primary-500"
          >
            {option.answer}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center">{`${currentQuestion + 1} / ${totalQuestions}`}</p>
    </div>
  );
};

export default TravelMbtiQuest;
