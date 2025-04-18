import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { getTestDataFromId } from "@/utils/getRawData";
import { auth } from "@/auth";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import UntilStartTimer from "@/components/UntilStartTimer";
import OpenBankingWindow from "@/components/SecurePopUp";
import StartTestBtn from "@/components/StartTestBtn";


const questionTypes = {
  "single-mcq": " Single Choice",
  "multi-mcq": " Multi Choice",
  "integer": " Integer Type",
  "decimal": " Decimal Type",
}

export async function generateMetadata({ params }) {
  const { id } =await params;
  const testData = await getTestDataFromId(id);
  return {
    title: testData?.name || "Test",
  };
}

export default async function TestDetailsPage({ params }) {
  const { id } =await params;
  const data = await getTestDataFromId(id);
  const session = await auth()

  const userGivenNoOfTests = session?.user?.tests?.[id] ? session?.user?.tests?.[id] : 0

  if (!data) return (
    <section className="w-full bg-accent relative min-h-[calc(100dvh-4rem)] flex justify-center items-center">
      <Card className="p-6 rounded-xl bg-background gap-4 min-w-sm -mt-10">
        <span className="flex gap-3 items-center text-lg font-medium">
          <CircleAlert size={22} />
          No Test Found
        </span>
        <p>The Test file has either be deleted or never esixted before.</p>
        <Link
          href={"/"}
          className="text-primary-foreground hover:text-primary-foreground/80 underline underline-offset-4"
        >
          Home
        </Link>
      </Card>
    </section>
  );

  if (!session?.user?.batches.includes(data.batch) && data.batch !=="FREE"){
    return (
      <section className="w-full bg-accent relative min-h-[calc(100dvh-4rem)] flex justify-center items-center">
        <Card className="p-6 rounded-xl bg-background gap-4 min-w-sm -mt-10">
          <span className="flex gap-3 items-center text-lg font-medium"><CircleAlert size={22}/>Unautherised User</span>
          <p>You are not allowed to give this test.</p>
          <Link href={"/"} className="text-primary-foreground hover:text-primary-foreground/80 underline underline-offset-4">Home</Link>
        </Card>
      </section>
    )
  }
  
  const testDetails = {
    name: "JEE Advanced 2025",
    duration: "3 Hours per Paper",
    format: "Computer-Based Test (CBT)",
    sections: [
      {
        name: "Mathematics",
        totalMarks: 120,
        questionTypes: ["MCQs", "Numerical", "Matrix"],
      },
      {
        name: "Physics",
        totalMarks: 120,
        questionTypes: ["MCQs", "Numerical", "Comprehension"],
      },
      {
        name: "Chemistry",
        totalMarks: 120,
        questionTypes: ["MCQs", "Numerical", "Match the Following"],
      },
    ],
    syllabus: {
      Mathematics: [
        "Calculus",
        "Algebra",
        "Coordinate Geometry",
        "Vector & 3D",
      ],
      Physics: [
        "Mechanics",
        "Electricity & Magnetism",
        "Modern Physics",
        "Thermodynamics",
      ],
      Chemistry: [
        "Physical Chemistry",
        "Organic Chemistry",
        "Inorganic Chemistry",
      ],
    },
  };
  return (
    <section className="w-full flex flex-col bg-accent relative min-h-[calc(100dvh-4rem)] items-center">
      <div className="max-w-4xl w-full h-full flex-1 p-6">
        {/* Test Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {data.raw.testName}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg space-y-1">
            <p>
              <strong>Duration:</strong> {data.duration}
            </p>
            <p>
              <strong>Format:</strong> {testDetails.format}
            </p>
            <p>
              <strong>Schedule:</strong> {data.date}
            </p>
          </CardContent>
        </Card>

        {/* Sections Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Test Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Question Types</TableHead>
                  <TableHead>Total Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.raw.mathematics.length > 0 && (
                  <TableRow key={"mathematics"}>
                    <TableCell>Mathematics</TableCell>

                    <TableCell>
                      {data.raw.mathematics.length > 1
                        ? [
                            data.raw.mathematics.map(
                              (sec) => questionTypes[sec.type]
                            ),
                          ].join(", ")
                        : questionTypes[data.raw.mathematics[0].type]}
                    </TableCell>
                    <TableCell className={"pl-4"}>
                      {data.raw.mathematics
                        .map(
                          (sec, sec_i) =>
                            parseInt(sec.marks) * sec.questions.length
                        )
                        .reduce((acc, curr) => acc + curr, 0)}
                    </TableCell>
                  </TableRow>
                )}

                {data.raw.physics.length > 0 && (
                  <TableRow key={"physics"}>
                    <TableCell>Physics</TableCell>

                    <TableCell>
                      {data.raw.physics.length > 1
                        ? [
                            data.raw.physics.map(
                              (sec) => questionTypes[sec.type]
                            ),
                          ].join(", ")
                        : questionTypes[data.raw.physics[0].type]}
                    </TableCell>
                    <TableCell className={"pl-4"}>
                      {data.raw.physics
                        .map(
                          (sec, sec_i) =>
                            parseInt(sec.marks) * sec.questions.length
                        )
                        .reduce((acc, curr) => acc + curr, 0)}
                    </TableCell>
                  </TableRow>
                )}

                {data.raw.chemistry.length > 0 && (
                  <TableRow key={"chemistry"}>
                    <TableCell>Chemistry</TableCell>

                    <TableCell>
                      {data.raw.chemistry.length > 1
                        ? [
                            data.raw.chemistry.map(
                              (sec) => questionTypes[sec.type]
                            ),
                          ].join(", ")
                        : questionTypes[data.raw.chemistry[0].type]}
                    </TableCell>
                    <TableCell className={"pl-4"}>
                      {data.raw.chemistry
                        .map(
                          (sec, sec_i) =>
                            parseInt(sec.marks) * sec.questions.length
                        )
                        .reduce((acc, curr) => acc + curr, 0)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell className={"font-medium"}>Total</TableCell>
                  <TableCell className={"pl-4"}>
                    {data.marks.split(" ")[0]}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {data.raw.syllabus.isSyllabus && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Syllabus</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                defaultValue={["mathematics", "physics", "chemistry"]}
              >
                {["mathematics", "physics", "chemistry"].map(
                  (subject, subindex) => {
                    if (
                      data.raw.syllabus[subject].length >= 1 &&
                      data.raw.syllabus[subject][0] !== ""
                    ) {
                      return (
                        <AccordionItem key={subindex} value={subject}>
                          <AccordionTrigger className={"text-lg"}>
                            {subject.charAt(0).toUpperCase() + subject.slice(1)}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-4">
                              {data.raw.syllabus[subject].map((topic, idx) => (
                                <li key={idx}>{topic}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    }
                  }
                )}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex mt-4 px-0 sticky bottom-0 left-0 justify-center w-full bg-sidebar py-4">
        <div className="max-w-4xl w-full flex justify-between px-10 gap-6 items-center ">
          <div className="">
            Attempts: {userGivenNoOfTests}/{data?.raw?.attempts}
          </div>
          <StartTestBtn
            id={id}
            startDate={data.startDate}
            endDate={data.endDate}
            maxAttempts={data?.raw?.attempts}
            userAttempts={userGivenNoOfTests}
            rawStartDate={data.raw.startDate}
          />
        </div>
      </div>
    </section>
  );
}
