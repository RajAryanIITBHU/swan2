"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { updateAnswerInLocalStorage } from "@/utils/localStorageHelper";
import DOMPurify from "dompurify";
import { MathText } from "./MathsText";
import LatexText from "./LatexText";

export const Question = ({
  question,
  type,
  onAnswer,
  selectedAnswer,
  subject,
}) => {
  const containerRef = useRef(null);
  const [renderReady, setRenderReady] = useState(false);

useEffect(() => {
  setRenderReady(false); // reset before re-render
  const timeout = setTimeout(() => {
    setRenderReady(true); // allow typesetting after content mounts
  }, 0); // defer to next tick

  return () => clearTimeout(timeout);
}, [question?.content, question?.options]);

useEffect(() => {
  if (renderReady && window.MathJax && containerRef.current) {
    window.MathJax.typesetPromise?.([containerRef.current]);
  }
}, [renderReady]);

  const isMultipleChoice = type === "multi-mcq";

  const handleOptionChange = (optionId, checked) => {
    const updated = isMultipleChoice
      ? checked
        ? [...(selectedAnswer || []), optionId]
        : (selectedAnswer || []).filter((id) => id !== optionId)
      : optionId;

    updateAnswerInLocalStorage(subject, question.id, updated);
    onAnswer(updated);
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
          className="mt-1 border border-neutral-400 shadow-md"
          name={isMultipleChoice ? undefined : `question-${question.id}`}
        />
        <div className="flex-1">
          {option.text && (
            <LatexText text={option.text.replace(/\\\\/g, "\\") || ""} />
          )}
          {option.imageUrl && (
            <div className="mt-2">
              <img
                src={option.imageUrl}
                alt={option.text || "Option image"}
                className="max-w-[500px] max-h-[300px] rounded-lg "
              />
            </div>
          )}
        </div>
      </label>
    );
  };

  // For integer or decimal type questions
  if (type === "integer" || type === "decimal") {
    return (
      <div className="space-y-4" ref={containerRef}>
        {question?.imageUrl && (
          <div className="flex mb-6">
            <img
              src={question.imageUrl}
              alt="Question illustration"
              className="max-h-[450px] rounded-lg "
            />
          </div>
        )}
        <LatexText text={question?.content.replace(/\\\\/g, "\\") || ""} />
        {type === "decimal" && (
          <p className="text-lg pl-2 font-semibold opacity-75">
            (Answer up to decimal places)
          </p>
        )}
        <Input
          type="text"
          value={selectedAnswer || ""}
          onChange={(e) => {
            const val = e.target.value;
            onAnswer(val);
            updateAnswerInLocalStorage(subject, question.id, val);
          }}
          className="w-full p-2 border rounded-md outline-none shadow border-neutral-200"
          placeholder="Enter your answer"
        />
      </div>
    );
  }

  // For MCQ type questions
  return (
    <div className="space-y-4 relative text-wrap" ref={containerRef}>
      <LatexText text={question?.content.replace(/\\\\/g, "\\") || ""} />
      {question?.imageUrl && (
        <div className="flex mb-6">
          <img
            src={question.imageUrl}
            alt="Question illustration"
            className="max-h-[450px] rounded-lg"
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
