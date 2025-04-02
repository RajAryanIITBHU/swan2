import React from "react";
import { questions } from "@/data/test1/question";

export const QuestionGrid = ({
  questions: questionStates,
  currentMainSection,
  currentSubSection,
  totalQuestions,
  onQuestionSelect,
  currentQuestionIndex,
}) => {
  const getQuestionStatus = (index) => {
    const sectionQuestions = questions.filter(
      (q) =>
        q.mainSection === currentMainSection &&
        q.subSection === currentSubSection
    );
    const question = sectionQuestions[index];
    if (!question) return "bg-gray-200";

    const questionState = questionStates[question.id];
    if (!questionState?.visited) return "bg-gray-200";
    if (questionState.markedForReview && questionState.answered)
      return "bg-purple-500 ring-2 ring-green-500";
    if (questionState.markedForReview) return "bg-purple-500";
    if (questionState.answered) return "bg-green-500";
    return "bg-red-500";
  };

  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {Array.from({ length: totalQuestions }, (_, i) => (
        <button
          key={i}
          onClick={() => onQuestionSelect(i)}
          className={`
            w-10 h-10 rounded-lg text-white font-semibold
            ${getQuestionStatus(i)}
            ${currentQuestionIndex === i ? "ring-2 ring-blue-500" : ""}
            hover:opacity-90 transition-all
          `}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
