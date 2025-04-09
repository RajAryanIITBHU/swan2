export function getOverallStats(data) {
  const subjects = Object.keys(data).filter((key) => key !== "totalMarks");

  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalMarks = 0;
  let totalQuestions = 0;

  subjects.forEach((subject) => {
    const sections = data[subject];
    Object.values(sections).forEach((section) => {
      totalAttempted += section.attempted || 0;
      totalCorrect += section.correct || 0;
      totalIncorrect += section.incorrect || 0;
      totalMarks += section.marks || 0;
      totalQuestions += section.total || 0;
    });
  });

  return {
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalMarks,
    totalQuestions,
  };
}