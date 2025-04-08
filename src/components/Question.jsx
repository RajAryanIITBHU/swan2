"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { updateAnswerInLocalStorage } from "@/utils/localStorageHelper"; 

export const Question = ({
  question,
  type,
  onAnswer,
  selectedAnswer,
  subject,
}) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, [question]);

  const isMultipleChoice = type === "multi-mcq";

  const handleOptionChange = (optionId, checked) => {
    if (isMultipleChoice) {
      const current = selectedAnswer || [];
      const updated = checked
        ? [...current, optionId]
        : current.filter((id) => id !== optionId);
      updateAnswerInLocalStorage(subject, question.id, updated);
      onAnswer(updated);
    } else {
      updateAnswerInLocalStorage(subject, question.id, optionId);
      onAnswer(optionId);
    }
  };

  const renderOption = (option) => {
    const isChecked = isMultipleChoice
      ? (selectedAnswer || []).includes(option.id)
      : selectedAnswer === option.id;

    return (
      <label
        key={option.id}
        className="flex items-start space-x-2 p-4 hover:bg-gray-50 rounded-md cursor-pointer border border-gray-200 mb-2"
      >
        <input
          type={isMultipleChoice ? "checkbox" : "radio"}
          checked={isChecked}
          onChange={(e) => handleOptionChange(option.id, e.target.checked)}
          className="mt-1"
          name={isMultipleChoice ? undefined : `question-${question.id}`}
        />
        <div className="flex-1">
          {option.text && (
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: option.text }}
            />
          )}
          {option.imageUrl && (
            <div className="mt-2">
              <img
                src={option.imageUrl}
                alt={option.text || "Option image"}
                className="max-w-[200px] rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </label>
    );
  };

  if (type === "integer" || type === "decimal") {
    const handleInputChange = (e) => {
      const val =
        type === "integer" ? parseInt(e.target.value, 10) : e.target.value;

      updateAnswerInLocalStorage(subject, question.id, val);
      onAnswer(val);
    };

    return (
      <div className="space-y-4">
        {question?.imageUrl && (
          <div className="flex mb-6">
            <img
              src={question?.imageUrl}
              alt="Question illustration"
              className="max-w-[400px] rounded-lg shadow-md"
            />
          </div>
        )}
        <p
          className="text-lg font-medium"
          dangerouslySetInnerHTML={{ __html: question?.content }}
        />
        {type === "decimal" && (
          <p className="text-lg pl-2 font-semibold opacity-75">
            {"("}Answer up to decimal places{")"}
          </p>
        )}
        <Input
          type="text"
          value={selectedAnswer || ""}
          onChange={(e) => {
            const val = e.target.value;
            onAnswer(val); // Always update answer as raw string
            updateAnswerInLocalStorage(subject, question.id, val);
          }}
          className="w-full p-2 border rounded-md outline-none"
          placeholder="Enter your answer"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p
        className="text-lg font-medium"
        dangerouslySetInnerHTML={{ __html: question?.content }}
      />
      {question?.imageUrl && (
        <div className="flex mb-6">
          <img
            src={question?.imageUrl}
            alt="Question illustration"
            className="max-w-[600px] rounded-lg shadow-md"
          />
        </div>
      )}
      {type === "multi-mcq" && (
        <p className="text-sm text-gray-500 italic">Select all that apply</p>
      )}
      <div className="space-y-2">{question?.options?.map(renderOption)}</div>
    </div>
  );
};
