"use client";

import { useState } from "react";

const { Mail, Phone } = require("lucide-react");
const { Card, CardHeader, CardTitle, CardContent } = require("./ui/card");
const { default: UntilStartTimer } = require("./UntilStartTimer");
const { Button } = require("./ui/button");
const { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } = require("./ui/table");
const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } = require("./ui/accordion");

export function TestDetailsClient({ data }) {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });
  const [isTestStarted, setIsTestStarted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: name === "email" ? validateEmail(value) : validatePhone(value),
    }));
  };

  const handleStartTest = async () => {
    const emailError = validateEmail(userCredentials.email);
    const phoneError = validatePhone(userCredentials.phone);

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }

    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }

    setIsTestStarted(true);
  };

  if (!isTestStarted) {
    return (
      <section className="w-full bg-accent relative min-h-[calc(100dvh-4rem)] flex justify-center items-center">
        <Card className="p-8 rounded-xl bg-background gap-4 max-w-md w-full">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl">{data.raw.testName}</CardTitle>
            <p className="text-lg mt-2">
              {data.duration} • {data.marks}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={userCredentials.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userCredentials.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="pt-4">
                <UntilStartTimer
                  className={
                    "text-xs px-2 py-1 font-medium rounded-lg mb-4 block text-center"
                  }
                  start={data.startDate}
                  end={data.endDate}
                />

                <Button
                  className={"w-full text-white cursor-pointer"}
                  onClick={handleStartTest}
                  disabled={!!(errors.email || errors.phone)}
                >
                  Start Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Your existing test details UI
  return (
    <section className="w-full bg-accent relative">
      <div className="max-w-4xl mx-auto p-6">
        {/* Test Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {data.raw.testName}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p>
              <strong>Duration:</strong> {data.duration}
            </p>
            <p>
              <strong>Format:</strong> Computer-Based Test (CBT)
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
                    {data.raw.mathematics.map(
                      (sec, sec_i) => parseInt(sec.marks) * sec.questions.length
                    )}
                  </TableCell>
                </TableRow>
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
                    {data.raw.physics.map(
                      (sec, sec_i) => parseInt(sec.marks) * sec.questions.length
                    )}
                  </TableCell>
                </TableRow>
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
                    {data.raw.chemistry.map(
                      (sec, sec_i) => parseInt(sec.marks) * sec.questions.length
                    )}
                  </TableCell>
                </TableRow>
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
                  (subject, subindex) => (
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
                  )
                )}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-sidebar py-4">
        <div className="max-w-4xl mx-auto flex justify-end px-10 gap-6 items-center">
          <Button
            className={"text-white cursor-pointer"}
            onClick={() => {
              // Implement your test start logic here
              console.log("Navigating to test");
              // You could use router.push to navigate to the actual test page
            }}
          >
            Continue to Test
          </Button>
        </div>
      </div>
    </section>
  );
}


