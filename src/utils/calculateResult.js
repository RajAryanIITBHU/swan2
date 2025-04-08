export function calculateResults(questionData, userAnswers) {
  const responseObj = JSON.parse(localStorage.getItem("data"))?.test;
  const result = {};

  for (const subject of ["physics", "mathematics", "chemistry"]) {
    const subjectSections = questionData[subject] || [];
    const userSubjectAnswers = userAnswers[subject] || [];

    const userAnswerMap = new Map(userSubjectAnswers.map((a) => [a.id, a]));
    result[subject] = {};

    for (const section of subjectSections) {
      const { name: sectionName, type, marks, negative, questions } = section;

      let sectionTotal = questions.length;
      let attempted = 0;
      let correct = 0;
      let incorrect = 0;
      let sectionMarks = 0;

      for (const q of questions) {
        const userEntry = userAnswerMap.get(q.id);
        const userAnswer = userEntry?.answer;
        const options = q.options || [];

        if (
          userAnswer === null ||
          userAnswer === undefined ||
          userAnswer === ""
        ) {
          continue; // not attempted
        }

        attempted++;

        if (type === "multi-mcq") {
          const correctIndex = q.correctAnswer;
          const correctIds = correctIndex
            .split(",")
            .map((idx) => options[parseInt(idx) - 1]?.id)
            .filter(Boolean);

          const correctSet = new Set(correctIds);

          if (!Array.isArray(userAnswer) || userAnswer.length === 0) {
            continue; // unanswered
          }

          const userSet = new Set(userAnswer);
          const hasWrong = [...userSet].some((ans) => !correctSet.has(ans));
          const correctSelected = [...userSet].filter((ans) =>
            correctSet.has(ans)
          );

          const totalCorrect = correctSet.size;
          const totalSelected = userSet.size;

          if (
            totalSelected === totalCorrect &&
            correctSelected.length === totalCorrect
          ) {
            correct++;
            sectionMarks += parseFloat(marks); // full marks
          } else if (hasWrong) {
            incorrect++;
            sectionMarks -= parseFloat(negative);
          } else {
            // Partial marking
            if (
              totalCorrect === 4 &&
              correctSelected.length === 3 &&
              totalSelected === 3
            ) {
              correct++;
              sectionMarks += 3;
            } else if (
              totalCorrect >= 3 &&
              correctSelected.length === 2 &&
              totalSelected === 2
            ) {
              correct++;
              sectionMarks += 2;
            } else if (
              totalCorrect >= 2 &&
              correctSelected.length === 1 &&
              totalSelected === 1
            ) {
              correct++;
              sectionMarks += 1;
            } else {
              incorrect++;
              sectionMarks -= parseFloat(negative);
            }
          }
        } else if (type === "single-mcq") {
          const correctIdx = parseInt(q.correctAnswer);
          const correctId = options[correctIdx - 1]?.id;
          const isCorrect = correctId === userAnswer;

          if (isCorrect) {
            correct++;
            sectionMarks += parseFloat(marks);
          } else {
            incorrect++;
            sectionMarks -= parseFloat(negative);
          }
        } else if (type === "integer") {
          const correctValue = parseInt(q.correctAnswer);
          const userValue = parseInt(userAnswer);

          if (userValue === correctValue) {
            correct++;
            sectionMarks += parseFloat(marks);
          } else {
            incorrect++;
            sectionMarks -= parseFloat(negative);
          }
        } else if (type === "decimal") {
          const correctValue = parseFloat(q.correctAnswer).toFixed(2);
          const userValue = parseFloat(userAnswer).toFixed(2);

          // Accept '18' as '18.00', but not '18' for '18.06'
          const correctRaw = parseFloat(q.correctAnswer);
          const userRaw = parseFloat(userAnswer);

          const isAcceptable =
            correctValue === userValue ||
            (correctRaw === Math.floor(correctRaw) && userRaw === correctRaw);

          if (isAcceptable) {
            correct++;
            sectionMarks += parseFloat(marks);
          } else {
            incorrect++;
            sectionMarks -= parseFloat(negative);
          }
        }
      }

      result[subject][sectionName] = {
        total: sectionTotal,
        attempted,
        correct,
        incorrect,
        marks: parseFloat(sectionMarks.toFixed(2)),
      };
    }
  }

  return result;
}
