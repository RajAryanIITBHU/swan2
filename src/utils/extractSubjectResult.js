export function extractSubjectResults(fullResult) {
  const { totalMarks, ...subjects } = fullResult;

  const result = {};

  for (const subject of Object.keys(subjects)) {
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let marks = 0;

    for (const sec of Object.values(subjects[subject])) {
      attempted += sec.attempted;
      correct += sec.correct;
      incorrect += sec.incorrect;
      marks += sec.marks;
    }

    result[subject] = {
      attempted,
      correct,
      incorrect,
      marks: parseFloat(marks.toFixed(2)),
    };
  }

  return result;
}
