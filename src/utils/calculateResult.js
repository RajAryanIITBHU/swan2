export function calculateResults(questionData, userAnswers) {
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

        const correctIndex = q.correctAnswer;
        const options = q.options || [];

        const correctIds = (
          type === "multi-mcq" ? correctIndex.split(",") : [correctIndex]
        )
          .map((idx) => options[parseInt(idx) - 1]?.id)
          .filter(Boolean);

        const correctSet = new Set(correctIds);

        if (userAnswer !== null && userAnswer !== undefined) {
          attempted++;

          if (type === "multi-mcq") {
            if (!Array.isArray(userAnswer) || userAnswer.length === 0) {
              // Unanswered case is already handled by attempted check
              continue;
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
              // Full correct
              correct++;
              sectionMarks += parseFloat(marks); // usually +4
            } else if (hasWrong) {
              // Any wrong option selected → -2
              incorrect++;
              sectionMarks -= parseFloat(negative);
            } else {
              // No wrongs, only some corrects
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
                // All other valid but insufficient corrects
                incorrect++;
                sectionMarks -= parseFloat(negative);
              }
            }
          } else {
            // single-mcq, integer, decimal
            const isCorrect = correctIds[0] === userAnswer;
            if (isCorrect) {
              correct++;
              sectionMarks += parseFloat(marks);
            } else {
              incorrect++;
              sectionMarks -= parseFloat(negative);
            }
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
