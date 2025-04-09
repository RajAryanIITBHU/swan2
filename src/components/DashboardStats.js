import { Award, Clock } from "lucide-react";

export default function DashboardStats({ totalTests, upcomingTests }) {
  return (
    <div className=" w-full flex max-[500px]:flex-col max-sm:gap-2 gap-4 h-14 sm:h-16 md:h-20 lg:h-24">
      <div className="flex-1 bg-background rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
        <div className="rounded-xl bg-indigo-100 aspect-square h-full flex items-center justify-center">
          <Award className="text-indigo-600 h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="tracking-wide text-sm md:text-[0.8rem]">
            Total Tests
          </span>
          <span className="sm:text-[1.1rem] md:text-[1.4rem] font-bold">
            {totalTests}
          </span>
        </div>
      </div>
      <div className="flex-1 bg-background rounded-xl flex gap-2 md:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-5 ">
        <div className="rounded-xl bg-green-100 aspect-square h-full flex items-center justify-center">
          <Clock className="text-green-600 h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="tracking-wide text-sm md:text-[0.8rem]">
            Upcoming Tests
          </span>
          <span className="sm:text-[1.1rem] md:text-[1.4rem] font-bold">
            {upcomingTests}
          </span>
        </div>
      </div>
    </div>
  );
}
