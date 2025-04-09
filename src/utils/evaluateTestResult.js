export function evaluateTestResult(questionData, userAnswerData) {
  let total = 0;
  let attempted = 0;
  let correct = 0;
  let incorrect = 0;
  let totalMarks = 0;

  const subjects = ["physics", "chemistry", "mathematics"];

  for (const subject of subjects) {
    const subjectSections = questionData[subject] || [];
    const userAnswers = userAnswerData[subject] || [];

    const answerMap = new Map(userAnswers.map((ans) => [ans.id, ans]));

    for (const section of subjectSections) {
      const { questions, marks, negative, type } = section;

      for (const q of questions) {
        total++;

        const userEntry = answerMap.get(q.id);
        const userAnswer = userEntry?.answer;
        if (!userAnswer || userAnswer.length === 0) continue;

        attempted++;

        if (type === "single-mcq") {
          const correctIdx = parseInt(q.correctAnswer);
          const correctId = q.options[correctIdx - 1]?.id;
          if (userAnswer === correctId) {
            correct++;
            totalMarks += parseFloat(marks);
          } else {
            incorrect++;
            totalMarks -= parseFloat(negative);
          }
        } else if (type === "multi-mcq") {
          const correctIdxs = q.correctAnswer
            .split(",")
            .map((i) => q.options[parseInt(i) - 1]?.id);
          const correctSet = new Set(correctIdxs);
          const userSet = new Set(userAnswer);
          const wrongSelected = [...userSet].some((id) => !correctSet.has(id));
          const allCorrect =
            correctSet.size === userSet.size &&
            [...correctSet].every((id) => userSet.has(id));

          if (allCorrect) {
            correct++;
            totalMarks += parseFloat(marks);
          } else if (wrongSelected) {
            incorrect++;
            totalMarks -= parseFloat(negative);
          } else {
            // Partial marking
            const correctSelected = [...userSet].filter((ans) =>
              correctSet.has(ans)
            );
            const partialMarks = correctSelected.length;
            if (partialMarks > 0) {
              correct++;
              totalMarks += partialMarks; // or use a partial scoring rule
            } else {
              incorrect++;
              totalMarks -= parseFloat(negative);
            }
          }
        } else if (type === "integer") {
          const isCorrect = parseInt(userAnswer) === parseInt(q.correctAnswer);
          if (isCorrect) {
            correct++;
            totalMarks += parseFloat(marks);
          } else {
            incorrect++;
            totalMarks -= parseFloat(negative);
          }
        } else if (type === "decimal") {
          const userVal = parseFloat(userAnswer).toFixed(2);
          const correctVal = parseFloat(q.correctAnswer).toFixed(2);

          const rawCorrect = parseFloat(q.correctAnswer);
          const rawUser = parseFloat(userAnswer);
          const accepted =
            correctVal === userVal ||
            (rawCorrect === Math.floor(rawCorrect) && rawCorrect === rawUser);

          if (accepted) {
            correct++;
            totalMarks += parseFloat(marks);
          } else {
            incorrect++;
            totalMarks -= parseFloat(negative);
          }
        }
      }
    }
  }

  return {
    total,
    attempted,
    correct,
    incorrect,
    totalMarks: parseFloat(totalMarks.toFixed(2)),
  };
}
