export function isAnswerCorrect(question, userAnswer, type) {
  const options = question.options || [];

  if (!userAnswer || userAnswer.length === 0) return false;

  if (type === "single-mcq") {
    const correctIdx = parseInt(question.correctAnswer);
    const correctId = options[correctIdx - 1]?.id;
    return userAnswer === correctId;
  }

  if (type === "multi-mcq") {
    const correctIdxs = question.correctAnswer
      .split(",")
      .map((i) => options[parseInt(i) - 1]?.id);
    const correctSet = new Set(correctIdxs);
    const userSet = new Set(userAnswer);
    const allCorrect =
      correctSet.size === userSet.size &&
      [...correctSet].every((id) => userSet.has(id));
    return allCorrect;
  }

  if (type === "integer") {
    return parseInt(userAnswer) === parseInt(question.correctAnswer);
  }

  if (type === "decimal") {
    const u = parseFloat(userAnswer);
    const c = parseFloat(question.correctAnswer);
    return (
      parseFloat(u.toFixed(2)) === parseFloat(c.toFixed(2)) ||
      (Number.isInteger(c) && u === c)
    );
  }

  return false;
}
