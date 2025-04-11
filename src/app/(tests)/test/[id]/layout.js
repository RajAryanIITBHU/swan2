import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default async function TestLayout({ children }) {
const session = await auth()

  

  return (
    <>
{/*      
      <Head>
        <script
          id="mathjax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
      </Head> */}
      <main className="flex-1">
        <SessionProvider>{children}</SessionProvider>
      </main>
      
    </>
  );
}
