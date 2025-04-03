import path from "path";
import { auth } from "@/auth";
import { getFilesFromSelectedFolders } from "@/utils/getAllFiles";
import { Award, Calendar, Clock, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const dataDir = path.join(process.cwd(), "src/data");
  const files = getFilesFromSelectedFolders(session?.user?.batches || []);
  console.log(files);

  return (
    <section className="h-[calc(100dvh-4rem)] bg-accent space-y-6 max-sm:px-4 max-sm:py-3 p-6">
      <div className=" w-full flex max-[500px]:flex-col max-sm:gap-2 gap-4 h-14 sm:h-16 md:h-20 lg:h-24">
        <div className="flex-1 bg-white rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
          <div className="rounded-xl bg-indigo-100 aspect-square h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-award h-4 w-4 md:h-6 md:w-6 text-indigo-600"
            >
              <circle cx="12" cy="8" r="6"></circle>
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="tracking-wide text-sm md:text-[0.8rem]">
              Total Tests
            </span>
            <span className="sm:text-[1.1rem] md:text-[1.4rem] font-bold">
              {files.length}
            </span>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
          <div className="rounded-xl bg-green-100 aspect-square h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-clock h-6 w-6 text-green-600"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="tracking-wide text-sm md:text-[0.8rem]">
              Upcoming Tests
            </span>
            <span className="sm:text-[1.1rem] md:text-[1.4rem] font-bold">
              8
            </span>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
          <div className="rounded-xl bg-purple-100 aspect-square h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-users h-6 w-6 text-purple-600"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="tracking-wide text-sm md:text-[0.8rem]">
              Total Students
            </span>
            <span className="sm:text-[1.1rem] md:text-[1.4rem] font-bold">
              175
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-12 flex gap-4">
        <form className="flex-1 h-full rounded-xl bg-white  flex gap-3 items-center px-3 focus-within:border-primary focus-within:border-2 border-2 border-transparent">
          <Search className="text-accent-foreground/70" size={18} />
          <input type="text" name="search" className={"h-full shadow-none border-none w-full rounded-xl outline-none focus:border-none "} placeholder="Search Test..." />
        </form>
        <div className=" h-full rounded-xl bg-white py-2 md:py-3">filter</div>
      </div>

      <div className="w-full bg-white rounded-xl">
        <h2 className="text-lg font-semibold py-4 mx-4 md:mx-6">Recent Tests</h2>
        <Separator/>
        <ul className="flex flex-col ">
          {files
          .map((file, index) => {
            return (
              <li
                key={index}
                className="flex px-4 md:px-6 py-3.5 hover:bg-accent border-b items-center"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <span>Test Name</span>
                  <div className="flex gap-6">
                    <span className="flex gap-1 text-sm font-light items-center text-accent-foreground  opacity-80">
                      <Clock size={14} className="opacity-70" />
                      120 mins
                    </span>
                    <span className="flex gap-1 text-sm font-light items-center text-accent-foreground  opacity-80">
                      <Award size={14} className="opacity-70" />
                      100 Marks
                    </span>
                    <span className="flex gap-1 text-sm font-light items-center text-accent-foreground opacity-80">
                      <Calendar size={14} className="opacity-70" />
                      20-04-2025 8:30PM
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button asChild className={"text-white cursor-pointer"}>
                    <Link href={"/t/yt"}>View Test</Link>
                  </Button>
                </div>
              </li>
            );
          })
          }
        </ul>
      </div>
    </section>
  );
}
