import path from "path";
import { auth } from "@/auth";
import { getFilesFromSelectedFolders } from "@/utils/getAllFiles";
import { Award, Calendar, Clock, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecentTests from "@/components/RecentTests";

export default async function Home() {
  const session = await auth();
  const files = getFilesFromSelectedFolders([...session?.user?.batches, "FREE"] || []);

  return (
    <section className="space-y-6 max-sm:px-4 max-sm:py-3 p-6 pb-16 min-h-[calc(100dvh-4rem)]">
      <div className=" w-full flex max-[500px]:flex-col max-sm:gap-2 gap-4 h-14 sm:h-16 md:h-20 lg:h-24">
        <div className="flex-1 bg-background rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
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
        <div className="flex-1 bg-background rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
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
        <div className="flex-1 bg-background rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
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
        <form className="flex-1 h-full rounded-xl bg-background  flex gap-3 items-center px-3 focus-within:border-primary focus-within:border-2 border-2 border-transparent">
          <Search className="text-accent-foreground/70" size={18} />
          <input
            type="text"
            name="search"
            className={
              "h-full shadow-none border-none w-full rounded-xl outline-none focus:border-none "
            }
            placeholder="Search Test..."
          />
        </form>
        <div className=" h-full rounded-xl bg-background py-2 md:py-3">
          filter
        </div>
      </div>
      {files.length === 0 ? (
        <div className="w-full px-4 py-12 text-center text-foreground/70 font-lg rounded-xl bg-background overflow-hidden">No Available Tests Right Now</div>
      ) : (
        <RecentTests files={files} />
      )}
    </section>
  );
}
