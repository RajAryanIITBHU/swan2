import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import Link from "next/link";


export default async function AdminLayout({ children }) {
  const session = await auth()

  if (session?.user?.role === "admin"){
    return (
      <section className="w-full h-screen flex justify-center items-center">
        <Card className="p-6 gap-4 -mt-8">
          <span className="flex gap-3 items-center text-lg font-medium">
            <CircleAlert size={22} />
            Unautherised User
          </span>
          <p>Sorry, you are not authorised to this page</p>
          <Link
            href={"/"}
            className="text-primary-foreground hover:text-primary-foreground/80 underline underline-offset-6 cursor-pointer"
          >
            Home Page
          </Link>
        </Card>
      </section>
    );
  }
  return (
        <main>{children}</main>
  );
}
