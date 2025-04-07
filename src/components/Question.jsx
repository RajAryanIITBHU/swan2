import React, { useEffect } from "react";

export const Question = ({ question, selectedAnswer, onAnswer }) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, [question]);


  const renderOption = (option, index) => {
    const isMultipleChoice = question.type === "mcq-multiple";
    const type = isMultipleChoice ? "checkbox" : "radio";
    const selected = isMultipleChoice
      ? (selectedAnswer || []).includes(option.value)
      : selectedAnswer === option.value;

    const handleChange = () => {
      if (isMultipleChoice) {
        const currentSelected = selectedAnswer || [];
        const newSelected = selected
          ? currentSelected.filter((value) => value !== option.value)
          : [...currentSelected, option.value];
        onAnswer(newSelected);
      } else {
        onAnswer(option.value);
      }
    };

    return (
      <label
        key={index}
        className="flex items-start space-x-2 p-4 hover:bg-gray-50 rounded-md cursor-pointer border border-gray-200 mb-2"
      >
        <input
          type={type}
          checked={selected}
          onChange={handleChange}
          className="mt-1"
          name={isMultipleChoice ? undefined : `question-${question.id}`}
        />
        <div className="flex-1">
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: option.text }}
          />
          {option.image && (
            <div className="mt-2">
              <img
                src={option.image}
                alt={option.text}
                className="max-w-[200px] rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </label>
    );
  };

  if (question.type === "integer") {
    return (
      <div className="space-y-4">
        {question.image && (
          <div className="flex justify-center mb-6">
            <img
              src={question.image}
              alt="Question illustration"
              className="max-w-[400px] rounded-lg shadow-md"
            />
          </div>
        )}
        <p
          className="text-lg font-medium"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        <input
          type="number"
          step="1"
          min="0"
          max="9"
          value={selectedAnswer || ""}
          onChange={(e) => onAnswer(parseInt(e.target.value, 10))}
          className="w-full p-2 border rounded-md"
          placeholder="Enter your answer (0-9)"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {question.image && (
        <div className="flex justify-center mb-6">
          <img
            src={question.image}
            alt="Question illustration"
            className="max-w-[400px] rounded-lg shadow-md"
          />
        </div>
      )}
      <p
        className="text-lg font-medium"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />
      {question.type === "mcq-multiple" && (
        <p className="text-sm text-gray-500 italic">Select all that apply</p>
      )}
      <div className="space-y-2">
        {question.options?.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  );
};
