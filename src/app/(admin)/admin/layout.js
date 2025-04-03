import { auth } from "@/auth";
import Link from "next/link";


export default async function AdminLayout({ children }) {
  const session = await auth()

  if (session?.user?.role !== "admin"){
    return (
      <section className="w-full h-screen flex justify-center items-center">
        <div className="">
          <p>Sorry, you are not authorised to this page</p>
          <Link href={"/"} className="text-blue-600 hover:text-blue-800 cursor-pointer">Home Page</Link>
        </div>
      </section>
    );
  }
  return (
        <main>{children}</main>
  );
}
