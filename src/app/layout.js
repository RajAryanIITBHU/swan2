import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import Login from "@/components/Login";
import { cookies } from "next/headers";

export default async function GlobalLayout({ children }) {
  const session = await auth();
    const theme = cookies().get("theme")?.value || "light";
  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""} id="HTML">
      <body className="bg-accent">
        {!session ? <Login /> : children}
        <Toaster />
      </body>
    </html>
  );
}
