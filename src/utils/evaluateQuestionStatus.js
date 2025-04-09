import { isAnswerCorrect } from "./isAnswerCorrect";

export function evaluateQuestionStatus(testData, userAttempt) {
  const subjects = ["physics", "chemistry", "mathematics"];
  const output = {};

  for (const subject of subjects) {
    const userAnswers = userAttempt.data?.[subject] || [];
    const questionMap = new Map(userAnswers.map((a) => [a.id, a]));
    const subjectSections = testData?.[subject] || [];

    output[subject] = subjectSections.map((section) => {
      const sectionQuestions = section.questions.map((q) => {
        const userEntry = questionMap.get(q.id);
        const userAnswer = userEntry?.answer;

        const correct = isAnswerCorrect(q, userAnswer, section.type);
        const status =
          userAnswer === null ||
          userAnswer === undefined ||
          userAnswer.length === 0
            ? "unattempted"
            : correct
            ? "correct"
            : "incorrect";

        return {
          id: q.id,
          status,
        };
      });

      return {
        name: section.name,
        questions: sectionQuestions,
      };
    });
  }

  return output;
}
