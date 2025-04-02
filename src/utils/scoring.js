export const calculateScore = (questions, responses) => {
  const initialScore = {
    total: 0,
    maxTotal: 192, // Total possible score: (18×3 + 18×4 + 18×3)
    sectionWise: {
      Physics: {
        total: 0,
        maxTotal: 64,
        sectionWise: {
          "Section 1": { score: 0, maxScore: 18 }, // 6 questions × 3 points
          "Section 2": { score: 0, maxScore: 24 }, // 6 questions × 4 points
          "Section 3": { score: 0, maxScore: 18 }, // 6 questions × 3 points
        },
      },
      Chemistry: {
        total: 0,
        maxTotal: 64,
        sectionWise: {
          "Section 1": { score: 0, maxScore: 18 },
          "Section 2": { score: 0, maxScore: 24 },
          "Section 3": { score: 0, maxScore: 18 },
        },
      },
      Mathematics: {
        total: 0,
        maxTotal: 64,
        sectionWise: {
          "Section 1": { score: 0, maxScore: 18 },
          "Section 2": { score: 0, maxScore: 24 },
          "Section 3": { score: 0, maxScore: 18 },
        },
      },
    },
  };

  questions.forEach((question) => {
    const response = responses[question.id];
    if (!response?.answered) return;

    let score = 0;

    switch (question.subSection) {
      case "Section 1": // Single correct MCQ
        if (response.selectedAnswer === question.correctAnswer) {
          score = 3;
        } else {
          score = -1;
        }
        break;

      case "Section 2": // Multiple correct MCQ
        const selectedAnswers = response.selectedAnswer;
        const correctAnswers = question.correctAnswer;

        // Check if any incorrect option is marked
        const hasIncorrect = selectedAnswers.some(
          (answer) => !correctAnswers.includes(answer)
        );
        if (hasIncorrect) {
          score = -2; // Penalty for marking any incorrect option
        } else {
          // Count correct answers marked
          const correctCount = selectedAnswers.filter((answer) =>
            correctAnswers.includes(answer)
          ).length;

          // Award points based on number of correct options marked
          if (correctCount === correctAnswers.length) {
            score = 4; // All correct options marked
          } else if (correctCount === 3) {
            score = 3; // Three correct options marked
          } else if (correctCount === 2) {
            score = 2; // Two correct options marked
          } else if (correctCount === 1) {
            score = 1; // One correct option marked
          }
          // 0 points if no correct options marked
        }
        break;

      case "Section 3": // Integer type
        if (response.selectedAnswer === question.correctAnswer) {
          score = 3;
        }
        // No negative marking for integer type questions
        break;
    }

    initialScore.sectionWise[question.mainSection].sectionWise[
      question.subSection
    ].score += score;
  });

  // Calculate totals for each section and overall
  Object.keys(initialScore.sectionWise).forEach((mainSection) => {
    const section = initialScore.sectionWise[mainSection];
    section.total = Object.values(section.sectionWise).reduce(
      (acc, subSection) => acc + subSection.score,
      0
    );
  });

  initialScore.total = Object.values(initialScore.sectionWise).reduce(
    (acc, section) => acc + section.total,
    0
  );

  return initialScore;
};
