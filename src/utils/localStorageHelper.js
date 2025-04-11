export function addUniqueQuestionToLocalStorage(subject, question) {
  if (typeof window === "undefined") return;

  try {
    // Get full storage or initialize from scratch
    let existing = JSON.parse(localStorage.getItem("data"));

    // Initialize 'data' and 'test' if they don't exist
    if (!existing || typeof existing !== "object") {
      existing = { test: {} };
    }
    if (!existing.test || typeof existing.test !== "object") {
      existing.test = {};
    }

    // Initialize subject array
    if (!Array.isArray(existing.test[subject])) {
      existing.test[subject] = [];
    }

    // Check for duplicate ID
    const isDuplicate = existing.test[subject].some(
      (q) => q.id === question.id
    );

    if (!isDuplicate) {
      existing.test[subject].push(question);
      localStorage.setItem("data", JSON.stringify(existing));
    } else {
      console.log(
        `❗ Question with id "${question.id}" already exists in "${subject}"`
      );
    }
  } catch (error) {
    console.error("❌ Failed to add question to localStorage:", error);
  }
}

export function updateAnswerInLocalStorage(subject, qid, newAnswer) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(localStorage.getItem("data"));
    if (!existing || !existing.test || !Array.isArray(existing.test[subject])) {
      console.warn(`⚠️ No questions found for subject: ${subject}`);
      return;
    }

    const subjectQuestions = existing.test[subject];
    const index = subjectQuestions.findIndex((q) => q.id === qid);

    if (index !== -1) {
      const isCleared =
        newAnswer === null ||
        newAnswer === "" ||
        (typeof newAnswer === "number" && isNaN(newAnswer));

      subjectQuestions[index].answer = isCleared ? "" : newAnswer;
      subjectQuestions[index].isVisited = true;
      subjectQuestions[index].status = isCleared ? "seen" : "answered";

      localStorage.setItem("data", JSON.stringify(existing));
    } else {
      console.warn(`⚠️ Question with id "${qid}" not found in "${subject}"`);
    }
  } catch (error) {
    console.error("❌ Failed to update answer in localStorage:", error);
  }
}

export function getQuestionFromLocalStorage(subject, qid) {
  if (typeof window === "undefined") return null;

  try {
    const existing = JSON.parse(localStorage.getItem("data"));
    if (!existing || !existing.test || !Array.isArray(existing.test[subject])) {
      console.warn(`⚠️ No questions found for subject: ${subject}`);
      return null;
    }

    const subjectQuestions = existing.test[subject];
    const question = subjectQuestions.find((q) => q.id === qid);

    if (!question) {
      console.warn(`⚠️ Question with id "${qid}" not found in "${subject}"`);
      return null;
    }

    return question;
  } catch (error) {
    console.error("❌ Failed to retrieve question from localStorage:", error);
    return null;
  }
}

export function initializeLocalStorageWithQuestionsBySections(subjectsData) {
  if (typeof window === "undefined") return;

  try {
    const formatted = {
      test: {},
    };

    for (const subject in subjectsData) {
      const sections = subjectsData[subject] || [];

      const allQuestions = sections.flatMap((section) =>
        (section.questions || []).map((q) => ({
          id: q.id,
          answer: null,
          isVisited: false,
          status: "unseen", // You can later update this to "seen", "answered", etc.
        }))
      );

      formatted.test[subject] = allQuestions;
    }

    localStorage.setItem("data", JSON.stringify(formatted));
  } catch (err) {
    console.error("❌ Failed to initialize localStorage:", err);
  }
}

export function clearAnswerInLocalStorage(subject, qid) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(localStorage.getItem("data"));
    if (!existing || !existing.test || !Array.isArray(existing.test[subject])) {
      console.warn(`⚠️ No questions found for subject: ${subject}`);
      return;
    }

    const subjectQuestions = existing.test[subject];
    const index = subjectQuestions.findIndex((q) => q.id === qid);

    if (index !== -1) {
      subjectQuestions[index].answer = null;
      // isVisited remains unchanged
      subjectQuestions[index].status = "seen"; // updated to 'seen' on clear

      localStorage.setItem("data", JSON.stringify(existing));
    } else {
      console.warn(`⚠️ Question with id "${qid}" not found in "${subject}"`);
    }
  } catch (error) {
    console.error("❌ Failed to clear answer in localStorage:", error);
  }
}
export function markQuestionVisitedInLocalStorage(subject, qid) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(localStorage.getItem("data"));
    if (!existing || !existing.test || !Array.isArray(existing.test[subject])) {
      console.warn(`⚠️ No questions found for subject: ${subject}`);
      return;
    }

    const subjectQuestions = existing.test[subject];
    const index = subjectQuestions.findIndex((q) => q.id === qid);

    if (index !== -1) {
      subjectQuestions[index].isVisited = true;

      // Optionally, update status to 'seen' if still 'unseen'
      if (subjectQuestions[index].status === "unseen") {
        subjectQuestions[index].status = "seen";
      }

      localStorage.setItem("data", JSON.stringify(existing));
    } else {
      console.warn(`⚠️ Question with id "${qid}" not found in "${subject}"`);
    }
  } catch (error) {
    console.error("❌ Failed to mark question as visited:", error);
  }
}

export function markForReviewInLocalStorage(subject, qid) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(localStorage.getItem("data"));
    if (!existing || !existing.test || !Array.isArray(existing.test[subject])) {
      console.warn(`⚠️ No questions found for subject: ${subject}`);
      return;
    }

    const subjectQuestions = existing.test[subject];
    const index = subjectQuestions.findIndex((q) => q.id === qid);

    if (index !== -1) {
      subjectQuestions[index].status = "markForReview";

      // Optionally mark as visited if it's not already
      if (!subjectQuestions[index].isVisited) {
        subjectQuestions[index].isVisited = true;
      }

      localStorage.setItem("data", JSON.stringify(existing));
    } else {
      console.warn(`⚠️ Question with id "${qid}" not found in "${subject}"`);
    }
  } catch (error) {
    console.error("❌ Failed to mark question for review:", error);
  }
}

export function unmarkReviewInLocalStorage(subject, qid) {
  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(localStorage.getItem("data"));
    if (!existing || !existing.test || !Array.isArray(existing.test[subject])) {
      console.warn(`⚠️ No questions found for subject: ${subject}`);
      return;
    }

    const subjectQuestions = existing.test[subject];
    const index = subjectQuestions.findIndex((q) => q.id === qid);

    if (index !== -1) {
      const hasAnswer =
        subjectQuestions[index].answer !== null &&
        subjectQuestions[index].answer !== "";

      subjectQuestions[index].status = hasAnswer ? "answered" : "seen";

      localStorage.setItem("data", JSON.stringify(existing));
    } else {
      console.warn(`⚠️ Question with id "${qid}" not found in "${subject}"`);
    }
  } catch (error) {
    console.error("❌ Failed to unmark question from review:", error);
  }
}

export const calculateScoreFromLocalStorage = (qData) => {
  const responseObj = JSON.parse(localStorage.getItem("data"))?.test;

  const scoreTemplate = {
    total: 0,
    sectionWise: {},
  };

  console.log(responseObj)

  const SUBJECTS = ["physics", "chemistry", "mathematics"];

  for (const subject of SUBJECTS) {
    const capitalizedSubject = capitalize(subject);
    const subjectSections = qData?.[subject] ?? [];

    if (!scoreTemplate.sectionWise[capitalizedSubject]) {
      scoreTemplate.sectionWise[capitalizedSubject] = {};
    }

    const userResponses = responseObj?.[subject] ?? [];

    for (const section of subjectSections) {
      const { type: sectionType, sectionName, questions } = section;

      if (!Array.isArray(questions)) continue;

      if (!scoreTemplate.sectionWise[capitalizedSubject][sectionName]) {
        scoreTemplate.sectionWise[capitalizedSubject][sectionName] = {
          score: 0,
          correct: 0,
          incorrect: 0,
          attempted: 0,
        };
      }

      const stats = scoreTemplate.sectionWise[capitalizedSubject][sectionName];

      for (const question of questions) {
        const userAnswerObj = userResponses.find((a) => a.id === question.id);
        if (!userAnswerObj) continue;

        stats.attempted += 1;

        let score = 0;
        let correct = false;

        if (sectionType === "single-mcq") {
          if (userAnswerObj.answer === question.correctAnswer) {
            score = 3;
            correct = true;
          } else {
            score = -1;
          }
        } else if (sectionType === "multi-mcq") {
          const selected = userAnswerObj.answer ?? [];
          const correctAns = question.correctAnswer ?? [];

          const hasIncorrect = selected.some(
            (opt) => !correctAns.includes(opt)
          );

          if (hasIncorrect) {
            score = -2;
          } else {
            const correctCount = selected.filter((opt) =>
              correctAns.includes(opt)
            ).length;

            if (correctCount === correctAns.length) score = 4;
            else if (correctCount === 3) score = 3;
            else if (correctCount === 2) score = 2;
            else if (correctCount === 1) score = 1;
          }

          correct = !hasIncorrect && selected.length === correctAns.length;
        } else if (sectionType === "integer" || sectionType === "decimal") {
          if (userAnswerObj.answer === question.correctAnswer) {
            score = 3;
            correct = true;
          }
        }

        stats.score += score;
        if (correct) stats.correct += 1;
        else stats.incorrect += 1;
      }
    }
  }

  // Total score across all subjects/sections
  scoreTemplate.total = Object.values(scoreTemplate.sectionWise).reduce(
    (acc, subject) =>
      acc + Object.values(subject).reduce((sum, sec) => sum + sec.score, 0),
    0
  );

  return scoreTemplate;
};

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}



