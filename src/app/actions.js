// app/actions.ts
"use server";

import { cookies } from "next/headers";

export async function setTheme(theme) {
  cookies().set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 }); // 1 year
}
