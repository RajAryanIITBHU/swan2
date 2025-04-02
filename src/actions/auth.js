"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function handleLogin(formData) {
  const email = formData.get("email");
  const phone = formData.get("phone");

  if (!email || !phone) {
    return { error: "Both email and phone are required." };
  }

  const result = await signIn("credentials", {
    email,
    phone,
    redirect: false,
  });

  if (result?.error) {
    return { error: "Invalid email or phone number." };
  }

  // Redirect to dashboard on success
  redirect("/dashboard");
}
