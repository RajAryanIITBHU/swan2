import { SessionProvider } from "next-auth/react";

export default function TestLayout({ children }) {
  return <main className="flex-1">
    <SessionProvider>
      {children}
      </SessionProvider>
      </main>;
}
