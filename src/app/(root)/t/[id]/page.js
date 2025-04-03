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
import { Button } from "@/components/ui/button";

export default function TestDetailsPage({ params }) {
  const { id } = params;

  // Mock Test Data (Replace with API fetch)
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
    <section className="w-full bg-accent relative">
      <div className="max-w-4xl mx-auto p-6">
        {/* Test Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {testDetails.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p>
              <strong>Duration:</strong> {testDetails.duration}
            </p>
            <p>
              <strong>Format:</strong> {testDetails.format}
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
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Question Types</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testDetails.sections.map((section, index) => (
                  <TableRow key={index}>
                    <TableCell>{section.name}</TableCell>
                    <TableCell>{section.totalMarks}</TableCell>
                    <TableCell>{section.questionTypes.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Syllabus Accordion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Syllabus</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={Object.keys(testDetails.syllabus)}
            >
              {Object.entries(testDetails.syllabus).map(
                ([subject, topics], index) => (
                  <AccordionItem key={index} value={subject}>
                    <AccordionTrigger className={"text-lg"}>{subject}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {topics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className="flex mt-4 px-4 sticky bottom-0 left-0 justify-center w-full bg-white py-4">
        <div className="max-w-4xl w-full flex justify-end px-10">
          <Button className={"text-white cursor-pointer"}>Start Test</Button>
        </div>
      </div>
    </section>
  );
}
