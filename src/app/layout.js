import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import Login from "@/components/Login";
import { cookies } from "next/headers";
import "katex/dist/katex.min.css";
import Head from "next/head";


export default async function GlobalLayout({ children }) {
  const session = await auth();
    const theme =await cookies().get("theme")?.value || "light";
  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""} id="HTML">
      {/* <Head>
        <script
          id="mathjax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
      </Head> */}
      <body className="bg-accent">
        {!session ? <Login /> : children}
        <Toaster />
      </body>
    </html>
  );
}
