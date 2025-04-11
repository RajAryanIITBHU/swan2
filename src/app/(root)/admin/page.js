"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Delete,
  DeleteIcon,
  ImagePlus,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import LatexText from "@/components/LatexText";

let initialData = {
  batchName: "",
  testName: "",
  startDate: "",
  endDate: "",
  attempts: 0,
  syllabus: {
    isSyllabus: false,
    mathematics: [""],
    physics: [""],
    chemistry: [""],
  },
  mathematics: [
    {
      id: null,
      name: "Section 1",
      subject: "mathematics",
      type: "single-mcq",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,

          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 2",
      subject: "mathematics",
      type: "multi-mcq",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 3",
      subject: "mathematics",
      type: "integer",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 4",
      subject: "mathematics",
      type: "decimal",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
  ],
  physics: [
    {
      id: null,
      name: "Section 1",
      subject: "physics",
      type: "single-mcq",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 2",
      subject: "physics",
      type: "multi-mcq",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 3",
      subject: "physics",
      type: "integer",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 4",
      subject: "physics",
      type: "decimal",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
  ],
  chemistry: [
    {
      id: null,
      name: "Section 1",
      subject: "chemistry",
      type: "single-mcq",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 2",
      subject: "chemistry",
      type: "multi-mcq",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,

          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 3",
      subject: "chemistry",
      type: "integer",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,

          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
    {
      id: null,
      name: "Section 4",
      subject: "chemistry",
      type: "decimal",
      marks: 4,
      negative: 1,
      questions: [
        {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        },
      ],
    },
  ],
};

export default function NewTestPage() {
  const [data, setData] = useState(initialData);
  const [batchName, setBatchName] = useState("");
  const [testName, setTestName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "single-mcq",
    content: "",
    imageUrl: "",
    imageUpload: null,
    options: [
      { text: "", imageUrl: "", imageUpload: null },
      { text: "", imageUrl: "", imageUpload: null },
      { text: "", imageUrl: "", imageUpload: null },
      { text: "", imageUrl: "", imageUpload: null },
    ],
    correctAnswer: "",
  });

  const generateUniqueId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuestion = (e, subject, sectionIndex) => {
    e.preventDefault();
    setData((prevData) => {
      const updatedSubjectSections = prevData[subject].map((section, i) => {
        if (i !== sectionIndex) return section;

        const updatedQuestions = section.questions.map((q) => {
          if (!q.added) {
            const questionId = "q-"+generateUniqueId();

            return {
              ...q,
              id: questionId,
              added: true,
              options: q.options.map((option, index) => ({
                ...option,
                id: `${questionId}_${index + 1}`,
              })),
            };
          }
          return q;
        });

        const currentQuestion = section.questions.find((q) => !q.added);
        if (!currentQuestion) return section;

        const hasValidContent =
          currentQuestion.content.trim() !== "" ||
          currentQuestion.imageUrl.trim() !== "";

        const optionsValid = section.type.includes("mcq")
          ? currentQuestion.options.every(
              (opt) => opt.text.trim() !== "" || opt.imageUrl.trim() !== ""
            )
          : true;

        const hasCorrectAnswer = currentQuestion.correctAnswer.trim() !== "";

        const isValid = hasValidContent && optionsValid && hasCorrectAnswer;

        if (!isValid) {
          toast.error(
            "Please fill in question content/image, all options (text/image), and correct answer."
          );
          return section;
        }

        const newQuestion = {
          added: false,
          content: "",
          imageUrl: "",
          imageUpload: null,
          options: [
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
            { text: "", imageUrl: "", imageUpload: null },
          ],
          correctAnswer: "",
        };

        return {
          ...section,
          questions: [...updatedQuestions, newQuestion],
        };
      });

      return {
        ...prevData,
        [subject]: updatedSubjectSections,
      };
    });
  };

  const handleImageUpload = (e, subject, index) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        [subject]: prev[subject].map((s, i) =>
          i === index
            ? {
                ...s,
                questions: s.questions.map((q, qIndex) =>
                  !q.added
                    ? {
                        ...q,
                        imageUpload: file,
                        imageUrl: URL.createObjectURL(file),
                      }
                    : q
                ),
              }
            : s
        ),
      }));
    }
  };

  const handleOptionImageUpload = (e, subject, index, optionIndex) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        [subject]: prev[subject].map((s, i) =>
          i === index
            ? {
                ...s,
                questions: s.questions.map((q, qIndex) =>
                  !q.added
                    ? {
                        ...q,
                        options: q.options.map((opt, optIndex) =>
                          optIndex === optionIndex
                            ? {
                                ...opt,
                                imageUpload: file,
                                imageUrl: URL.createObjectURL(file),
                              }
                            : opt
                        ),
                      }
                    : q
                ),
              }
            : s
        ),
      }));
    }
  };

  const handleSave = async () => {
    if (!data.batchName) {
      toast.error("Please enter a batch name");
      return;
    }
    if (!data.testName) {
      toast.error("Please enter a test name");
      return;
    }

    if (!data.startDate || !data.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (
      data.syllabus.isSyllabus &&
      data.syllabus.chemistry.length === 0 &&
      data.syllabus.mathematics.length === 0 &&
      data.syllabus.physics.length === 0
    ) {
      toast.error("Please add the syllabus");
      return;
    }

    if (
      data.mathematics.every(
        (section) => section.questions.filter((q) => q.added).length === 0
      ) &&
      data.chemistry.every(
        (section) => section.questions.filter((q) => q.added).length === 0
      ) &&
      data.physics.every(
        (section) => section.questions.filter((q) => q.added).length === 0
      )
    ) {
      toast.error("Please add the Questions");
      return;
    }

    const filterAndPrepareSections = (sections) =>
      sections
        .map((section) => {
          const filteredQuestions = section.questions.filter((q) => q.added);
          if (filteredQuestions.length === 0) return null;

          return {
            ...section,
            id: section.id ?? generateUniqueId(),
            questions: filteredQuestions,
          };
        })
        .filter(Boolean);
        const testId = `test-${generateUniqueId()}`
    const testData = {
      ...data,
      id:testId,
      createdAt: `${new Date()}`,
      mathematics: filterAndPrepareSections(data.mathematics),
      physics: filterAndPrepareSections(data.physics),
      chemistry: filterAndPrepareSections(data.chemistry),
    };


    try {
      const response = await fetch("/api/saveTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchName: data.batchName,testId, testData }),
      });

      if (!response.ok) {
        throw new Error("Failed to save test batch");
      }

      const { fileName } = await response.json();
      toast.success(`Test batch saved successfully as ${fileName}`);
      setData(initialData);
    } catch (error) {
      toast.error("Failed to save test batch");
    }
  };

  return (
    <section className="relative">
      <div className="container p-6 max-w-[860px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Test Batch</h1>

        <div className="grid gap-6">
          {/* BASIC INFO */}
          <Card className="p-6">
            <div className="grid gap-4">
              <div className="flex gap-6">
                <div className="flex-1 flex gap-2">
                  <Label htmlFor="batchName">Batch Name: </Label>
                  <Input
                    className={"flex-1"}
                    id="batchName"
                    placeholder="Enter batch name"
                    value={data.batchName}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        batchName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1 flex gap-2">
                  <Label htmlFor="testName">Test Name: </Label>
                  <Input
                    className={"flex-1"}
                    id="testName"
                    placeholder="Enter test name"
                    value={data.testName}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, testName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex justify-between gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    className={" w-fit"}
                    id="startDate"
                    type="datetime-local"
                    value={data.startDate}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    className={" w-fit"}
                    id="endDate"
                    type="datetime-local"
                    value={data.endDate}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <Label htmlFor="attempts">Max Attempts: </Label>
                  <Input
                    className={" w-fit"}
                    id="attempts"
                    type="number"
                    value={data.attempts}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, attempts: e.target.value }))
                    }
                    placeholder="Max Attempts"
                  />
                </div>
              </div>
            </div>
          </Card>
          {/* SYLLABUS */}
          <Card className={"p-6"}>
            <div className="grid gap-4">
              <div className="w-full flex justify-between">
                <h1>Syllabus</h1>
                <Switch
                  onCheckedChange={(e) => {
                    const elem = document.getElementById("SYLLABUS_ACCORDIAN");
                    if (e) {
                      elem.classList.remove("hidden");
                      setData((prev) => ({
                        ...prev,
                        syllabus: { ...prev.syllabus, isSyllabus: true },
                      }));
                    } else {
                      elem.classList.add("hidden");
                      setData((prev) => ({
                        ...prev,
                        syllabus: {
                          isSyllabus: false,
                          mathematics: [""],
                          physics: [""],
                          chemistry: [""],
                        },
                      }));
                    }
                  }}
                />
              </div>
              <Accordion
                type="multiple"
                collapsible="true"
                className={`hidden`}
                id="SYLLABUS_ACCORDIAN"
              >
                <AccordionItem value="mathematics">
                  <AccordionTrigger>Mathematics</AccordionTrigger>

                  <AccordionContent className={"space-y-3"}>
                    {data.syllabus.mathematics.map((topic, index) => (
                      <div
                        className="flex gap-2 items-center"
                        key={`mathematics_${index}`}
                      >
                        <span className="w-4">{index + 1}.</span>

                        <Input
                          className="text-sm"
                          value={topic}
                          placeholder="New Topic"
                          onChange={(e) => {
                            const newTopics = [...data.syllabus.mathematics];
                            newTopics[index] = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              syllabus: {
                                ...prev.syllabus,
                                mathematics: newTopics,
                              },
                            }));
                          }}
                        />

                        <Button
                          variant="outline"
                          className={
                            data.syllabus.mathematics.length > 1 ? "" : "hidden"
                          }
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              syllabus: {
                                ...prev.syllabus,
                                mathematics: prev.syllabus.mathematics.filter(
                                  (_, idx) => idx !== index
                                ),
                              },
                            }));
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      className={"ml-6 px-10"}
                      variant={"outline"}
                      size="sm"
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          syllabus: {
                            ...prev.syllabus,
                            mathematics: [...prev.syllabus.mathematics, ""],
                          },
                        }));
                      }}
                    >
                      Add Topic
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="physics">
                  <AccordionTrigger>Physics</AccordionTrigger>
                  <AccordionContent className={"space-y-3"}>
                    {data.syllabus.physics.map((topic, index) => (
                      <div
                        className="flex gap-2 items-center"
                        key={`physics_${index}`}
                      >
                        <span className="w-4">{index + 1}.</span>

                        <Input
                          className="text-sm"
                          value={topic}
                          placeholder="New Topic"
                          onChange={(e) => {
                            const newTopics = [...data.syllabus.physics];
                            newTopics[index] = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              syllabus: {
                                ...prev.syllabus,
                                physics: newTopics,
                              },
                            }));
                          }}
                        />

                        <Button
                          className={
                            data.syllabus.physics.length > 1 ? "" : "hidden"
                          }
                          variant="outline"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              syllabus: {
                                ...prev.syllabus,
                                physics: prev.syllabus.physics.filter(
                                  (_, idx) => idx !== index
                                ),
                              },
                            }));
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      className={"ml-6 px-10"}
                      variant={"outline"}
                      size="sm"
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          syllabus: {
                            ...prev.syllabus,
                            physics: [...prev.syllabus.physics, ""],
                          },
                        }));
                      }}
                    >
                      Add Topic
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="chemistry">
                  <AccordionTrigger>Chemistry</AccordionTrigger>
                  <AccordionContent className={"space-y-3"}>
                    {data.syllabus.chemistry.map((topic, index) => (
                      <div
                        className="flex gap-2 items-center"
                        key={`chemistry_${index}`}
                      >
                        <span className="w-4">{index + 1}.</span>

                        <Input
                          className="text-sm"
                          value={topic}
                          placeholder="New Topic"
                          onChange={(e) => {
                            const newTopics = [...data.syllabus.chemistry];
                            newTopics[index] = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              syllabus: {
                                ...prev.syllabus,
                                chemistry: newTopics,
                              },
                            }));
                          }}
                        />

                        <Button
                          className={
                            data.syllabus.chemistry.length > 1 ? "" : "hidden"
                          }
                          variant="outline"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              syllabus: {
                                ...prev.syllabus,
                                chemistry: prev.syllabus.chemistry.filter(
                                  (_, idx) => idx !== index
                                ),
                              },
                            }));
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      className={"ml-6 px-10"}
                      variant={"outline"}
                      size="sm"
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          syllabus: {
                            ...prev.syllabus,
                            chemistry: [...prev.syllabus.chemistry, ""],
                          },
                        }));
                      }}
                    >
                      Add Topic
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Card>

          <Tabs defaultValue="mathematics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
            </TabsList>

            {["mathematics", "physics", "chemistry"].map((subject) => (
              <TabsContent key={subject} value={subject}>
                <Card className="px-4 pt-4 pb-0">
                  <Tabs defaultValue="Section 1">
                    <div className="flex flex-col gap-4 mb-4 ">
                      <div className="flex justify-between items-center gap-6">
                        <h2 className="text-xl font-bold capitalize ">
                          {subject}
                        </h2>
                        {/* <Button onClick={() => addSection(subject)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button> */}
                        <TabsList className="grid w-fit grid-cols-4 gap-2">
                          {data[subject]?.map((section, index) => (
                            <TabsTrigger
                              className={"px-4 "}
                              value={section.name}
                              key={subject + "_" + section + "_" + index}
                            >
                              {section.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                      {data[subject]?.map((section, index) => (
                        <TabsContent
                          key={
                            subject + "_" + section + "_" + index + "_Content"
                          }
                          value={section.name}
                        >
                          <h1 className="font-semibold text-lg mb-4 mt-2">
                            {section.name}
                          </h1>
                          <div className="grid gap-4">
                            <div className="grid gap-4">
                              <div className="flex gap-2">
                                <Label>Section Type</Label>
                                <Select
                                  value={section.type}
                                  onValueChange={(value) =>
                                    setData((prev) => ({
                                      ...prev,
                                      [subject]: prev[subject].map((s, i) =>
                                        i === index ? { ...s, type: value } : s
                                      ),
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select question type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="single-mcq">
                                      Single Correct MCQ
                                    </SelectItem>
                                    <SelectItem value="multi-mcq">
                                      Multiple Correct MCQ
                                    </SelectItem>
                                    <SelectItem value="integer">
                                      Integer Type
                                    </SelectItem>
                                    <SelectItem value="decimal">
                                      Decimal Type
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Question Content</Label>
                                <Textarea
                                  value={
                                    section.questions.filter(
                                      (q, i) => !q.added
                                    )[0].content
                                  }
                                  onChange={(e) =>
                                    setData((prev) => ({
                                      ...prev,
                                      [subject]: prev[subject].map((s, i) =>
                                        i === index
                                          ? {
                                              ...s,
                                              questions: s.questions.map(
                                                (q, qIndex) =>
                                                  !q.added
                                                    ? {
                                                        ...q,
                                                        content: e.target.value,
                                                      }
                                                    : q
                                              ),
                                            }
                                          : s
                                      ),
                                    }))
                                  }
                                  placeholder="Type your question here..."
                                  className="min-h-[100px]"
                                />
                                
                              </div>

                              <div className="flex  gap-4">
                                <div className="col-span-2 flex gap-2 items-center flex-1">
                                  <Label>Question Image URL</Label>
                                  <div className="flex gap-2 flex-1">
                                    <Input
                                      value={
                                        section.questions.filter(
                                          (q, i) => !q.added
                                        )[0].imageUrl
                                      }
                                      onChange={(e) =>
                                        setData((prev) => ({
                                          ...prev,
                                          [subject]: prev[subject].map((s, i) =>
                                            i === index
                                              ? {
                                                  ...s,
                                                  questions: s.questions.map(
                                                    (q, qIndex) =>
                                                      !q.added
                                                        ? {
                                                            ...q,
                                                            imageUrl:
                                                              e.target.value,
                                                          }
                                                        : q
                                                  ),
                                                }
                                              : s
                                          ),
                                        }))
                                      }
                                      className={"w-full"}
                                      placeholder="Enter image URL"
                                    />
                                  </div>
                                </div>
                                <Separator orientation="vertical" />
                                <div className=" space-y-2">
                                  <div className="flex gap-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(e, subject, index)
                                      }
                                      className="hidden"
                                      id={`${subject}_${section}_imageupload`}
                                    />
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() =>
                                        document
                                          .getElementById(
                                            `${subject}_${section}_imageupload`
                                          )
                                          .click()
                                      }
                                    >
                                      <ImagePlus className="mr-2 h-4 w-4" />
                                      Choose Image
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {section.questions.filter((q, i) => !q.added)[0]
                                .imageUrl && (
                                <img
                                  src={
                                    section.questions.filter(
                                      (q, i) => !q.added
                                    )[0].imageUrl
                                  }
                                  alt={`Question`}
                                  className="mt-2 max-w-[180px] rounded"
                                />
                              )}
                              <Separator />
                              {section.type.includes("mcq") && (
                                <div className="grid gap-4">
                                  <Label>Options</Label>
                                  {section.questions
                                    .filter((q) => !q.added)[0]
                                    .options.map((option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        className="grid gap-4 p-4 border rounded-lg"
                                      >
                                        {/* Option Text Input */}
                                        <div className="flex gap-2">
                                          <Input
                                            value={option.text}
                                            onChange={(e) => {
                                              setData((prev) => ({
                                                ...prev,
                                                [subject]: prev[subject].map(
                                                  (s, i) =>
                                                    i === index
                                                      ? {
                                                          ...s,
                                                          questions:
                                                            s.questions.map(
                                                              (q, qIndex) =>
                                                                !q.added
                                                                  ? {
                                                                      ...q,
                                                                      options:
                                                                        q.options.map(
                                                                          (
                                                                            opt,
                                                                            optIndex
                                                                          ) =>
                                                                            optIndex ===
                                                                            optionIndex
                                                                              ? {
                                                                                  ...opt,
                                                                                  text: e
                                                                                    .target
                                                                                    .value,
                                                                                }
                                                                              : opt
                                                                        ),
                                                                    }
                                                                  : q
                                                            ),
                                                        }
                                                      : s
                                                ),
                                              }));
                                            }}
                                            placeholder={`Option ${
                                              optionIndex + 1
                                            }`}
                                          />
                                          {/* Delete Option Button */}

                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              if (
                                                section.questions.filter(
                                                  (q) => !q.added
                                                )[0].options.length > 4
                                              ) {
                                                setData((prev) => ({
                                                  ...prev,
                                                  [subject]: prev[subject].map(
                                                    (s, i) =>
                                                      i === index
                                                        ? {
                                                            ...s,
                                                            questions:
                                                              s.questions.map(
                                                                (q, qIndex) =>
                                                                  !q.added
                                                                    ? {
                                                                        ...q,
                                                                        options:
                                                                          q.options.filter(
                                                                            (
                                                                              _,
                                                                              optIndex
                                                                            ) =>
                                                                              optIndex !==
                                                                              optionIndex
                                                                          ),
                                                                      }
                                                                    : q
                                                              ),
                                                          }
                                                        : s
                                                  ),
                                                }));
                                              } else {
                                                toast.error(
                                                  "Can't Delete more options."
                                                );
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>

                                        {/* Image URL Input */}
                                        <div className="flex gap-4">
                                          <div className="flex flex-1 gap-2 flex-row">
                                            <Label>Option Image URL</Label>
                                            <div className="flex gap-2 flex-1">
                                              <Input
                                                className={"w-full"}
                                                value={option.imageUrl}
                                                onChange={(e) => {
                                                  setData((prev) => ({
                                                    ...prev,
                                                    [subject]: prev[
                                                      subject
                                                    ].map((s, i) =>
                                                      i === index
                                                        ? {
                                                            ...s,
                                                            questions:
                                                              s.questions.map(
                                                                (q, qIndex) =>
                                                                  !q.added
                                                                    ? {
                                                                        ...q,
                                                                        options:
                                                                          q.options.map(
                                                                            (
                                                                              opt,
                                                                              optIndex
                                                                            ) =>
                                                                              optIndex ===
                                                                              optionIndex
                                                                                ? {
                                                                                    ...opt,
                                                                                    imageUrl:
                                                                                      e
                                                                                        .target
                                                                                        .value,
                                                                                  }
                                                                                : opt
                                                                          ),
                                                                      }
                                                                    : q
                                                              ),
                                                          }
                                                        : s
                                                    ),
                                                  }));
                                                }}
                                                placeholder="Enter image URL"
                                              />
                                            </div>
                                          </div>
                                          <Separator orientation="vertical" />

                                          {/* Image Upload Button */}
                                          <div className="">
                                            <div className="flex gap-2">
                                              <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                  handleOptionImageUpload(
                                                    e,
                                                    subject,
                                                    index,
                                                    optionIndex
                                                  )
                                                }
                                                className="hidden"
                                                id={`optionImageUpload${optionIndex}`}
                                              />
                                              <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() =>
                                                  document
                                                    .getElementById(
                                                      `optionImageUpload${optionIndex}`
                                                    )
                                                    .click()
                                                }
                                              >
                                                <ImagePlus className="mr-2 h-4 w-4" />
                                                Choose Image
                                              </Button>
                                            </div>
                                          </div>
                                        </div>

                                        {option.imageUrl && (
                                          <img
                                            src={option.imageUrl}
                                            alt={`Option ${optionIndex + 1}`}
                                            className="mt-2 max-w-[180px] rounded"
                                          />
                                        )}
                                      </div>
                                    ))}

                                  {section.questions.filter((q) => !q.added)[0]
                                    .options.length < 6 && (
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setData((prev) => ({
                                          ...prev,
                                          [subject]: prev[subject].map((s, i) =>
                                            i === index
                                              ? {
                                                  ...s,
                                                  questions: s.questions.map(
                                                    (q, qIndex) =>
                                                      !q.added
                                                        ? {
                                                            ...q,
                                                            options: [
                                                              ...q.options,
                                                              {
                                                                text: "",
                                                                imageUrl: "",
                                                                imageUpload:
                                                                  null,
                                                              },
                                                            ],
                                                          }
                                                        : q
                                                  ),
                                                }
                                              : s
                                          ),
                                        }));
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add Option
                                    </Button>
                                  )}
                                </div>
                              )}

                              <Separator />

                              <div className="flex gap-4">
                                <Label>
                                  {section.type.includes("mcq")
                                    ? "Correct Option(s)"
                                    : "Correct Answer"}
                                </Label>

                                {section.type === "single-mcq" ? (
                                  <Select
                                    value={
                                      section.questions.filter(
                                        (q) => !q.added
                                      )[0]?.correctAnswer || ""
                                    }
                                    onValueChange={(value) => {
                                      setData((prev) => ({
                                        ...prev,
                                        [subject]: prev[subject].map((s, i) =>
                                          i === index
                                            ? {
                                                ...s,
                                                questions: s.questions.map(
                                                  (q, qIndex) =>
                                                    !q.added
                                                      ? {
                                                          ...q,
                                                          correctAnswer: value,
                                                        } // ✅ Update correctAnswer
                                                      : q
                                                ),
                                              }
                                            : s
                                        ),
                                      }));
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select correct option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {section.questions
                                        .filter((q) => !q.added)[0]
                                        ?.options.map((option, index) => (
                                          <SelectItem
                                            key={index}
                                            value={String(index)}
                                          >
                                            Option {index + 1}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    value={
                                      section.questions.filter(
                                        (q) => !q.added
                                      )[0]?.correctAnswer || ""
                                    }
                                    onChange={(e) => {
                                      setData((prev) => ({
                                        ...prev,
                                        [subject]: prev[subject].map((s, i) =>
                                          i === index
                                            ? {
                                                ...s,
                                                questions: s.questions.map(
                                                  (q, qIndex) =>
                                                    !q.added
                                                      ? {
                                                          ...q,
                                                          correctAnswer:
                                                            e.target.value,
                                                        } // ✅ Update correctAnswer for non-MCQ
                                                      : q
                                                ),
                                              }
                                            : s
                                        ),
                                      }));
                                    }}
                                    className={"flex-1"}
                                    placeholder={
                                      section.type === "multi-mcq"
                                        ? "Enter comma-separated option numbers"
                                        : "Enter the correct answer"
                                    }
                                  />
                                )}
                              </div>

                              <div className="flex gap-6">
                                <div className="flex gap-4">
                                  <Label>Marks</Label>
                                  <Input
                                    type="number"
                                    value={section.marks}
                                    onChange={(e) =>
                                      setData((prev) => ({
                                        ...prev,
                                        [subject]: prev[subject].map((s, i) =>
                                          i === index
                                            ? {
                                                ...s,
                                                marks: e.target.value,
                                              }
                                            : s
                                        ),
                                      }))
                                    }
                                    className={"w-fit"}
                                    min="1"
                                  />
                                </div>
                                <div className="flex gap-4">
                                  <Label>Negative</Label>
                                  <Input
                                    type="number"
                                    value={section.negative}
                                    onChange={(e) =>
                                      setData((prev) => ({
                                        ...prev,
                                        [subject]: prev[subject].map((s, i) =>
                                          i === index
                                            ? {
                                                ...s,
                                                negative: e.target.value,
                                              }
                                            : s
                                        ),
                                      }))
                                    }
                                    className={"w-fit"}
                                    min="0"
                                  />
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={(e) =>
                                addQuestion(e, subject, index, section)
                              }
                              className="mt-4"
                            >
                              Add Question
                            </Button>
                          </div>

                          {section.questions.filter((q) => q.added).length >
                            0 && (
                            <Accordion type="multiple" collapsible="true">
                              <AccordionItem
                                value="question"
                                className={"py-0"}
                              >
                                <AccordionTrigger className={"px-4 mt-4"}>
                                  Added Questions {" ( "}Total:{" "}
                                  {
                                    section.questions.filter((q) => q.added)
                                      .length
                                  }
                                  {" )"}
                                </AccordionTrigger>
                                <AccordionContent className={"px-4"}>
                                  <Accordion
                                    type="multiple"
                                    collapsible="true"
                                    className=""
                                  >
                                    {section.questions
                                      .filter((q) => q.added)
                                      .map((question, qindex) => (
                                        <AccordionItem
                                          value={`${question.content}_${qindex}`}
                                          key={
                                            subject +
                                            "_" +
                                            section.name +
                                            "_" +
                                            question.content +
                                            "_" +
                                            qindex
                                          }
                                          className="mt-4 p-4 border rounded-lg relative"
                                        >
                                          <AccordionTrigger className={"py-0"}>
                                            <h4 className="font-medium">
                                              Question {qindex + 1} ( +
                                              {section.marks} /{" "}
                                              {section.negative !== "0"
                                                ? "-" + section.negative
                                                : section.negative}{" "}
                                              )
                                            </h4>
                                          </AccordionTrigger>
                                          <AccordionContent
                                            className={"relative"}
                                          >
                                            <div className="flex gap-2">
                                              <div className="flex gap-2 flex-col flex-1">
                                                <p className="mt-2 flex-1">
                                                  {question.content}
                                                </p>
                                                {question.imageUrl && (
                                                  <div className="relative max-h-[180px] overflow-hidden max-w-[240px]">
                                                    <img
                                                      src={question.imageUrl}
                                                      alt="Question"
                                                      className="mt-2 rounded"
                                                    />
                                                  </div>
                                                )}
                                                {section.type.includes(
                                                  "mcq"
                                                ) ? (
                                                  <div className="mt-4 grid gap-1 relative">
                                                    {question.options.map(
                                                      (option, optIndex) => (
                                                        <div
                                                          key={optIndex}
                                                          className={`flex items-start gap-4 px-3 py-1.5 rounded-xl ${
                                                            question.correctAnswer
                                                              .split(",")
                                                              .includes(
                                                                `${
                                                                  optIndex + 1
                                                                }`
                                                              )
                                                              ? "bg-green-100"
                                                              : ""
                                                          }`}
                                                        >
                                                          <span>
                                                            {String.fromCharCode(
                                                              65 + optIndex
                                                            )}
                                                            .
                                                          </span>
                                                          <div>
                                                            <p className={``}>
                                                              {option.text}
                                                            </p>
                                                            {option.imageUrl && (
                                                              <img
                                                                src={
                                                                  option.imageUrl
                                                                }
                                                                alt={`Option ${
                                                                  optIndex + 1
                                                                }`}
                                                                className="mt-2 max-w-[180px] rounded"
                                                              />
                                                            )}
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="w-[calc(100%-1.75rem)] mr-4 bg-green-100 px-3 py-1 rounded-xl font-semibold">
                                                    Correct Answer:{" "}
                                                    {question.correctAnswer}
                                                  </div>
                                                )}{" "}
                                              </div>

                                              <div className="flex flex-col pt-4 gap-4">
                                                <Pencil
                                                  size={16}
                                                  className="hover:text-blue-700 cursor-pointer opacity-70"
                                                  onClick={() => {
                                                    setData((prev) => {
                                                      const updatedSections =
                                                        prev[subject].map(
                                                          (s, i) => {
                                                            if (i === index) {
                                                              // Step 1: Remove the temporary 'added: false' question
                                                              const filteredQuestions =
                                                                s.questions.filter(
                                                                  (q) => q.added
                                                                );

                                                              // Step 2: Pull the target question to edit (from previous list)
                                                              const questionToEdit =
                                                                {
                                                                  ...filteredQuestions[
                                                                    qindex
                                                                  ],
                                                                  added: false,
                                                                };

                                                              // Step 3: Remove the original version of that question (it was at qindex before filtering)
                                                              const updatedQuestions =
                                                                filteredQuestions.filter(
                                                                  (_, i) =>
                                                                    i !== qindex
                                                                );

                                                              // Step 4: Return updated section
                                                              return {
                                                                ...s,
                                                                questions: [
                                                                  ...updatedQuestions,
                                                                  questionToEdit,
                                                                ], // Add editable question at the end
                                                              };
                                                            }

                                                            return s;
                                                          }
                                                        );

                                                      return {
                                                        ...prev,
                                                        [subject]:
                                                          updatedSections,
                                                      };
                                                    });
                                                  }}
                                                />

                                                <Trash2
                                                  onClick={() => {
                                                    setData((prev) => {
                                                      const updatedSections =
                                                        prev[subject].map(
                                                          (s, i) => {
                                                            if (i === index) {
                                                              const updatedAdded =
                                                                s.questions
                                                                  .filter(
                                                                    (q) =>
                                                                      q.added
                                                                  )
                                                                  .filter(
                                                                    (_, i) =>
                                                                      i !==
                                                                      qindex
                                                                  ); // remove the clicked added question

                                                              const updatedNonAdded =
                                                                s.questions.filter(
                                                                  (q) =>
                                                                    !q.added
                                                                );

                                                              return {
                                                                ...s,
                                                                questions: [
                                                                  ...updatedAdded,
                                                                  ...updatedNonAdded,
                                                                ],
                                                              };
                                                            }
                                                            return s;
                                                          }
                                                        );

                                                      return {
                                                        ...prev,
                                                        [subject]:
                                                          updatedSections,
                                                      };
                                                    });
                                                  }}
                                                  size={16}
                                                  className="hover:text-red-700 cursor-pointer opacity-70"
                                                />
                                              </div>
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      ))}
                                  </Accordion>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="p-6">
            <Button className="w-full" onClick={handleSave}>
              Save Test Batch
            </Button>
          </Card>
        </div>
      </div>
      <div className="flex-1">
        
      </div>
    </section>
  );
}
``;
