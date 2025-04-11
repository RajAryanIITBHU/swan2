import { notFound } from "next/navigation";
import { evaluateQuestionStatus } from "@/utils/evaluateQuestionStatus"; 
import { Badge } from "@/components/ui/badge";
import { getTestDataFromId } from "@/utils/getRawData";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateResults } from "@/utils/calculateResult";
import { extractSubjectResults } from "@/utils/extractSubjectResult";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScoreSummary from "@/components/ScoreSummary";
import { capitalize } from "@/utils/localStorageHelper";



export default async function ResultDetailPage({ params }) {
    const {id} = await params
  const parts = id?.split("-") || [];
    const session = await auth()
  const batch = parts[0];
  const attemptId = parts[parts.length - 1];
  const testId = parts.slice(1, -1).join("-");


  if (!batch || !testId || !attemptId) return notFound();

  const testData =  await getTestDataFromId(`${batch}-${testId}`)
  const testDocRef = doc(db, "users", session?.user?.id, "tests", `${batch}-${testId}`);
  const testSnap = await getDoc(testDocRef);

  const testDataResult = testSnap.exists() ? testSnap.data() : {};
  const userData = testDataResult?.userAnswers?.find(
    (obj) => `${obj.attempt}` === attemptId
  );
  console.log(testDataResult?.userAnswers);
// const userData = {
//   timestamp: "2025-04-09T13:52:08.108Z",
//   data: {
//     physics: [
//       {
//         status: "answered",
//         answer: "q-1744035673782-a6324qpmi_2",
//         id: "q-1744035673782-a6324qpmi",
//         isVisited: true,
//       },
//       {
//         isVisited: true,
//         answer: "q-1744035697296-7cl53hihy_2",
//         id: "q-1744035697296-7cl53hihy",
//         status: "answered",
//       },
//       {
//         answer: ["q-1744035725421-1tqson1vw_3", "q-1744035725421-1tqson1vw_2"],
//         id: "q-1744035725421-1tqson1vw",
//         isVisited: true,
//         status: "answered",
//       },
//       {
//         answer: ["q-1744035754874-jedszbthp_1", "q-1744035754874-jedszbthp_3"],
//         id: "q-1744035754874-jedszbthp",
//         isVisited: true,
//         status: "answered",
//       },
//       {
//         id: "q-1744035776017-zqvdwyh2t",
//         isVisited: true,
//         status: "answered",
//         answer: "18",
//       },
//       {
//         id: "q-1744035788647-frptgdrmh",
//         isVisited: true,
//         status: "answered",
//         answer: "54",
//       },
//       {
//         id: "q-1744035809686-8h6x2y6i0",
//         status: "seen",
//         isVisited: true,
//         answer: null,
//       },
//       {
//         status: "unseen",
//         answer: null,
//         id: "q-1744035829566-j5vviqyob",
//         isVisited: false,
//       },
//     ],
//     chemistry: [
//       {
//         isVisited: true,
//         id: "q-1744035906637-1umemxjmy",
//         status: "answered",
//         answer: "q-1744035906637-1umemxjmy_2",
//       },
//       {
//         status: "answered",
//         answer: "q-1744035931245-bebvybcni_2",
//         id: "q-1744035931245-bebvybcni",
//         isVisited: true,
//       },
//       {
//         isVisited: true,
//         answer: ["q-1744035982070-ozw3v1xoc_2"],
//         id: "q-1744035982070-ozw3v1xoc",
//         status: "answered",
//       },
//       {
//         id: "q-1744036043116-fylfr0k6s",
//         isVisited: true,
//         status: "answered",
//         answer: ["q-1744036043116-fylfr0k6s_3"],
//       },
//       {
//         answer: null,
//         id: "q-1744036061270-v3nt1rmh7",
//         status: "seen",
//         isVisited: true,
//       },
//       {
//         id: "q-1744036078487-v9ux85d90",
//         answer: null,
//         isVisited: false,
//         status: "unseen",
//       },
//       {
//         id: "q-1744035950505-1ih79eyhc",
//         answer: null,
//         isVisited: false,
//         status: "unseen",
//       },
//       {
//         id: "q-1744036094987-8tqnjj09m",
//         isVisited: false,
//         answer: null,
//         status: "unseen",
//       },
//     ],
//     mathematics: [
//       {
//         id: "q-1744035457584-xmxiqedog",
//         status: "unseen",
//         answer: null,
//         isVisited: false,
//       },
//       {
//         status: "unseen",
//         isVisited: false,
//         answer: null,
//         id: "q-1744035503405-y7tcq0sp0",
//       },
//       {
//         status: "unseen",
//         id: "q-1744035536437-v3523zwzi",
//         answer: null,
//         isVisited: false,
//       },
//       {
//         isVisited: false,
//         status: "unseen",
//         id: "q-1744035568381-7chlsu0wu",
//         answer: null,
//       },
//       {
//         status: "unseen",
//         answer: null,
//         id: "q-1744035596643-wx979m12b",
//         isVisited: false,
//       },
//       {
//         isVisited: false,
//         answer: null,
//         status: "unseen",
//         id: "q-1744035607384-8zrvyhity",
//       },
//       {
//         id: "q-1744035860095-fmf8p88jd",
//         answer: null,
//         status: "unseen",
//         isVisited: false,
//       },
//       {
//         status: "unseen",
//         id: "q-1744035871035-c0fq81duj",
//         isVisited: false,
//         answer: null,
//       },
//     ],
//   },
//   attempt: "1",
// };

 
    const subjectSections = evaluateQuestionStatus(testData.raw, userData); 

    const fullResult = calculateResults(testData.raw, userData.data);
    const subjectResults = extractSubjectResults(fullResult);
    
    const totalMarks = Object.values(subjectResults).reduce(
      (sum, sub) => sum + (sub?.marks || 0),
      0
    );

  return (
    <>
      <div className="p-4 space-y-8 max-w-4xl mx-auto">
        <div className="flex gap-4">
          <Link
            href={"/results"}
            className="w-9 h-9 text-center flex justify-between items-center rounded border"
          >
            <ArrowLeft size={20} className="mx-auto" />
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight">
            Test Overview:{" "}
            <span className="text-primary">
              {testData.name} - Attempt: {attemptId}
            </span>
          </h2>
        </div>

        <ScoreSummary result={fullResult} />

        <Accordion type="multiple" className="w-full space-y-2">
          {Object.entries(subjectSections).map(([subject, sections]) => {
            // Aggregate stats per subject
            const stats = sections.reduce(
              (acc, section) => {
                for (const q of section.questions) {
                  if (q.status === "correct") acc.correct += 1;
                  else if (q.status === "incorrect") acc.incorrect += 1;
                  if (q.status !== "unseen") acc.attempted += 1;
                  acc.total += 1;
                }
                return acc;
              },
              { correct: 0, incorrect: 0, attempted: 0, total: 0 }
            );

            return (
              <AccordionItem
                key={subject}
                value={subject}
                className="rounded-xl border bg-card text-card-foreground shadow-sm"
              >
                <AccordionTrigger className="p-4 ">
                  <div className="flex justify-between  w-full pr-8">
                    <h3 className="text-base font-semibold capitalize">
                      {subject}
                    </h3>
                    <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                      <span>✅ Correct: {stats.correct}</span>
                      <span>❌ Incorrect: {stats.incorrect}</span>
                      <span>
                        ✏️ Attempted: {stats.correct + stats.incorrect}
                      </span>
                      <span>📋 Total: {stats.total}</span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-4 space-y-6">
                  {sections.map((section, idx) => (
                    <div key={section.name + idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          Section {idx + 1}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {section.questions.length} Questions
                        </span>
                      </div>

                      <ScrollArea className="w-full overflow-auto rounded-md border border-muted p-2">
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                          {section.questions.map((q, i) => (
                            <Badge
                              key={q.id}
                              title={`${capitalize(q.status)}`}
                              className={`w-10 h-10 flex items-center justify-center text-base font-medium rounded-md transition-colors cursor-default select-none ${
                                q.status === "correct"
                                  ? "bg-green-100 text-green-800"
                                  : q.status === "incorrect"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {i + 1}
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </>
  );
}
