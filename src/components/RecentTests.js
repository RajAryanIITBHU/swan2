import fs from "fs";
import path from "path";
import Link from "next/link";
import { Clock, Award, Calendar } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { format } from "date-fns";
import UntilStartTimer from "./UntilStartTimer";
import { Badge } from "@/components/ui/badge";


const RecentTests = async ({ files,query,filter }) => {
  const loaded = await Promise.all(
    files.map(async (file) => {
      const parts = file.replace(/\\/g, "/").split("/");
      const batch = parts.at(-2);
      const testName = parts.at(-1).replace(".json", "");

      try {
        const filePath = path.join(
          process.cwd(),
          "src/data",
          batch,
          `${testName}.json`
        );
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const durationMins = Math.round((end - start) / (1000 * 60));

        const allSubjects = ["mathematics", "physics", "chemistry"];
        const totalMarks = allSubjects.reduce((sum, subject) => {
          if (!Array.isArray(data[subject])) return sum;
          return (
            sum +
            data[subject].reduce((secSum, section) => {
              const count = section.questions?.length || 0;
              return secSum + count * section.marks;
            }, 0)
          );
        }, 0);

        return {
          batch,
          testName,
          url: `/t/${batch}-${testName}`,
          name: data.testName,
          duration: `${durationMins} mins`,
          marks: `${totalMarks} Marks`,
          date: format(start, "dd-MM-yyyy h:mmaaa"),
          startDate: data.startDate,
          endDate:data.endDate,
          start,
          end,
        };
      } catch (err) {
        console.error("Error loading test:", err);
        return null;
      }
    })
  );

  let testData = loaded.filter(Boolean);

  if (query) {
    testData = testData.filter((test) =>
      test.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (filter) {
    const now = new Date();

    testData = testData.filter((test) => {
      const start = new Date(test.startDate);
      const end = new Date(test.endDate);

      if (filter === "ongoing") {
        return now >= start && now <= end;
      }

      if (filter === "yet-to-start") {
        return now < start;
      }

      if (filter === "ended") {
        return now > end;
      }

      return true;
    });
  }

  testData.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  if (testData.length === 0 ){
    return (
      <div className="w-full px-4 py-12 text-center text-foreground/70 font-lg rounded-xl bg-background overflow-hidden">
        No Available Test
      </div>
    );
  }

  return (
    <div className="w-full bg-background rounded-xl">
      <h2 className="text-lg font-semibold py-4 mx-4 md:mx-6">Recent Tests</h2>
      <Separator />
      <ul className="flex flex-col">
        {testData.map((test, index) => (
          <li
            key={index}
            className="flex px-4 md:px-6 py-3.5 hover:bg-accent border-b items-center"
          >
            <div className="flex-1 flex flex-col gap-2">
              <span className="font-semibold">{test.name}</span>
              <div className="flex gap-6">
                <span className="flex gap-1 text-sm font-light items-center text-accent-foreground opacity-80">
                  <Clock size={14} className="opacity-70" />
                  {test.duration}
                </span>
                <span className="flex gap-1 text-sm font-light items-center text-accent-foreground opacity-80">
                  <Award size={14} className="opacity-70" />
                  {test.marks}
                </span>
                <span className="flex gap-1 text-sm font-light items-center text-accent-foreground opacity-80">
                  <Calendar size={14} className="opacity-70" />
                  {test.date}
                </span>
              </div>
            </div>
            <div className="flex gap-4 ">
              <div className="flex gap-1 text-sm font items-center text-accent-foreground opacity-80 justify-end">
                <UntilStartTimer
                  className={"test-xs px-2 py-1 font-medium rounded-lg"}
                  start={test.startDate}
                  end={test.endDate}
                />
              </div>
              <Button asChild className="text-white cursor-pointer">
                <Link href={test.url}>View Test</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTests;
