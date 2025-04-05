"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { QuestionGrid } from "@/components/QuestionGrid";
import { Question } from "@/components/Question";
import { PDFReport } from "@/components/PDFReport";
import { questions } from "@/data/test1/question";
import { calculateScore } from "@/utils/scoring";
import { AlertTriangle, Keyboard, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";

const INITIAL_TIME = 10800;
const MAX_WARNINGS = 3;

function App() {
  const [state, setState] = useState({
    currentMainSection: "Physics",
    currentSubSection: "Section 1",
    currentQuestionIndex: 0,
    timeRemaining: INITIAL_TIME,
    warnings: 0,
    isTestStarted: false,
    isTestEnded: false,
    questions: {},
  });

  const [userData, setUserData] = useState({
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: name === "email" ? validateEmail(value) : validatePhone(value),
    }));
  };

  const handleStartTest = async () => {
    const emailError = validateEmail(userData.email);
    const phoneError = validatePhone(userData.phone);

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }

    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }

    setState((prev) => ({ ...prev, isTestStarted: true }));
  };

  const currentSectionQuestions = questions.filter(
    (q) =>
      q.mainSection === state.currentMainSection &&
      q.subSection === state.currentSubSection
  );

  const currentQuestion = currentSectionQuestions[state.currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion && state.isTestStarted && !state.isTestEnded) {
      setState((prev) => ({
        ...prev,
        questions: {
          ...prev.questions,
          [currentQuestion.id]: {
            visited: true,
            answered: prev.questions[currentQuestion.id]?.answered || false,
            markedForReview:
              prev.questions[currentQuestion.id]?.markedForReview || false,
            selectedAnswer: prev.questions[currentQuestion.id]?.selectedAnswer,
          },
        },
      }));
    }
  }, [currentQuestion, state.isTestStarted, state.isTestEnded]);

  useEffect(() => {
    if (!state.isTestStarted || state.isTestEnded) return;

    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isTestStarted, state.isTestEnded]);

  const handleWarning = useCallback(() => {
    if (!state.isTestStarted || state.isTestEnded) return;

    setState((prev) => {
      const newWarnings = prev.warnings + 1;
      if (newWarnings > MAX_WARNINGS) {
        alert("Test terminated: You exceeded the maximum number of warnings.");
        return { ...prev, isTestEnded: true };
      } else {
        alert(
          `Warning ${newWarnings}/${MAX_WARNINGS}: Do not switch tabs or windows!`
        );
        return { ...prev, warnings: newWarnings };
      }
    });
  }, [state.isTestStarted, state.isTestEnded]);

  useEffect(() => {
    if (!state.isTestStarted || state.isTestEnded) return;

    let isWarningHandled = false;
    let warningTimeout;

    const handleVisibilityChange = () => {
      if (document.hidden && !isWarningHandled) {
        isWarningHandled = true;
        handleWarning();
        warningTimeout = setTimeout(() => {
          isWarningHandled = false;
        }, 1000);
      }
    };

    const handleBlur = () => {
      if (!isWarningHandled) {
        isWarningHandled = true;
        handleWarning();
        warningTimeout = setTimeout(() => {
          isWarningHandled = false;
        }, 1000);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isWarningHandled) {
        isWarningHandled = true;
        handleWarning();
        warningTimeout = setTimeout(() => {
          isWarningHandled = false;
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(warningTimeout);
    };
  }, [state.isTestStarted, state.isTestEnded, handleWarning]);

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;

    setState((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [currentQuestion.id]: {
          visited: true,
          answered: true,
          markedForReview:
            prev.questions[currentQuestion.id]?.markedForReview || false,
          selectedAnswer: answer,
        },
      },
    }));
  };

  const handleMarkForReview = () => {
    if (!currentQuestion) return;

    setState((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [currentQuestion.id]: {
          visited: true,
          answered: prev.questions[currentQuestion.id]?.answered || false,
          markedForReview: !prev.questions[currentQuestion.id]?.markedForReview,
          selectedAnswer: prev.questions[currentQuestion.id]?.selectedAnswer,
        },
      },
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;

    setState((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [currentQuestion.id]: {
          visited: true,
          answered: false,
          markedForReview:
            prev.questions[currentQuestion.id]?.markedForReview || false,
          selectedAnswer:
            currentQuestion.type === "mcq-multiple" ? [] : undefined,
        },
      },
    }));
  };

  const handleEndTest = useCallback(() => {
    if (!state.isTestEnded) {
      const confirmEnd = window.confirm(
        "Are you sure you want to submit the test?"
      );
      if (!confirmEnd) return;
    }
    setState((prev) => ({ ...prev, isTestEnded: true }));
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [state.isTestEnded]);



  if (!state.isTestStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center  flex-col">
        <div className="w-full p-1 flex justify-between bg-gray-600 ">
          <div className="flex gap-2 flex-col pl-4 py-4">
            <div>System Name:</div>
            <div className="text-4xl">C001</div>
          </div>
          <div className="flex">
            <div className="flex flex-col pt-4 items-end pr-4">
              <div className="">Candidate Name:</div>
              <div className="text-4xl mt-2">Name Name</div>
            </div>
            <div className="relative w-32 aspect-[15/16] bg-white"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-neutral-100 mt-8 rounded max-w-md w-full border-l border-r border-b pb-4 ">
            <div className="w-full px-6 py-2 bg-neutral-300 text-neutral-800 text-lg font-medium">
              Login
            </div>

            <div className="space-y-6 bg-neutral-100 p-6  border-neutral-300 ">
              <div className="flex gap-2 items-center border border-neutral-300">
                <label className="block px-3 text-sm font-medium items-center justify-center border-r border-r-neutral-300">
                  <div className="flex items-center">
                    <UserRound size={30} className=" text-neutral-700 " />
                  </div>
                </label>
                <input
                  type="text"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md  text-neutral-900 focus:border-none outline-none focus:outline-none border-none`}
                  placeholder="Enter your roll no"
                />
                <div className="text-neutral-700 px-3 border-l border-l-neutral-300 hover:bg-neutral-200 h-full py-1.5">
                  <Keyboard size={28} />
                </div>
              </div>

              <div className="flex gap-2 items-center border border-neutral-300">
                <label className="block text-sm font-medium px-3 border-r border-r-neutral-300">
                  <div className="flex items-center gap-2">
                    <LockKeyhole size={30} className=" text-neutral-700 " />
                  </div>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-neutral-900 focus:border-none outline-none focus:outline-none border-none`}
                  placeholder="Enter your DOB (DD-MM-YYYY)"
                  maxLength={10}
                />
                <div className="text-neutral-700 px-3 border-l border-l-neutral-300 hover:bg-neutral-200 h-full py-1.5">
                  <Keyboard size={28} />
                </div>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              disabled={!!(errors.email || errors.phone)}
              className=" mt-8 bg-blue-500 text-white px-16 py-2 w-[calc(100%-3rem)] mx-6 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="w-full bg-neutral-500 text-white">
          <div className="max-w-lg mx-auto text-center font-mono text-sm py-1">
            {" "}
            Version 1.0, &copy; <Link href={"/"} className="hover:underline">AmplifyJEE.in</Link>
          </div>
        </div>
      </div>
    );
  }

  if (state.isTestEnded) {
    const score = calculateScore(questions, state.questions);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <p className="text-lg mb-4">
            Total Score: {score.total}/{score.maxTotal}
          </p>
          <div className="space-y-4">
            {["Physics", "Chemistry", "Mathematics"].map((section) => (
              <div key={section}>
                <h3 className="font-semibold text-lg">{section}</h3>
                <div className="ml-4 space-y-2">
                  {["Section 1", "Section 2", "Section 3"].map((subSection) => (
                    <div
                      key={`${section}-${subSection}`}
                      className="flex justify-between items-center"
                    >
                      <span>{subSection}:</span>
                      <span>
                        {
                          score.sectionWise[section].sectionWise[subSection]
                            .score
                        }
                        /
                        {
                          score.sectionWise[section].sectionWise[subSection]
                            .maxScore
                        }
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>
                      {score.sectionWise[section].total}/
                      {score.sectionWise[section].maxTotal}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PDFReport
            score={score}
            questions={questions}
            responses={state.questions}
            userData={userData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-background shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <img
              src="/images/logo/logo.png"
              alt="JEE Advanced Logo"
              className="h-12 w-auto"
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="w-5 h-5 mr-1" />
                <span>
                  Warnings: {state.warnings}/{MAX_WARNINGS}
                </span>
              </div>
              <Timer
                timeRemaining={state.timeRemaining}
                onTimeEnd={handleEndTest}
                isTestStarted={state.isTestStarted}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-2">
              {["Physics", "Chemistry", "Mathematics"].map((section) => (
                <div key={section} className="flex space-x-2">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        currentMainSection: section,
                        currentSubSection: "Section 1",
                        currentQuestionIndex: 0,
                      }))
                    }
                    className={`px-4 py-2 rounded-lg ${
                      state.currentMainSection === section
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {section}
                  </button>
                  {state.currentMainSection === section && (
                    <div className="flex space-x-2">
                      {["Section 1", "Section 2", "Section 3"].map(
                        (subSection) => (
                          <button
                            key={subSection}
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                currentSubSection: subSection,
                                currentQuestionIndex: 0,
                              }))
                            }
                            className={`px-4 py-2 rounded-lg ${
                              state.currentSubSection === subSection
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {subSection}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Question Display */}
          <div className="col-span-8 bg-background rounded-lg shadow-md p-6">
            {currentQuestion ? (
              <>
                <Question
                  question={currentQuestion}
                  selectedAnswer={
                    state.questions[currentQuestion.id]?.selectedAnswer
                  }
                  onAnswer={handleAnswer}
                />
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        currentQuestionIndex: Math.max(
                          0,
                          prev.currentQuestionIndex - 1
                        ),
                      }))
                    }
                    disabled={state.currentQuestionIndex === 0}
                    className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={handleClearResponse}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Clear Response
                    </button>
                    <button
                      onClick={handleMarkForReview}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Mark for Review
                    </button>
                    <button
                      onClick={() => {
                        if (
                          state.currentQuestionIndex <
                          currentSectionQuestions.length - 1
                        ) {
                          setState((prev) => ({
                            ...prev,
                            currentQuestionIndex: prev.currentQuestionIndex + 1,
                          }));
                        }
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Save & Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No questions available for this section
              </div>
            )}
          </div>

          {/* Question Grid */}
          <div className="col-span-4 bg-background rounded-lg shadow-md">
            <h3 className="p-4 border-b font-semibold">Question Navigation</h3>
            <QuestionGrid
              questions={state.questions}
              currentMainSection={state.currentMainSection}
              currentSubSection={state.currentSubSection}
              totalQuestions={currentSectionQuestions.length}
              onQuestionSelect={(index) =>
                setState((prev) => ({ ...prev, currentQuestionIndex: index }))
              }
              currentQuestionIndex={state.currentQuestionIndex}
            />
            <div className="p-4 border-t">
              <button
                onClick={handleEndTest}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
