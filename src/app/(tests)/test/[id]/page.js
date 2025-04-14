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
  CircleAlert,
  Keyboard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
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
import { calculateResults } from "@/utils/calculateResult";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase";
import { updateSessionTestResults } from "@/utils/updateSessionResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountHook";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UntilStartTimer from "@/components/UntilStartTimer";

const INITIAL_TIME = 10800;
const MAX_WARNINGS = 3;

export default function TestPage() {
  const { data: session, status, update } = useSession();
  const params = useParams();
  const router = useRouter();

  const [noTestAvailable, setNoTestAvalaible] = useState(false);
  const [acceptTnC, setAcceptTnC] = useState(false);
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
    isRealAttempt: false,
  });
  const [qData, setQDtata] = useState(null);

  const [score, setScore] = useState(null);
  const [result, setResult] = useState(null);

  const [beforeTime, setBeforeTime] = useState({
    time: 5 * 60 * 1000,
    isRunning: true,
  });

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

    if (name === "password") {
      const digits = value.replace(/\D/g, "");

      let formatted = "";

      if (digits.length <= 2) {
        formatted = digits;
      } else if (digits.length <= 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(
          4,
          8
        )}`;
      }

      if (digits.length === 2 || digits.length === 4) {
        formatted += "/";
      }

      setUserData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    setState((p) => ({
      ...p,
      isTestStarted: true,
      isRealAttempt: new Date(qData?.endDate) - new Date() > 0,
      timeRemaining:
        new Date(qData?.endDate) - new Date() <= 0
          ? parseInt(
              (new Date(qData?.endDate) - new Date(qData.startDate)) / 1000
            )
          : parseInt((new Date(qData?.endDate) - new Date()) / 1000),
    }));
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
      setNoTestAvalaible(true);
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

  useEffect(() => {
    if (!isInstruction.next || !isInstruction.previous) return;

    if(session?.user?.role === "admin") return

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
  }, [isInstruction, handleWarning,session]);

  const handleAnswer = (qid, answer) => {
    let ans = Array.isArray(answer) && answer.length == 0 ? null : answer;
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
    // if (!state.isTestEnded) {
    //   const confirmEnd = window.confirm(
    //     "Are you sure you want to submit the test?"
    //   );
    //   if (!confirmEnd) return;
    // }
    setState((prev) => ({ ...prev, isTestEnded: true }));
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    if (status !== "authenticated" || !session?.user?.email) return;

    const local = localStorage.getItem("data");
    if (!local) return;

    const responseObj = JSON.parse(local)?.test;
    if (!responseObj) return;

    const computed = calculateResults(qData, responseObj);
    setResult(computed);

    (async () => {
      const testId = qData.id;
      const batch = qData.batchName;
      const docId = `${batch}-${testId}`;
      const testDocRef = doc(db, "users", session.user.id, "tests", docId);
      let at = 1;

      try {
        const testSnap = await getDoc(testDocRef);

        let existingData = testSnap.exists() ? testSnap.data() : {};
        const previousUserAnswers = existingData.userAnswers || [];
        const previousResults = existingData.results || [];
        const attemptCount = (existingData.attempts || 0) + 1;
        at = attemptCount;

        const paperTotal =
          qData.physics
            .map((sec, sec_i) => parseInt(sec.marks) * sec.questions.length)
            .reduce((acc, curr) => acc + curr, 0) +
          qData.chemistry
            .map((sec, sec_i) => parseInt(sec.marks) * sec.questions.length)
            .reduce((acc, curr) => acc + curr, 0) +
          qData.mathematics
            .map((sec, sec_i) => parseInt(sec.marks) * sec.questions.length)
            .reduce((acc, curr) => acc + curr, 0);

        const testData = {
          testId,
          batch,
          testName: qData.testName,
          attempts: attemptCount,
          paperTotal: paperTotal,
          userAnswers: [
            ...previousUserAnswers,
            {
              attempt: attemptCount,
              data: responseObj,
              timestamp: new Date().toISOString(),
              isRealAttempt: state.isRealAttempt,
            },
          ],
          results: [
            ...previousResults,
            {
              attempt: attemptCount,
              data: computed,
              timestamp: new Date().toISOString(),
              isRealAttempt: state.isRealAttempt,
            },
          ],
        };

        await setDoc(testDocRef, testData);

        console.log(
          "✅ Test result and attempts saved under test doc (array-based)"
        );

        // const updatedAnswers = [
        //   ...(session?.user?.tests?.[docId] || []),
        //   {
        //     data: responseObj,
        //     timestamp: new Date().toISOString(),
        //   },
        // ];

        if (docId in session?.user?.tests) {
          update({
            tests: {
              ...(session?.user?.tests || {}),
              [docId]: session.user.tests[docId] + 1,
            },
          })
            .then((res) => console.log("✅ Session updated:", res))
            .catch((err) => console.error("❌ Update failed:", err));
        } else {
          update({
            tests: {
              ...(session?.user?.tests || {}),
              [docId]: 1,
            },
          })
            .then((res) => console.log("✅ Session initialized:", res))
            .catch((err) => console.error("❌ Init failed:", err));
        }

        localStorage.removeItem("data");

        router.push(`/results/${docId}-${at}`);
      } catch (error) {
        console.error("❌ Error saving result to Firestore:", error);
      }
    })();
  }, [state.isTestEnded, status, session, qData, calculateResults, setResult]);

  useEffect(() => {
    const data = localStorage.getItem("finalScore");
    if (data) {
      setScore(JSON.parse(data));
    }
  }, []);

  // useEffect(() => {

  //     const blockContextMenu = (e) => e.preventDefault();
  //     const blockKeyDown = (e) => {
  //       if (
  //         e.ctrlKey ||
  //         e.key === "F12" ||
  //         (e.metaKey && e.shiftKey) ||
  //         (e.ctrlKey && e.shiftKey)
  //       ) {
  //         e.preventDefault();
  //       }
  //     };

  //     document.addEventListener("contextmenu", blockContextMenu);
  //     document.addEventListener("keydown", blockKeyDown);

  //     document.documentElement.requestFullscreen?.().catch(console.warn);

  //     return () => {
  //       document.removeEventListener("contextmenu", blockContextMenu);
  //       document.removeEventListener("keydown", blockKeyDown);
  //     };

  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const { time, isRunning } = useCountdown(new Date() + 5 * 60 * 1000);

  useEffect(() => {
    console.log(time, isRunning);
  }, [time, isRunning]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.rollNo) {
      setUserData((prev) => ({
        ...prev,
        rollNo: `${session.user.rollNo}`,
      }));
    }
  }, [status, session?.user?.rollNo]);

  const handleSaveAndNext = () => {
    const currentSubject = state.currentMainSection.toLowerCase();
    const currentSections = qData?.[currentSubject] || [];
    const currentSectionIndex = currentSections.findIndex(
      (section) => section.name === state.currentSubSection
    );

    if (currentSectionIndex === -1) return;

    const currentSection = currentSections[currentSectionIndex];
    const currentQuestions = currentSection.questions || [];

    // The issue is likely here - we need to use the actual current index from state
    // state.currentQuestionIndex might not be accurate if we're directly clicking on questions
    // Let's find the index of the current question in the current section
    const currentQIndex = currentQuestions.findIndex(
      (q) => q.id === state.currentQuestion.id
    );

    const nextQuestionIndex = currentQIndex + 1;

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
            nextSubject.charAt(0).toUpperCase() + nextSubject.slice(1),
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

  const handlePrevious = () => {
    const currentSubject = state.currentMainSection.toLowerCase();
    const currentSections = qData?.[currentSubject] || [];
    const currentSectionIndex = currentSections.findIndex(
      (section) => section.name === state.currentSubSection
    );

    if (currentSectionIndex === -1) return;

    const currentSection = currentSections[currentSectionIndex];
    const currentQuestions = currentSection.questions || [];

    // Find the index of the current question in the current section
    const currentQIndex = currentQuestions.findIndex(
      (q) => q.id === state.currentQuestion.id
    );

    const prevQuestionIndex = currentQIndex - 1;

    // If previous question exists in the current section
    if (prevQuestionIndex >= 0) {
      const prevQuestion = currentQuestions[prevQuestionIndex];

      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prevQuestionIndex,
        currentQuestion: prevQuestion,
        currAnswer: state.currAnswers[prevQuestion.id] || null,
      }));

      markQuestionVisitedInLocalStorage(currentSubject, prevQuestion.id);
      return;
    }

    // If we're at the first question of the current section,
    // move to the last question of the previous section
    if (prevQuestionIndex < 0) {
      const prevSectionIndex = currentSectionIndex - 1;

      // If there's a previous section in the same subject
      if (prevSectionIndex >= 0) {
        const prevSection = currentSections[prevSectionIndex];
        const lastQuestionIndex = prevSection.questions.length - 1;
        const prevQuestion = prevSection.questions[lastQuestionIndex];

        setState((prev) => ({
          ...prev,
          currentSubSection: prevSection.name,
          currentSubSectionType: prevSection.type,
          currentQuestionIndex: lastQuestionIndex,
          currentQuestion: prevQuestion,
          currAnswer: state.currAnswers[prevQuestion.id] || null,
        }));

        markQuestionVisitedInLocalStorage(currentSubject, prevQuestion.id);
        return;
      }

      // If we're at the first section of the subject, go to the previous subject
      const subjectOrder = ["physics", "chemistry", "mathematics"];
      const currentSubjectIndex = subjectOrder.indexOf(currentSubject);

      // Look for the previous available subject
      for (let i = currentSubjectIndex - 1; i >= 0; i--) {
        const prevSubject = subjectOrder[i];
        if ((qData?.[prevSubject] || []).length > 0) {
          const prevSections = qData[prevSubject];
          const lastSectionIndex = prevSections.length - 1;
          const lastSection = prevSections[lastSectionIndex];
          const lastQuestionIndex = lastSection.questions.length - 1;
          const lastQuestion = lastSection.questions[lastQuestionIndex];

          setState((prev) => ({
            ...prev,
            currentMainSection:
              prevSubject.charAt(0).toUpperCase() + prevSubject.slice(1),
            currentSubSection: lastSection.name,
            currentSubSectionType: lastSection.type,
            currentQuestionIndex: lastQuestionIndex,
            currentQuestion: lastQuestion,
            currAnswer: state.currAnswers[lastQuestion.id] || null,
          }));

          markQuestionVisitedInLocalStorage(prevSubject, lastQuestion.id);
          return;
        }
      }
    }

    // If we've reached here, there's no previous question
    toast.info("You're at the beginning of the test!");
  };

  if (
    !session?.user?.batches.includes(params.id.split("-")[0]) &&
    params.id.split("-")[0] !== "FREE"
  ) {
    return (
      <section className="w-full bg-accent relative min-h-[calc(100dvh-4rem)] flex justify-center items-center">
        <Card className="p-6 rounded-xl bg-background gap-4 min-w-sm -mt-10">
          <span className="flex gap-3 items-center text-lg font-medium">
            <CircleAlert size={22} />
            Unautherised User
          </span>
          <p>You are not allowed to give this test.</p>
          <Link
            href={"/"}
            className="text-primary-foreground hover:text-primary-foreground/80 underline underline-offset-4"
          >
            Home
          </Link>
        </Card>
      </section>
    );
  }

  

  // !isInstruction.next && !isInstruction.previous
  if (!isInstruction.next && !isInstruction.previous) {
    if (status === "loading" || !qData || !session) {
      return (
        <div className="flex w-full h-screen items-center justify-center">
          <span>
            <LoaderCircle className="animate-spin" size={40} />
          </span>
        </div>
      );
    }
    const testId = qData.id;
    const batch = qData.batchName;
    const docId = `${batch}-${testId}`;
    
    if (parseInt(qData?.attempts) === session?.user?.tests[docId]) {
      return (
        <section className="w-full bg-accent relative min-h-[calc(100dvh-4rem)] flex justify-center items-center">
          <Card className="p-6 rounded-xl bg-background gap-4 min-w-sm -mt-10">
            <span className="flex gap-3 items-center text-lg font-medium">
              <CircleAlert size={22} />
              Max Attempts Reached
            </span>
            <p>You have reached your maximum attempts for this test.</p>
            <Link
              href={"/"}
              className="text-primary-foreground hover:text-primary-foreground/80 underline underline-offset-4"
            >
              Home
            </Link>
          </Card>
        </section>
      );
    }
     
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
              <div className="text-4xl mt-2">
                {session !== undefined ? session?.user?.name : ""}
              </div>
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
                {/* <div className="text-neutral-700 px-3 border-l border-l-neutral-300 hover:bg-neutral-200 h-full py-1.5">
                  <Keyboard size={28} />
                </div> */}
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
                  placeholder="Enter your DOB (DD/MM/YYYY)"
                  maxLength={10}
                />
                {/* <div className="text-neutral-700 px-3 border-l border-l-neutral-300 hover:bg-neutral-200 h-full py-1.5">
                  <Keyboard size={28} />
                </div> */}
              </div>
            </div>

            {errors.password !== "" && (
              <p className="border rounded border-red-500 bg-red-50 w-[calc(100%-3rem)] text-sm text-red-900 px-6 py-1.5 mx-6">
                Error: {errors?.password}
              </p>
            )}
            {errors.rollNo !== "" && (
              <p className="border rounded border-red-500 bg-red-50 w-[calc(100%-3rem)] text-sm text-red-900 px-6 py-1.5 mx-6">
                Error: {errors?.rollNo}
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

  if (noTestAvailable) {
    return (
      <section className="w-full bg-accent relative min-h-[calc(100dvh-4rem)] flex justify-center items-center">
        <Card className="p-6 rounded-xl bg-background gap-4 min-w-sm -mt-10">
          <span className="flex gap-3 items-center text-lg font-medium">
            <CircleAlert size={22} />
            No Test Available
          </span>
          <p>The Test does not exist or has been removed by the admin.</p>
          <Link
            href={"/"}
            className="text-primary-foreground hover:text-primary-foreground/80 underline underline-offset-4"
          >
            Home
          </Link>
        </Card>
      </section>
    );
  }

  // !isInstruction.previous && isInstruction.next
  if (!isInstruction.previous && isInstruction.next) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col text-gray-900">
        {/* Header */}
        <div className="w-full px-6 bg-cyan-500 text-lg font-bold text-white py-2">
          Instructions
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col gap-6 px-6 py-8 text-sm max-w-4xl mx-auto flex-1 overflow-y-auto">
          <h2 className="text-center font-semibold text-xl text-gray-800">
            Read the Instructions Carefully
          </h2>

          {/* General Instructions */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">General Instructions</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Total duration of the paper is 3 hours (180 minutes).</li>
              <li>
                The on-screen countdown timer will display the remaining time.
                When the timer reaches zero, the paper will end automatically—no
                input will be accepted after that.
              </li>
              <li>
                The “Submit” button will remain deactivated during the paper and
                will activate only after the timer reaches zero.
              </li>
              <li>
                The Question Palette on the right side of the screen shows the
                status of each question:
                <table className="table-auto border-collapse border border-gray-400 mt-4">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">
                        Symbol
                      </th>
                      <th className="border border-gray-400 px-4 py-2">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-4 py-2">
                        Not Visited
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        You have not visited the question yet.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-4 py-2">
                        Not Answered
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        You have not answered the question yet.
                      </td>
                    </tr>
                    {/* Add other rows similarly */}
                  </tbody>
                </table>
              </li>
            </ol>
          </section>

          {/* Navigation Instructions */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">
              Navigating Through Parts/Sections
            </h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                Parts (Physics, Chemistry, Mathematics) are displayed at the
                top.
              </li>
              <li>Click “Save & Next” to move to the next question.</li>
              {/* Add other navigation instructions */}
            </ol>
          </section>

          {/* Answering Instructions */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">Answering a Question</h3>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                Follow instructions for answering specific types of questions.
              </li>
              <li>To change an answer, click “Clear Response” first.</li>
              {/* Add other answering instructions */}
            </ul>
          </section>

          {/* Footer */}
          <div className="w-full bg-white border-t border-gray-300 px-6 pt-8 pb-20 sticky bottom-0">
            <div className="max-w-4xl mx-auto flex justify-end">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  setIsIntruction({ next: false, previous: true });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600"
              >
                Next
                {/* Replace ChevronRight with an appropriate icon */}
                <span>&gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // isInstruction.previous && !isInstruction.next
  if (isInstruction.previous && !isInstruction.next) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col text-neutral-900">
        <div className="w-full px-6 bg-cyan-200 text-lg font-bold text-neutral-600 tracking-wide py-1.5">
          Exam Instructions
        </div>

        <div className="w-full flex flex-col gap-6 px-6 py-8 text-sm max-w-4xl mx-auto flex-1 overflow-y-auto">
          {/* SECTION 1 */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">
              SECTION 1 (Maximum Marks: 12)
            </h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>This section contains FOUR (04) questions.</li>
              <li>
                Each question has FOUR options (A), (B), (C) and (D). ONLY ONE
                correct answer.
              </li>
              <li>
                Marking Scheme:
                <table className="border-collapse border border-gray-400 mt-4 w-full">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-4 py-2 font-semibold">
                        Full Marks
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        +3 for correct answer
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-4 py-2 font-semibold">
                        Zero Marks
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        0 if unanswered
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ol>
          </section>

          {/* SECTION 2 */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">
              SECTION 2 (Maximum Marks: 12)
            </h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>This section contains THREE (03) questions.</li>
              <li>
                Each question has FOUR options. ONE OR MORE correct answers.
              </li>
              <li>
                Marking Scheme:
                <table className="border-collapse border border-gray-400 mt-4 w-full">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">
                        Scenario
                      </th>
                      <th className="border border-gray-400 px-4 py-2">
                        Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>All correct options chosen</td>
                      <td>+4</td>
                    </tr>
                    <tr>
                      <td>3 correct out of 4 options</td>
                      <td>+3</td>
                    </tr>
                    <tr>
                      <td>2 correct options chosen</td>
                      <td>+2</td>
                    </tr>
                    <tr>
                      <td>1 correct option chosen</td>
                      <td>+1</td>
                    </tr>
                    <tr>
                      <td>Incorrect combination</td>
                      <td>-2</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ol>
          </section>

          {/* SECTION 3 */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">
              SECTION 3 (Maximum Marks: 24)
            </h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>This section contains SIX (06) questions.</li>
              <li>Non-negative integer answers only.</li>
              <li>
                Marking Scheme:
                <table className="border-collapse border border-gray-400 mt-4 w-full">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-4 py-2 font-semibold">
                        Full Marks
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        +4 for correct integer
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ol>
          </section>

          {/* SECTION 4 */}
          <section className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
            <h3 className="font-bold text-lg mb-4">
              SECTION 4 (Maximum Marks: 12)
            </h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Contains FOUR (04) Matching List Sets.</li>
              <li>
                Matching Structure:
                <table className="border-collapse border border-gray-400 mt-4 w-full">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">
                        List-I
                      </th>
                      <th className="border border-gray-400 px-4 py-2">
                        List-II
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>4 entries (P, Q, R, S)</td>
                      <td>5 entries (1-5)</td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li>
                Marking Scheme:
                <table className="border-collapse border border-gray-400 mt-4 w-full">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-4 py-2 font-semibold">
                        Full Marks
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        +3 for correct combination
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ol>
          </section>
        </div>

        <div className="w-full bg-white border-t border-gray-300 px-6 pt-8 pb-20 sticky bottom-0 flex flex-col gap-4">
          <div className="w-full max-w-4xl px-2 mx-auto flex gap-2 items-center">
            <Checkbox
              checked={acceptTnC}
              onCheckedChange={(value) => {
                setAcceptTnC(!!value);
              }}
              id="TnC_ACCEPT"
              className={"border border-blue-500 cursor-pointer"}
            />
            <span className="mt-0.5">
              I hereby accept the{" "}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"link"} className={"text-blue-600 !px-1"}>
                    Terms & Condition
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={"bg-gray-100 w-4xl"}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-4 text-sm text-neutral-800 leading-relaxed max-h-72 overflow-y-scroll">
                        <div>
                          <strong>
                            Amplify JEE CBT System – Terms & Conditions
                          </strong>
                        </div>

                        <div>
                          <strong>1. Access & Usage</strong>
                        </div>
                        <div>
                          Access to the CBT platform is granted upon successful
                          registration.
                        </div>
                        <div>
                          Each user is provided with a unique set of login
                          credentials.
                        </div>
                        <div>
                          Sharing of login credentials is strictly prohibited.
                        </div>
                        <div>
                          If any user is found sharing credentials or accessing
                          another’s account, their account may be permanently
                          suspended without refund.
                        </div>
                        <div>
                          Amplify JEE reserves the right to monitor usage and
                          take appropriate action in case of misuse.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>2. Free CBTs</strong>
                        </div>
                        <div>
                          Amplify JEE offers a limited number of free CBTs for
                          demo, trial, or promotional purposes.
                        </div>
                        <div>
                          These tests are provided “as-is,” with no guarantee of
                          continued availability or access.
                        </div>
                        <div>
                          Users may need to sign up with basic details to access
                          these tests.
                        </div>
                        <div>
                          Amplify JEE reserves the right to revoke, restrict, or
                          modify free test access at any time.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>3. Paid CBTs & Content</strong>
                        </div>
                        <div>
                          Paid test packages include access to advanced test
                          sets, handpicked questions, solutions, and detailed
                          analysis.
                        </div>
                        <div>
                          All content—test papers, solutions, mock questions—is
                          the intellectual property of Amplify JEE.
                        </div>
                        <div>
                          Users are not allowed to copy, redistribute, or
                          reproduce any content without written permission.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>4. Technical Requirements</strong>
                        </div>
                        <div>
                          The platform is optimized for modern browsers like
                          Chrome and requires a stable internet connection.
                        </div>
                        <div>
                          Amplify JEE is not responsible for technical issues
                          arising from device incompatibility, outdated
                          browsers, or poor connectivity.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>5. Fair Usage & Conduct</strong>
                        </div>
                        <div>
                          All users must maintain integrity during tests. Use of
                          unfair means is strictly prohibited.
                        </div>
                        <div>
                          Any suspicious activity during live or monitored tests
                          may result in disqualification or permanent ban from
                          the platform.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>6. Payment & Refund</strong>
                        </div>
                        <div>
                          All payments are non-refundable, unless a verified
                          technical failure occurs (subject to internal review).
                        </div>
                        <div>
                          Access to paid content may be revoked in case of
                          payment disputes, chargebacks, or violation of terms.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>7. Data & Privacy</strong>
                        </div>
                        <div>
                          Personal data like name, contact details, and test
                          performance is collected for educational and platform
                          improvement purposes.
                        </div>
                        <div>
                          Amplify JEE does not sell or share personal data with
                          third parties without explicit user consent.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>
                            8. School/Institute Access (if applicable)
                          </strong>
                        </div>
                        <div>
                          In case of CBTs provided through schools/coaching
                          institutes, student performance and usage data may be
                          shared with the institution’s faculty or admin for
                          academic tracking.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>9. Platform Updates</strong>
                        </div>
                        <div>
                          Amplify JEE reserves the right to update test formats,
                          features, or schedules as needed to improve the
                          platform.
                        </div>
                        <div>
                          Users will be notified in advance of any major updates
                          or changes.
                        </div>

                        <div>---</div>

                        <div>
                          <strong>10. Limitation of Liability</strong>
                        </div>
                        <div>
                          Amplify JEE is a learning platform and does not
                          guarantee any rank, admission, or academic result.
                        </div>
                        <div>
                          We aim to assist in exam preparation, but success
                          depends on the user’s effort and consistency.
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className={"text-neutral-800 hover:text-neutral-700"}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setAcceptTnC(true);
                      }}
                    >
                      Accept
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </span>
          </div>
          <div className="max-w-4xl w-full mx-auto flex justify-between">
            <button
              onClick={() => {
                window.scroll({ top: 0 });
                setIsIntruction({ next: true, previous: false });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-neutral-800 font-semibold rounded hover:bg-gray-200"
            >
              <ChevronLeft size={24} />
              Previous
            </button>

            <div className="">
              {qData &&
              beforeTime.isRunning &&
              new Date(qData.startDate) - new Date() > 0 ? (
                <UntilStartTimer
                  className={"!test-lg px-4 py-2 font-medium rounded bg-gray-100"}
                  start={qData.startDate}
                  end={qData.endDate}
                  textClassName={""}
                  tSec={0}
                  setReached={(e)=>setBeforeTime((t)=>({...t, isRunning:false}))}
                />
              ) : (
                <Button
                  onClick={handleTestStart}
                  disabled={!acceptTnC}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600"
                >
                  I am Ready to begin
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.isTestEnded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-xl font-medium">Loading Result ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-50 text-neutral-800 flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* <div className="flex gap-4 items-center">
              <img
                src="/logo/logo.png"
                alt="JEE Advanced Logo"
                className="h-12 w-auto"
              />
              <span className="text-lg font-semibold">CBT</span>
            </div> */}
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
                                    Section {secIndex + 1}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 pb-4 flex-1 flex flex-col">
        <div className="flex gap-8 relative min-h-full flex-1">
          {/* Question Display */}
          <div className="w-2/3  rounded-lg shadow-md p-6">
            {state.currentQuestion ? (
              <div className="flex flex-col gap-4">
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
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No questions available for this section
              </div>
            )}
          </div>

          {/* Question Grid */}
          <div className="w-1/3 rounded-lg min-h-full shadow-md relative flex flex-col">
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
          </div>
        </div>
        <div className="flex w-full sticky bottom-4 gap-8">
          <div className="mt-6 flex w-2/3 justify-between rounded-xl bg-neutral-50 p-4 shadow-lg  border border-neutral-200">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
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
              {/* <button
                      onClick={handleMarkForReview}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Mark for Review
                    </button> */}
              <button
                onClick={handleSaveAndNext}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save & Next
              </button>
            </div>
          </div>
          <div className="mt-6 flex w-1/3 justify-end rounded-xl bg-neutral-50 p-4 shadow-lg  border border-neutral-200">
            <button
              onClick={handleEndTest}
              className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
