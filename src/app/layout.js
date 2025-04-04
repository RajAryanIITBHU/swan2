import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import Login from "@/components/Login";

export default async function GlobalLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en" className="">
      <body className="bg-accent">
        {!session ? <Login /> : children}
        <Toaster />
      </body>
    </html>
  );
}
