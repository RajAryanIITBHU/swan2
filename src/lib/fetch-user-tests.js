// lib/fetch-user-tests.ts
"use server";

import { cache } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export const getUserTests = cache(async (userId) => {
  console.log(`⏳ Fetching test data from Firestore for user: ${userId}`); // 👈 Log here

  const testDocRef = collection(db, "users", userId, "tests");
  const testsSnapshot = await getDocs(testDocRef);

  return testsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});
