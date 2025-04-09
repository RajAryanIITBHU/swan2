import { getSession } from "next-auth/react";

export async function updateSessionTestResults({ batch, testId, responseObj }) {
  try {
    const session = await getSession();
    if (!session?.user) return;

    const key = `${batch}-${testId}`;
    const newAnswer = {
      data: responseObj,
      timestamp: new Date().toISOString(),
    };

    const updatedAnswers = [...(session.user.tests?.[key] || []), newAnswer];

    // await update({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     tests: {
    //       ...(session.user.tests || {}),
    //       [key]: updatedAnswers,
    //     },
    //   },
    // });

    console.log("✅ Session updated with userAnswers:", updatedAnswers);
  } catch (error) {
    console.error("❌ Failed to update session with userAnswers:", error);
  }
}
