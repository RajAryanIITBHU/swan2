"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { QuestionGrid } from "@/components/QuestionGrid";
import { Question } from "@/components/Question";
import { PDFReport } from "@/components/PDFReport";
import { questions } from "@/data/test1/question";
import { calculateScore } from "@/utils/scoring";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import useSessionStorage from "@/hooks/useSessionStorage";
import {
  addUniqueQuestionToLocalStorage,
  calculateScoreFromLocalStorage,
  clearAnswerInLocalStorage,
  getQuestionFromLocalStorage,
  initializeLocalStorageWithQuestionsBySections,
  markForReviewInLocalStorage,
  markQuestionVisitedInLocalStorage,
  unmarkReviewInLocalStorage,
  updateAnswerInLocalStorage,
} from "@/utils/localStorageHelper";
import ScoreSummary from "@/components/ScoreSummary";

const INITIAL_TIME = 10800;
const MAX_WARNINGS = 3;

export default function TestPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  const [state, setState] = useState({
    currentMainSection: "Physics",
    currentSubSection: "Section 1",
    currentSubSectionType: "",
    currentQuestionIndex: 0,
    currAnswer: null,
    timeRemaining: INITIAL_TIME,
    warnings: 0,
    isTestStarted: false,
    isTestEnded: false,
    currentQuestion: null,
    questions: {},
    currAnswers: {},
  });
  const [qData, setQDtata] = useState(null);

  const [score, setScore] = useState(null);

  const [isInstruction, setIsIntruction] = useState({
    next: false,
    previous: false,
  });

  const [userData, setUserData] = useState({
    rollNo: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    rollNo: "",
    password: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (parseInt(userData.rollNo) !== session?.user?.rollNo) {
      setErrors((p) => ({ ...p, rollNo: "Enter your correct Roll number." }));

      return;
    }
    if (userData.password !== session?.user?.dob) {
      setErrors((p) => ({
        ...p,
        rollNo: "Enter your correct Date of Birth in DD/MM/YYYY Format.",
      }));
      return;
    }

    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
    setIsIntruction({ next: true, previous: false });
    fetchData();
    // setState((prev) => ({ ...prev, isTestStarted: true }));
  };

  const handleTestStart = () => {
    setIsIntruction({ next: true, previous: true });
    setState((p)=>({...p, isTestStarted: true}))
  };

  const currentSectionQuestions = questions.filter(
    (q) =>
      q.mainSection === state.currentMainSection &&
      q.subSection === state.currentSubSection
  );

  const currentQuestion = currentSectionQuestions[state.currentQuestionIndex];

  const fetchData = async () => {
    try {
      const id = params.id;
      const [batch, ...testParts] = id.split("-");
      const testName = testParts.join("-");

      const res = await fetch(`/api/read/${batch}/${testName}`);
      const data = await res.json();
      setQDtata(data);
      console.log(data);

      initializeLocalStorageWithQuestionsBySections({
        physics: data?.physics,
        mathematics: data?.mathematics,
        chemistry: data?.chemistry,
      });


      if (data?.physics.length > 0) {
        setState((p) => ({
          ...p,
          currentMainSection: "Physics",
          currentSubSection: "Section 1",
          currentQuestion: data.physics[0].questions[0],
          currentSubSectionType: data.physics[0].type,
        }));

        markQuestionVisitedInLocalStorage(
          "physics",
          data.physics[0].questions[0].id
        );
      } else if (data?.chemistry.length > 0) {
        setState((p) => ({
          ...p,
          currentMainSection: "Chemistry",
          currentSubSection: "Section 1",
          currentQuestion: data.chemistry[0].questions[0],
          currentSubSectionType: data.chemistry[0].type,
        }));

        markQuestionVisitedInLocalStorage(
          "chemistry",
          data.chemistry[0].questions[0].id
        );
      } else {
        setState((p) => ({
          ...p,
          currentMainSection: "Mathematics",
          currentSubSection: "Section 1",
          currentQuestion: data.mathematics[0].questions[0],
          currentSubSectionType: data.mathematics[0].type,
        }));

        markQuestionVisitedInLocalStorage(
          "mathematics",
          data.mathematics[0].questions[0].id
        );
      }
      
    } catch (err) {
      console.error("Failed to load JSON", err);
      toast.error("Error while fetching the Questions");
    }
  };

  useEffect(() => {
    console.log(state.currentSubSectionType);
  }, [state.currentSubSectionType]);


  useEffect(() => {
    if (!isInstruction.next || !isInstruction.previous) return;

    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isInstruction]);


  // WARNING
  const handleWarning = useCallback(() => {
  if (!isInstruction.next || !isInstruction.previous) return;

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
  }, [isInstruction]);

  // useEffect(() => {
  //   if (!isInstruction.next || !isInstruction.previous) return;

  //   let isWarningHandled = false;
  //   let warningTimeout;

  //   const handleVisibilityChange = () => {
  //     if (document.hidden && !isWarningHandled) {
  //       isWarningHandled = true;
  //       handleWarning();
  //       warningTimeout = setTimeout(() => {
  //         isWarningHandled = false;
  //       }, 1000);
  //     }
  //   };

  //   const handleBlur = () => {
  //     if (!isWarningHandled) {
  //       isWarningHandled = true;
  //       handleWarning();
  //       warningTimeout = setTimeout(() => {
  //         isWarningHandled = false;
  //       }, 1000);
  //     }
  //   };

  //   const handleFullscreenChange = () => {
  //     if (!document.fullscreenElement && !isWarningHandled) {
  //       isWarningHandled = true;
  //       handleWarning();
  //       warningTimeout = setTimeout(() => {
  //         isWarningHandled = false;
  //       }, 1000);
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   window.addEventListener("blur", handleBlur);
  //   document.addEventListener("fullscreenchange", handleFullscreenChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("blur", handleBlur);
  //     document.removeEventListener("fullscreenchange", handleFullscreenChange);
  //     clearTimeout(warningTimeout);
  //   };
  // }, [isInstruction, handleWarning]);

  const handleAnswer = (qid, answer) => {
    let ans = Array.isArray(answer) && answer.length == 0 ? null : answer
    setState((prev) => ({
      ...prev,
      currAnswers: {
        ...prev.currAnswers,
        [qid]: ans,
      },
    }));

    const subject = state.currentMainSection.toLowerCase();

    updateAnswerInLocalStorage(subject, qid, ans, {
      isVisited: true,
      status: "answered",
    });

    console.log("📝 Answer Updated", { qid, answer });
  };

  const handleClear = (qid) => {
    clearAnswerInLocalStorage(state.currentMainSection.toLowerCase(), qid);

    setState((prev) => ({
      ...prev,
      currAnswers: {
        ...prev.currAnswers,
        [qid]: null,
      },
    }));
  };

  const handleMarkForReview = () => {
    const subjectKey = state.currentMainSection.toLowerCase();
    const currentQid = state.currentQuestion?.id;

    if (!subjectKey || !currentQid) return;

    markForReviewInLocalStorage(subjectKey, currentQid);
  };

  const handleUnmarkReview = () => {
    const subjectKey = state.currentMainSection.toLowerCase();
    const currentQid = state.currentQuestion?.id;
    if (!subjectKey || !currentQid) return;

    unmarkReviewInLocalStorage(subjectKey, currentQid);
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


  useEffect(() => {
    const data = localStorage.getItem("finalScore");
    if (data) {
      setScore(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEV !== "Development") {
      const blockContextMenu = (e) => e.preventDefault();
      const blockKeyDown = (e) => {
        if (
          e.ctrlKey ||
          e.key === "F12" ||
          (e.metaKey && e.shiftKey) ||
          (e.ctrlKey && e.shiftKey)
        ) {
          e.preventDefault();
        }
      };

      document.addEventListener("contextmenu", blockContextMenu);
      document.addEventListener("keydown", blockKeyDown);

      document.documentElement.requestFullscreen?.().catch(console.warn);

      return () => {
        document.removeEventListener("contextmenu", blockContextMenu);
        document.removeEventListener("keydown", blockKeyDown);
      };
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAndNext = () => {
    const currentSubject = state.currentMainSection.toLowerCase();
    const currentSections = qData?.[currentSubject] || [];
    const currentSectionIndex = currentSections.findIndex(
      (section) => section.name === state.currentSubSection
    );

    if (currentSectionIndex === -1) return;

    const currentSection = currentSections[currentSectionIndex];
    const currentQuestions = currentSection.questions || [];
    const nextQuestionIndex = state.currentQuestionIndex + 1;

    // If next question exists in the current section
    if (nextQuestionIndex < currentQuestions.length) {
      const nextQuestion = currentQuestions[nextQuestionIndex];

      setState((prev) => ({
        ...prev,
        currentQuestionIndex: nextQuestionIndex,
        currentQuestion: nextQuestion,
        currAnswer: state.currAnswers[nextQuestion.id] || null,
      }));

      markQuestionVisitedInLocalStorage(currentSubject, nextQuestion.id);
      return;
    }

    // Else move to next section in the same subject
    const nextSectionIndex = currentSectionIndex + 1;
    if (nextSectionIndex < currentSections.length) {
      const nextSection = currentSections[nextSectionIndex];
      const nextQuestion = nextSection.questions[0];

      setState((prev) => ({
        ...prev,
        currentSubSection: nextSection.name,
        currentSubSectionType: nextSection.type,
        currentQuestionIndex: 0,
        currentQuestion: nextQuestion,
        currAnswer: state.currAnswers[nextQuestion.id] || null,
      }));

      markQuestionVisitedInLocalStorage(currentSubject, nextQuestion.id);
      return;
    }

    // Else move to next subject
    const subjectOrder = ["physics", "chemistry", "mathematics"];
    const currentSubjectIndex = subjectOrder.indexOf(currentSubject);

    for (let i = currentSubjectIndex + 1; i < subjectOrder.length; i++) {
      const nextSubject = subjectOrder[i];
      if ((qData?.[nextSubject] || []).length > 0) {
        const nextSection = qData[nextSubject][0];
        const nextQuestion = nextSection.questions[0];

        setState((prev) => ({
          ...prev,
          currentMainSection:
            nextSubject[0].toUpperCase() + nextSubject.slice(1),
          currentSubSection: nextSection.name,
          currentSubSectionType: nextSection.type,
          currentQuestionIndex: 0,
          currentQuestion: nextQuestion,
          currAnswer: state.currAnswers[nextQuestion.id] || null,
        }));

        markQuestionVisitedInLocalStorage(nextSubject, nextQuestion.id);
        return;
      }
    }

    // No more questions left
    toast.info("🎉 You've reached the end of the test!");
  };


  if (!isInstruction.next && !isInstruction.previous && false) {
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

        <div className="flex-1 max-w-md w-full">
          <div className="bg-neutral-100 mt-8 rounded  w-full border-l border-r border-b pb-4 ">
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
                  name="rollNo"
                  value={userData.rollNo}
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
                  name="password"
                  value={userData.password}
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

            {errors.password !== "" && (
              <p className="border rounded border-red-500 bg-red-50 w-[calc(100%-3rem)] text-sm text-red-900 px-6 py-1.5 mx-6">
                Error: {errors.password}
              </p>
            )}
            {errors.rollNo !== "" && (
              <p className="border rounded border-red-500 bg-red-50 w-[calc(100%-3rem)] text-sm text-red-900 px-6 py-1.5 mx-6">
                Error: {errors.rollNo}
              </p>
            )}

            <button
              onClick={() => {
                handleContinue();
              }}
              // disabled={errors.email !== "" || errors.phone !== ""}
              className=" mt-8 bg-blue-500 text-white px-16 py-2 w-[calc(100%-3rem)] mx-6 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="w-full bg-neutral-500 text-white">
          <div className="max-w-lg mx-auto text-center font-mono text-sm py-1">
            {" "}
            Version 1.0, &copy;{" "}
            <Link href={"/"} className="hover:underline">
              AmplifyJEE.in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isInstruction.previous && isInstruction.next && false) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col text-neutral-900">
        <div className="w-full px-6 bg-cyan-200 text-lg font-bold text-neutral-600 tracking-wide py-1.5">
          Instruction
        </div>
        <div className="w-full flex flex-col gap-4 px-6 py-8 text-sm max-w-4xl mx-auto flex-1 overflow-y-auto">
          <h2 className=" text-center font-semibold font-serif">
            READ THE INSTRUCTIONS CAREFULLY
          </h2>
          <span className=" font-semibold font-serif">
            GENERAL INSTRUCTIONS
          </span>
          <ol>
            <li>Total duration of the paper is 3 hours (180 minutes).</li>
            <li>
              The on-screen computer countdown timer on the top right corner of
              computer screen will display the remaining time (in minutes)
              available to you for completing the paper. When the on-screen
              countdown timer reaches zero, the paper will end by itself –{" "}
              <strong>
                No input from your side will be accepted after the timer reaches
                zero
              </strong>{" "}
              and whatever answers have been saved by you will automatically be
              submitted for evaluation.
            </li>
            <li>
              The <strong>“</strong>
              <strong>Submit</strong>” button present at the bottom right corner
              of the screen will remain deactivated during the entire 180
              minutes duration of the paper. Note that the <strong>“</strong>
              <strong>Submit</strong>
              <strong>”</strong> button will be activated only after the timer
              has reached zero and the saved responses will be automatically
              submitted. It is <strong>NOT</strong> required to click on{" "}
              <strong>“</strong>
              <strong>Submit</strong>
              <strong>”</strong> after the timer has reached zero.
            </li>
            <li>
              The Question Palette displayed on the right side of screen will
              show the status of each question as per one of the following
              symbols (<em>the question numbers appear inside the symbols</em>):{" "}
              <table className="instruction_area" border="1">
                <tbody>
                  <tr>
                    <td>
                      <span className="not_visited" title="Not Visited">
                        1
                      </span>
                    </td>
                    <td>
                      <strong>“Not Visited”</strong> - You have not visited the
                      question yet.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="not_answered" title="Not Answered">
                        2
                      </span>
                    </td>
                    <td>
                      <strong>“Not Answered”</strong> - You have not answered
                      the question yet.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="answered" title="Answered">
                        3
                      </span>
                    </td>
                    <td>
                      <strong>“Answered”</strong> - You have answered the
                      question. All these questions will be evaluated.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="review" title="Marked for Review">
                        4
                      </span>
                    </td>
                    <td>
                      <strong>“Marked for Review”</strong> - You have NOT
                      answered the question but have ONLY marked the question
                      for review.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        className="review_marked_considered"
                        title="Answered &amp; Marked for Review"
                      >
                        5
                      </span>
                    </td>
                    <td>
                      <strong>“Answered and Marked for Review”</strong> - You
                      have answered the question and have also marked it for
                      review. All these questions will be evaluated.
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>{" "}
            <br />
            <li>
              The <strong>“</strong>
              <strong>Marked for Review</strong>
              <strong>”</strong> status for a question indicates you would like
              to look at that question again.
            </li>
            <li>
              You can click on the &quot;&gt;&quot; arrow symbol, which appears
              to the left of question palette, to collapse the question palette
              thereby maximizing the question window. To view the question
              palette again, you can click on &quot;&lt;&quot; symbol which
              appears on the right side of question window.
            </li>
            <li>
              Before you start the paper, select your default language (either
              ENGLISH or HINDI) for viewing the questions by selecting your
              preferred language from the drop down menu under{" "}
              <strong>“</strong>
              <strong>Choose your default language</strong>
              <strong>”</strong> located below the <strong>“</strong>
              <strong>Instructions to Candidates</strong>
              <strong>”</strong> section.
            </li>
            <li>
              Anytime during the paper, you can change the question viewing
              language of the displayed question. To change the question viewing
              language (either ENGLISH or HINDI) of the displayed question,
              select the preferred language from the drop down menu under{" "}
              <strong>“</strong>
              <strong>View in</strong>
              <strong>”</strong> located in the upper right side of the question
              viewing window.
            </li>
            <li>
              Anytime during the paper, you can change the default question
              viewing language of the question paper. You can click on{" "}
              <strong>Profile</strong> image on top right corner of computer
              screen to change the default language (either ENGLISH or HINDI) of
              the entire question paper during the exam. On clicking of Profile
              image, you will get an option to change the default question
              viewing language.
            </li>
            <li>
              You can click on downward arrow symbol{" "}
              <img
                className="scrollBottom"
                id="scrollBottom"
                src="images/Down.png"
                title="Scroll Down"
              />{" "}
              to navigate to the bottom and upward arrow{" "}
              <img
                className="scrollTop"
                id="scrollTop"
                src="images/Up.png"
                title="Scroll Up"
              />{" "}
              to navigate to the top of the question area, without scrolling.
            </li>
            <li>
              You can also use the computer mouse to scroll up/down the question
              viewing area to view complete contents of the question viewing
              area.
            </li>
            <li>
              At the end of the <strong>“</strong>
              <strong>Instructions to Candidates</strong>
              <strong>”</strong> section, you must click on the checkbox beside
              the <strong>“</strong>
              <strong>
                I have read all the instructions and shall abide by them
              </strong>
              <strong>”</strong> and then only you will be able to proceed to
              view and answer the questions at the start of the paper. Your
              on-screen clock will start at the designated time of the start of
              the paper.
            </li>
            <li>
              The full question paper can be viewed anytime during the paper by
              clicking the <strong>“</strong>
              <strong>Question Paper</strong>
              <strong>”</strong> button on the top right corner of the computer
              screen.
            </li>
            <li>
              These instructions can be viewed anytime during the paper by
              clicking <strong>“</strong>
              <strong>Instructions</strong>
              <strong>”</strong> button located at the top right corner of the
              computer screen.
            </li>
          </ol>
          <strong>NAVIGATING THROUGH PARTS</strong>/
          <strong>SECTIONS OF QUESTION PAPER</strong>
          <br />
          <ol>
            <li>
              Parts (PHYSICS, CHEMISTRY and MATHEMATICS) and sections of the
              parts thereof in the question paper are displayed on the top of
              the screen. Questions within a section can be viewed by clicking
              on the corresponding section name. The section which you will be
              viewing will be highlighted.
            </li>
            <li>
              After clicking the<strong> “Save &amp; Next”</strong> button on
              the last question of a part/section, you will automatically be
              taken to the first question of the next part/section.
            </li>
            <li>
              You can navigate between parts/sections and questions within
              parts/sections anytime during the paper as per your convenience.
            </li>
            <li>
              You can view the corresponding section summary which will be
              visible in every section above the question palette.
            </li>
          </ol>
          <div className="MsoNormal">
            <strong>NAVIGATING TO A QUESTION</strong>
            <br /> <br /> To navigate between questions, you need to do the
            following:
          </div>
          <ol type="a" start="1">
            <li>
              Click on the question number in the Question Palette at the right
              of the screen to go to that numbered question directly.{" "}
              <strong>
                Note that using this option does NOT save the answer (if it is
                answered) to the current question. To save the answer, you must
                click on{" "}
              </strong>
              <strong>“</strong>
              <strong>Save &amp; Next” </strong>button<strong>.</strong>
            </li>
            <li>
              Click on <strong>“</strong>
              <strong>Save &amp; Next</strong>
              <strong>” </strong>button to save the answer for the current
              question and then go to the next question.
            </li>
            <li>
              Click on <strong>“</strong>
              <strong>Mark for Review &amp; Next</strong>
              <strong>”</strong> button to mark it for review (with or without
              answering the question) and go to the next question.
            </li>
          </ol>
          <strong>ANSWERING A QUESTION </strong>
          <ul>
            {" "}
            <li>
              Follow the procedure, given in <b>“Instructions to Candidates”</b>{" "}
              section
              <font
                size="2"
                face="Default Monospace,Courier New,Courier,monospace"
              >
                {" "}
              </font>
              (click on <b>&apos;Next&apos;</b> below), for answering a
              particular type of question.
            </li>{" "}
            <li>
              To change the answer of a question that has already been answered,
              if required, first click on the <strong>“</strong>
              <strong>Clear Response</strong>
              <strong>”</strong> button to clear the saved answer and then
              follow the procedure for answering that type of question.
            </li>{" "}
            <li>
              To mark a question ONLY for review (i.e. without answering it),
              click on the <strong>“</strong>
              <strong>Mark for Review &amp; Next</strong>
              <strong>”</strong> button.
            </li>{" "}
            <li>
              To mark a question for review (after answering it), click on{" "}
              <strong>“</strong>
              <strong>Mark for Review &amp; Next</strong>
              <strong>”</strong> button – the answered question which is also
              marked for review will be evaluated.
            </li>{" "}
            <li>
              To save the answer, click on the <strong>“</strong>
              <strong>Save &amp; Next</strong>
              <strong>” </strong>button - the answered question will be
              evaluated.
            </li>{" "}
          </ul>
        </div>

        <div className="w-full bg-white border-t border-t-neutral-500 px-6 pt-8 pb-20 sticky bottom-0">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                });
                setIsIntruction({ next: false, previous: true });
              }}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-500 bg-neutral-100 hover:bg-neutral-200"
            >
              Next <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isInstruction.previous && !isInstruction.next && false) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col text-neutral-900">
        <div className="w-full px-6 bg-cyan-200 text-lg font-bold text-neutral-600 tracking-wide py-1.5">
          Instruction
        </div>
        <div className="w-full flex flex-col gap-4 px-6 py-8 text-sm max-w-4xl mx-auto flex-1 overflow-y-auto">
          <h2 className=" text-center font-semibold font-serif">
            READ THE INSTRUCTIONS CAREFULLY
          </h2>
          <span className=" font-semibold font-serif">
            GENERAL INSTRUCTIONS
          </span>
          <ol>
            <li>Total duration of the paper is 3 hours (180 minutes).</li>
            <li>
              The on-screen computer countdown timer on the top right corner of
              computer screen will display the remaining time (in minutes)
              available to you for completing the paper. When the on-screen
              countdown timer reaches zero, the paper will end by itself –{" "}
              <strong>
                No input from your side will be accepted after the timer reaches
                zero
              </strong>{" "}
              and whatever answers have been saved by you will automatically be
              submitted for evaluation.
            </li>
            <li>
              The <strong>“</strong>
              <strong>Submit</strong>” button present at the bottom right corner
              of the screen will remain deactivated during the entire 180
              minutes duration of the paper. Note that the <strong>“</strong>
              <strong>Submit</strong>
              <strong>”</strong> button will be activated only after the timer
              has reached zero and the saved responses will be automatically
              submitted. It is <strong>NOT</strong> required to click on{" "}
              <strong>“</strong>
              <strong>Submit</strong>
              <strong>”</strong> after the timer has reached zero.
            </li>
            <li>
              The Question Palette displayed on the right side of screen will
              show the status of each question as per one of the following
              symbols (<em>the question numbers appear inside the symbols</em>
              ):{" "}
              <table className="instruction_area" border="1">
                <tbody>
                  <tr>
                    <td>
                      <span className="not_visited" title="Not Visited">
                        1
                      </span>
                    </td>
                    <td>
                      <strong>“Not Visited”</strong> - You have not visited the
                      question yet.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="not_answered" title="Not Answered">
                        2
                      </span>
                    </td>
                    <td>
                      <strong>“Not Answered”</strong> - You have not answered
                      the question yet.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="answered" title="Answered">
                        3
                      </span>
                    </td>
                    <td>
                      <strong>“Answered”</strong> - You have answered the
                      question. All these questions will be evaluated.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="review" title="Marked for Review">
                        4
                      </span>
                    </td>
                    <td>
                      <strong>“Marked for Review”</strong> - You have NOT
                      answered the question but have ONLY marked the question
                      for review.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        className="review_marked_considered"
                        title="Answered &amp; Marked for Review"
                      >
                        5
                      </span>
                    </td>
                    <td>
                      <strong>“Answered and Marked for Review”</strong> - You
                      have answered the question and have also marked it for
                      review. All these questions will be evaluated.
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>{" "}
            <br />
            <li>
              The <strong>“</strong>
              <strong>Marked for Review</strong>
              <strong>”</strong> status for a question indicates you would like
              to look at that question again.
            </li>
            <li>
              You can click on the &quot;&gt;&quot; arrow symbol, which appears
              to the left of question palette, to collapse the question palette
              thereby maximizing the question window. To view the question
              palette again, you can click on &quot;&lt;&quot; symbol which
              appears on the right side of question window.
            </li>
            <li>
              Before you start the paper, select your default language (either
              ENGLISH or HINDI) for viewing the questions by selecting your
              preferred language from the drop down menu under{" "}
              <strong>“</strong>
              <strong>Choose your default language</strong>
              <strong>”</strong> located below the <strong>“</strong>
              <strong>Instructions to Candidates</strong>
              <strong>”</strong> section.
            </li>
            <li>
              Anytime during the paper, you can change the question viewing
              language of the displayed question. To change the question viewing
              language (either ENGLISH or HINDI) of the displayed question,
              select the preferred language from the drop down menu under{" "}
              <strong>“</strong>
              <strong>View in</strong>
              <strong>”</strong> located in the upper right side of the question
              viewing window.
            </li>
            <li>
              Anytime during the paper, you can change the default question
              viewing language of the question paper. You can click on{" "}
              <strong>Profile</strong> image on top right corner of computer
              screen to change the default language (either ENGLISH or HINDI) of
              the entire question paper during the exam. On clicking of Profile
              image, you will get an option to change the default question
              viewing language.
            </li>
            <li>
              You can click on downward arrow symbol{" "}
              <img
                className="scrollBottom"
                id="scrollBottom"
                src="images/Down.png"
                title="Scroll Down"
              />{" "}
              to navigate to the bottom and upward arrow{" "}
              <img
                className="scrollTop"
                id="scrollTop"
                src="images/Up.png"
                title="Scroll Up"
              />{" "}
              to navigate to the top of the question area, without scrolling.
            </li>
            <li>
              You can also use the computer mouse to scroll up/down the question
              viewing area to view complete contents of the question viewing
              area.
            </li>
            <li>
              At the end of the <strong>“</strong>
              <strong>Instructions to Candidates</strong>
              <strong>”</strong> section, you must click on the checkbox beside
              the <strong>“</strong>
              <strong>
                I have read all the instructions and shall abide by them
              </strong>
              <strong>”</strong> and then only you will be able to proceed to
              view and answer the questions at the start of the paper. Your
              on-screen clock will start at the designated time of the start of
              the paper.
            </li>
            <li>
              The full question paper can be viewed anytime during the paper by
              clicking the <strong>“</strong>
              <strong>Question Paper</strong>
              <strong>”</strong> button on the top right corner of the computer
              screen.
            </li>
            <li>
              These instructions can be viewed anytime during the paper by
              clicking <strong>“</strong>
              <strong>Instructions</strong>
              <strong>”</strong> button located at the top right corner of the
              computer screen.
            </li>
          </ol>
          <strong>NAVIGATING THROUGH PARTS</strong>/
          <strong>SECTIONS OF QUESTION PAPER</strong>
          <br />
          <ol>
            <li>
              Parts (PHYSICS, CHEMISTRY and MATHEMATICS) and sections of the
              parts thereof in the question paper are displayed on the top of
              the screen. Questions within a section can be viewed by clicking
              on the corresponding section name. The section which you will be
              viewing will be highlighted.
            </li>
            <li>
              After clicking the<strong> “Save &amp; Next”</strong> button on
              the last question of a part/section, you will automatically be
              taken to the first question of the next part/section.
            </li>
            <li>
              You can navigate between parts/sections and questions within
              parts/sections anytime during the paper as per your convenience.
            </li>
            <li>
              You can view the corresponding section summary which will be
              visible in every section above the question palette.
            </li>
          </ol>
          <div className="MsoNormal">
            <strong>NAVIGATING TO A QUESTION</strong>
            <br /> <br /> To navigate between questions, you need to do the
            following:
          </div>
          <ol type="a" start="1">
            <li>
              Click on the question number in the Question Palette at the right
              of the screen to go to that numbered question directly.{" "}
              <strong>
                Note that using this option does NOT save the answer (if it is
                answered) to the current question. To save the answer, you must
                click on{" "}
              </strong>
              <strong>“</strong>
              <strong>Save &amp; Next” </strong>button<strong>.</strong>
            </li>
            <li>
              Click on <strong>“</strong>
              <strong>Save &amp; Next</strong>
              <strong>” </strong>button to save the answer for the current
              question and then go to the next question.
            </li>
            <li>
              Click on <strong>“</strong>
              <strong>Mark for Review &amp; Next</strong>
              <strong>”</strong> button to mark it for review (with or without
              answering the question) and go to the next question.
            </li>
          </ol>
          <strong>ANSWERING A QUESTION </strong>
          <ul>
            {" "}
            <li>
              Follow the procedure, given in <b>“Instructions to Candidates”</b>{" "}
              section
              <font
                size="2"
                face="Default Monospace,Courier New,Courier,monospace"
              >
                {" "}
              </font>
              (click on <b>&apos;Next&apos;</b> below), for answering a
              particular type of question.
            </li>{" "}
            <li>
              To change the answer of a question that has already been answered,
              if required, first click on the <strong>“</strong>
              <strong>Clear Response</strong>
              <strong>”</strong> button to clear the saved answer and then
              follow the procedure for answering that type of question.
            </li>{" "}
            <li>
              To mark a question ONLY for review (i.e. without answering it),
              click on the <strong>“</strong>
              <strong>Mark for Review &amp; Next</strong>
              <strong>”</strong> button.
            </li>{" "}
            <li>
              To mark a question for review (after answering it), click on{" "}
              <strong>“</strong>
              <strong>Mark for Review &amp; Next</strong>
              <strong>”</strong> button – the answered question which is also
              marked for review will be evaluated.
            </li>{" "}
            <li>
              To save the answer, click on the <strong>“</strong>
              <strong>Save &amp; Next</strong>
              <strong>” </strong>button - the answered question will be
              evaluated.
            </li>{" "}
          </ul>
        </div>

        <div className="w-full bg-white border-t border-t-neutral-500 px-6 pt-8 pb-20 sticky bottom-0">
          <div className="max-w-4xl mx-auto flex justify-between">
            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                });

                setIsIntruction({ next: true, previous: false });
              }}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-500 bg-neutral-100 hover:bg-neutral-200"
            >
              <ChevronLeft size={24} />
              Previous
            </button>
            <button
              onClick={handleTestStart}
              className="px-4 py-2 bg-blue-400 text-white rounded border border-blue-600"
            >
              I am Ready to Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

   
  if (state.isTestEnded ) {
     return <ScoreSummary questionData={qData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-800">
      {/* Header */}
      <div className="bg-gray-50 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 items-center">
              <img
                src="/logo/logo.png"
                alt="JEE Advanced Logo"
                className="h-12 w-auto"
              />
              <span className="text-lg font-semibold">CBT</span>
            </div>
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
            <div className="flex w-full gap-2">
              {qData &&
                ["physics", "chemistry", "mathematics"].map(
                  (subject, subIndex) => {
                    if (qData[subject]?.length > 0) {
                      return (
                        <div
                          key={subject}
                          className="flex flex-col relative gap-2"
                        >
                          <h2 className="font-bold capitalize">{subject}</h2>
                          <div className="flex flex-wrap">
                            {qData[subject].map((section, secIndex) => (
                              <div
                                key={`${secIndex}_${subIndex}`}
                                className={`px-4 w-fit py-2 border border-gray-400 cursor-pointer ${
                                  state.currentMainSection ===
                                    subject.charAt(0).toUpperCase() +
                                      subject.slice(1).toLowerCase() &&
                                  state.currentSubSection === section.name
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                }`}
                                onClick={() => {
                                  setState((p) => ({
                                    ...p,
                                    currentMainSection:
                                      subject.charAt(0).toUpperCase() +
                                      subject.slice(1).toLowerCase(),
                                    currentSubSection: section.name,
                                    currentQuestion: section.questions[0],
                                    currentSubSectionType: section.type,
                                  }));

                                  markQuestionVisitedInLocalStorage(
                                    subject,
                                    section.questions[0].id
                                  );
                                }}
                              >
                                <span className="font-semibold">
                                  {section.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      return null; // skip if no sections for this subject
                    }
                  }
                )}
            </div>
            {/* <div className="flex flex-col space-y-2">
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
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Question Display */}
          <div className="col-span-8 bg-gray-100 rounded-lg shadow-md p-6">
            {state.currentQuestion ? (
              <>
                <Question
                  question={state.currentQuestion}
                  selectedAnswer={
                    state.currAnswers?.[state.currentQuestion?.id] || null
                  }
                  type={state.currentSubSectionType}
                  onAnswer={(answer) =>
                    handleAnswer(state.currentQuestion.id, answer)
                  }
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
                      onClick={() => handleClear(state.currentQuestion.id)}
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
                      onClick={handleSaveAndNext}
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
          <div className="col-span-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="p-4 border-b font-semibold text-neutral-700">
              Question Navigation
            </h3>
            {/* <QuestionGrid
              questions={state.questions}
              currentMainSection={state.currentMainSection}
              currentSubSection={state.currentSubSection}
              totalQuestions={currentSectionQuestions.length}
              onQuestionSelect={(index) =>
                setState((prev) => ({ ...prev, currentQuestionIndex: index }))
              }
              currentQuestionIndex={state.currentQuestionIndex}
            /> */}
            <div className="flex flex-wrap gap-4 px-4 mt-2 mb-4">
              {qData &&
                qData[state.currentMainSection.toLowerCase()]?.[
                  parseInt(state.currentSubSection.replace(/\D/g, ""), 10) - 1
                ]?.questions?.map((ques, qIndex) => {
                  const g = getQuestionFromLocalStorage(
                    state.currentMainSection.toLowerCase(),
                    ques.id
                  );
                  return (
                    <div
                      onClick={() => {
                        setState((p) => ({
                          ...p,
                          currentQuestion: ques,
                        }));
                        markQuestionVisitedInLocalStorage(
                          state.currentMainSection.toLowerCase(),
                          ques.id
                        );
                      }}
                      className={`relative w-12 h-12 font-semibold text-lg flex justify-center items-center aspect-square rounded  border border-neutral-500 ${
                        state.currentQuestion.id === ques.id && "rounded-full"
                      } ${
                        g.status === "markForReview"
                          ? "bg-purple-700 text-white"
                          : g.answer && g.answer !== ""
                          ? "bg-green-500 text-white"
                          : g.isVisited
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      key={qIndex}
                    >
                      {qIndex + 1}
                      {g.status === "markForReview" && g.answer && (
                        <span className="w-4 h-4 rounded-full bg-green-500 top-7 right-0.5 absolute"></span>
                      )}
                    </div>
                  );
                })}
            </div>

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
