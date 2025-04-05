import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import Link from "next/link";


export default async function AdminLayout({ children }) {
  const session = await auth()

  if (session?.user?.role !== "admin"){
    return (
      <section className="w-full h-screen flex flex-col justify-center items-center gap-6">
        {/* Rick Roll GIF + audio */}

        {/* Unauthorized Card */}
        <Card className="p-6 gap-4 -mt-16">
          <span className="flex gap-3 items-center text-lg font-medium">
            <CircleAlert size={22} />
            Unauthorized User
          </span>
          <div className="relative">
            <img
              src="https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
              alt="Rick Roll"
              className="rounded-lg shadow-lg w-[400px] h-auto"
            />
            <audio autoPlay loop>
              <source
                src="https://www.myinstants.com/media/sounds/rick-roll.mp3"
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          </div>

          <p>Sorry, you are not authorised to view this page.</p>
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
