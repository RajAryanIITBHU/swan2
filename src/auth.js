import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Roll No and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        phone: {
          label: "Phone",
          type: "text",
          placeholder: "Phone",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.phone) {
          throw new Error("EMAIL_PHONE_REQUIRED");
        }

        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", credentials.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            throw new Error("USER_NOT_FOUND");
          }

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          const isValidPassword = credentials.phone === userData.phone;
          if (!isValidPassword) {
            throw new Error("PHONE_MISMATCH");
          }

          return {
            id: userDoc.id,
            email: userData.email,
            phone: userData.phone,
            name: userData.name,
            dob: userData.DOB,
            batches: userData.batches,
            role: userData.role,
            rollNo: userData.rollNo,
          };
        } catch (error) {
          console.error("Auth error:", error.message);
          throw new Error(error.message || "AUTH_FAILED");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.name = user.name;
        token.dob = user.dob;
        token.batches = user.batches;
        token.role = user.role;
        token.rollNo = user.rollNo;

        const testDocRef = collection(db, "users", user.id, "tests");
        const testsSnapshot = await getDocs(testDocRef);
        const tests = {};

        testsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.testId && data.batch && Array.isArray(data.userAnswers)) {
            const key = `${data.batch}-${data.testId}`;
            tests[key] = data.attempts;
          }
        });

        token.tests = tests;
      }

      if (trigger === "update" && session?.tests) {
        token.tests = session.tests;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.name = token.name;
        session.user.dob = token.dob;
        session.user.batches = token.batches;
        session.user.role = token.role;
        session.user.rollNo = token.rollNo;
        session.user.tests = token.tests || {};
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.AUTH_SECRET,
});
