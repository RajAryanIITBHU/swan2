import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/firebase";


export async function saveTestResultToFirestore({
  email,
  testId,
  batch,
  userAnswers,
  resultSummary,
  questionData,
}) {

    console.log("Saving result with params:", {
      email,
      testId,
      batch,
      userAnswers,
      resultSummary,
      questionData,
    });
  if (!email || !testId || !batch) {
    console.error("Missing required parameters (email, testId, or batch).");
    return;
  }

  try {
    // 🔍 Find user document by email
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.error("❌ No user found with email:", email);
      return;
    }

    const userDoc = snap.docs[0];
    const userRef = userDoc.ref;

    // 📄 Document ID: [BatchName]-[TestId]
    const testDocId = `${batch}-${testId}`;
    const testRef = doc(userRef, "tests", testDocId);

    const existingTest = await getDoc(testRef);
    const attempts = existingTest.exists() ? (existingTest.data()?.attemptsCount || 0) : 0;

    const resultPayload = {
      testId,
      batch,
      timestamp: new Date().toISOString(),
      attemptsCount: attempts + 1,
      userAnswers,
      resultSummary,
      questionStructure: questionData,
    };

    // ✅ Save result to Firestore
    await setDoc(testRef, resultPayload);
    console.log("✅ Result saved to Firestore at:", testDocId);

    // ✅ Store in localStorage
    localStorage.setItem("result", JSON.stringify(resultPayload));
    console.log("✅ Result saved in localStorage");

  } catch (error) {
    console.error("❌ Error saving result to Firestore:", error);
  }
}
