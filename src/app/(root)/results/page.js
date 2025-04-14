import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserTests } from "@/lib/fetch-user-tests";
import { getOverallStats } from "@/utils/getOverAllStats";
import { CircleCheck, CircleX, NotebookText, Pencil, Target } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 300 // cache for 5 minutes

function formatResultsByBatchAndTest(data) {
  const result = {};

  for (const item of data) {
    const key = `${item.batch}-${item.testId}`;
    result[key] = item.results.map((entry) => ({
      timestamp: entry.timestamp,
      data: entry.data,
    }));
  }

  return result;
}


const ResultPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-6">Please log in to view your results.</div>;
  }

  const testData = await getUserTests(session.user.id); // ✅ cached fetch
  console.log(testData)

  // let testData = [
  //   {
  //     id: "B0003-test-1744036118462-cagns28hi",
  //     attempts: 1,
  //     paperTotal:96,
  //     results: [
  //       {
  //         data: {
  //           mathematics: {
  //             "Section 4": {
  //               correct: 0,
  //               marks: 0,
  //               incorrect: 0,
  //               total: 2,
  //               attempted: 0,
  //             },
  //             "Section 2": {
  //               total: 2,
  //               correct: 0,
  //               incorrect: 0,
  //               marks: 0,
  //               attempted: 0,
  //             },
  //             "Section 3": {
  //               attempted: 0,
  //               marks: 0,
  //               incorrect: 0,
  //               total: 2,
  //               correct: 0,
  //             },
  //             "Section 1": {
  //               marks: 0,
  //               incorrect: 0,
  //               total: 2,
  //               correct: 0,
  //               attempted: 0,
  //             },
  //           },
  //           totalMarks: 13,
  //           physics: {
  //             "Section 3": {
  //               marks: 4,
  //               attempted: 2,
  //               incorrect: 1,
  //               correct: 1,
  //               total: 2,
  //             },
  //             "Section 2": {
  //               incorrect: 1,
  //               marks: 1,
  //               total: 2,
  //               correct: 1,
  //               attempted: 2,
  //             },
  //             "Section 1": {
  //               total: 2,
  //               incorrect: 0,
  //               correct: 2,
  //               marks: 8,
  //               attempted: 2,
  //             },
  //             "Section 4": {
  //               correct: 0,
  //               attempted: 0,
  //               marks: 0,
  //               incorrect: 0,
  //               total: 2,
  //             },
  //           },
  //           chemistry: {
  //             "Section 1": {
  //               incorrect: 2,
  //               attempted: 2,
  //               total: 2,
  //               correct: 0,
  //               marks: -2,
  //             },
  //             "Section 2": {
  //               marks: 2,
  //               total: 2,
  //               incorrect: 0,
  //               attempted: 2,
  //               correct: 2,
  //             },
  //             "Section 4": {
  //               total: 2,
  //               attempted: 0,
  //               marks: 0,
  //               correct: 0,
  //               incorrect: 0,
  //             },
  //             "Section 3": {
  //               correct: 0,
  //               incorrect: 0,
  //               marks: 0,
  //               attempted: 0,
  //               total: 2,
  //             },
  //           },
  //         },
  //         attempt: 1,
  //         timestamp: "2025-04-09T13:52:08.108Z",
  //       },
  //     ],
  //     testId: "test-1744036118462-cagns28hi",
  //     batch: "B0003",
  //     testName: "Real Test",
  //     userAnswers: [
  //       {
  //         data: {
  //           chemistry: [
  //             {
  //               isVisited: true,
  //               id: "q-1744035906637-1umemxjmy",
  //               answer: "q-1744035906637-1umemxjmy_2",
  //               status: "answered",
  //             },
  //             {
  //               id: "q-1744035931245-bebvybcni",
  //               status: "answered",
  //               isVisited: true,
  //               answer: "q-1744035931245-bebvybcni_2",
  //             },
  //             {
  //               answer: ["q-1744035982070-ozw3v1xoc_2"],
  //               isVisited: true,
  //               id: "q-1744035982070-ozw3v1xoc",
  //               status: "answered",
  //             },
  //             {
  //               id: "q-1744036043116-fylfr0k6s",
  //               answer: ["q-1744036043116-fylfr0k6s_3"],
  //               isVisited: true,
  //               status: "answered",
  //             },
  //             {
  //               status: "seen",
  //               answer: null,
  //               isVisited: true,
  //               id: "q-1744036061270-v3nt1rmh7",
  //             },
  //             {
  //               answer: null,
  //               status: "unseen",
  //               isVisited: false,
  //               id: "q-1744036078487-v9ux85d90",
  //             },
  //             {
  //               id: "q-1744035950505-1ih79eyhc",
  //               answer: null,
  //               status: "unseen",
  //               isVisited: false,
  //             },
  //             {
  //               answer: null,
  //               id: "q-1744036094987-8tqnjj09m",
  //               isVisited: false,
  //               status: "unseen",
  //             },
  //           ],
  //           mathematics: [
  //             {
  //               status: "unseen",
  //               id: "q-1744035457584-xmxiqedog",
  //               answer: null,
  //               isVisited: false,
  //             },
  //             {
  //               status: "unseen",
  //               isVisited: false,
  //               id: "q-1744035503405-y7tcq0sp0",
  //               answer: null,
  //             },
  //             {
  //               id: "q-1744035536437-v3523zwzi",
  //               answer: null,
  //               status: "unseen",
  //               isVisited: false,
  //             },
  //             {
  //               answer: null,
  //               isVisited: false,
  //               id: "q-1744035568381-7chlsu0wu",
  //               status: "unseen",
  //             },
  //             {
  //               isVisited: false,
  //               status: "unseen",
  //               answer: null,
  //               id: "q-1744035596643-wx979m12b",
  //             },
  //             {
  //               isVisited: false,
  //               status: "unseen",
  //               id: "q-1744035607384-8zrvyhity",
  //               answer: null,
  //             },
  //             {
  //               answer: null,
  //               status: "unseen",
  //               isVisited: false,
  //               id: "q-1744035860095-fmf8p88jd",
  //             },
  //             {
  //               isVisited: false,
  //               status: "unseen",
  //               answer: null,
  //               id: "q-1744035871035-c0fq81duj",
  //             },
  //           ],
  //           physics: [
  //             {
  //               id: "q-1744035673782-a6324qpmi",
  //               isVisited: true,
  //               answer: "q-1744035673782-a6324qpmi_2",
  //               status: "answered",
  //             },
  //             {
  //               answer: "q-1744035697296-7cl53hihy_2",
  //               status: "answered",
  //               isVisited: true,
  //               id: "q-1744035697296-7cl53hihy",
  //             },
  //             {
  //               isVisited: true,
  //               id: "q-1744035725421-1tqson1vw",
  //               answer: [
  //                 "q-1744035725421-1tqson1vw_3",
  //                 "q-1744035725421-1tqson1vw_2",
  //               ],
  //               status: "answered",
  //             },
  //             {
  //               id: "q-1744035754874-jedszbthp",
  //               answer: [
  //                 "q-1744035754874-jedszbthp_1",
  //                 "q-1744035754874-jedszbthp_3",
  //               ],
  //               status: "answered",
  //               isVisited: true,
  //             },
  //             {
  //               id: "q-1744035776017-zqvdwyh2t",
  //               isVisited: true,
  //               status: "answered",
  //               answer: "18",
  //             },
  //             {
  //               answer: "54",
  //               isVisited: true,
  //               status: "answered",
  //               id: "q-1744035788647-frptgdrmh",
  //             },
  //             {
  //               status: "seen",
  //               id: "q-1744035809686-8h6x2y6i0",
  //               answer: null,
  //               isVisited: true,
  //             },
  //             {
  //               isVisited: false,
  //               status: "unseen",
  //               answer: null,
  //               id: "q-1744035829566-j5vviqyob",
  //             },
  //           ],
  //         },
  //         attempt:1,
  //         timestamp: "2025-04-09T13:52:08.108Z",
  //       },
  //     ],
  //   },
  // ];

  const formatted = formatResultsByBatchAndTest(testData);


  const sortedTestData = testData.map((test) => ({
    ...test,
    results: test.results.sort((a, b) => b.timestamp - a.timestamp),
  }));
  

  return (
    <div className="p-6 space-y-6 min-h-[calc(100%-4rem)] max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold">Test Results</h2>
      <Separator />
      {sortedTestData.length > 0 ? sortedTestData.map((test) => (
        <div
          key={test.id}
          className="p-6 rounded-xl border shadow-md space-y-6 bg-card hover:shadow-lg transition-shadow duration-300"
        >
          {/* Test Header */}
          <div className="flex justify-between items-center text-lg font-semibold px-2">
            <div className="text-xl text-primary">{test.testName}</div>
            <div className="text-sm text-muted-foreground">
              📊 Total Attempts: {test.results.length}
            </div>
          </div>

          {/* Attempts List */}
          <div className="space-y-4">
            {test.results.map((attempt, index) => {
              const stats = getOverallStats(attempt.data);
              return (
                <Link
                  href={`/results/${test.id}-${attempt.attempt}`}
                  key={attempt.timestamp}
                  className="block p-4 border rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
                >
                  {/* Attempt Info */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-1">
                    <div className="font-medium text-base text-primary flex gap-4 items-center">
                      <span>Attempt #{index + 1}</span>
                      <Badge className={attempt.isRealAttempt ? "": "bg-neutral-300"}>
                        {attempt.isRealAttempt ? "Real" : "Not Real"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      🕒{" "}
                      {new Date(attempt.timestamp).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour12: true,
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex gap-8 justify-between">
                    <div className="grid grid-cols-2 md:grid-cols-4  gap-4 md:gap-2 md:pt-1 mt-3 text-sm flex-1">
                      <div className="flex items-center gap-2">
                        <CircleCheck size={16} /> <span>Correct:</span>{" "}
                        <span className="font-semibold text-green-600">
                          {stats.totalCorrect}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleX size={16} /> <span>Wrong:</span>{" "}
                        <span className="font-semibold text-red-600">
                          {stats.totalIncorrect}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pencil size={16} /> <span>Attempted:</span>{" "}
                        <span className="font-semibold text-blue-500">
                          {stats.totalAttempted}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-full md:col-span-1">
                        <NotebookText size={16} /> <span>Total Questions:</span>{" "}
                        <span className="font-semibold text-muted-foreground">
                          {stats.totalQuestions}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center md:items-end gap-2">
                      <Target size={16} className="md:mb-1" />{" "}
                      <span>Total Marks:</span>{" "}
                      <span className="font-semibold text-primary text-xl">
                        {stats.totalMarks} / {test.paperTotal}
                      </span>
                    </div>
                  </div>
                </Link>
              );})}
          </div>
        </div>
      )): <div>No result</div>}
    </div>
  );
};

export default ResultPage;
