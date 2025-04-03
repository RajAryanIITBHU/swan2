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
import { Delete, DeleteIcon, ImagePlus, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export default function NewTestPage() {
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
    marks: 4,
  });

  const addSection = (subject) => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      subject,
      type:"single-mcq",
      questions: [],
    };
    setSections([...sections, newSection]);
    setCurrentSection(newSection);
  };

  const addQuestion = () => {
    if (!currentSection) return;

    const newQuestion = {
      id: Date.now(),
      sectionId: currentSection.id,
      ...currentQuestion,
    };

    setQuestions([...questions, newQuestion]);

    // Also add the question to the section
    const updatedSections = sections.map((section) => {
      if (section.id === currentSection.id) {
        return {
          ...section,
          questions: [...section.questions, newQuestion],
        };
      }
      return section;
    });
    setSections(updatedSections);

    const emptyQuestionTemp = {
      "single-mcq": {
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
        marks: 4,
      },
      "multi-mcq": {
        type: "multi-mcq",
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
        marks: 4,
      },
      integer: {
        type: "integer",
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
        marks: 4,
      },
      "decimal": {
        type: "decimal",
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
        marks: 4,
      },
    };

    setCurrentQuestion({
      type: currentQuestion.type,
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
      marks: 4,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentQuestion({
        ...currentQuestion,
        imageUpload: file,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleOptionImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = {
        ...newOptions[index],
        imageUpload: file,
        imageUrl: URL.createObjectURL(file),
      };
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      });
    }
  };

  const handleSave = async () => {
    if (!batchName) {
      toast.error("Please enter a batch name");
      return;
    }

    if (!startDate || !endDate) {
        toast.error("Please select both start and end dates");
     
      return;
    }

    if (sections.length === 0) {
        toast.error("Please add at least one section");
      return;
    }

    const testData = {
      batchName,
      startDate,
      endDate,
      sections: sections.map((section) => ({
        ...section,
        questions: questions.filter((q) => q.sectionId === section.id),
      })),
    };

    try {
      const response = await fetch("/api/saveTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchName, testData }),
      });

      if (!response.ok) {
        throw new Error("Failed to save test batch");
      }

      const { fileName } = await response.json();

      toast.success(`Test batch saved successfully as ${fileName}`);

      setBatchName("");
      setStartDate("");
      setEndDate("");
      setSections([]);
      setQuestions([]);
      setCurrentSection(null);
    } catch (error) {
      toast.error("Failed to save test batch");
    }
  };

  useEffect(()=>{
    console.log("sections: ", sections)
  },[sections])
  useEffect(()=>{
    console.log("questions: ", questions)
  },[questions])
  useEffect(()=>{
    console.log("currentSection: ", currentSection)
  },[currentSection])
  useEffect(()=>{
    console.log("currentQuestion: ", currentQuestion)
  },[currentQuestion])


  return (
    <div className="container mx-auto p-6 max-w-[860px]">
      <h1 className="text-3xl font-bold mb-6">Create New Test Batch</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="batchName">Batch Name</Label>
              <Input
                id="batchName"
                placeholder="Enter batch name"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                placeholder="Enter batch name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
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
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4 ">
                  <h2 className="text-2xl font-semibold capitalize">
                    {subject}
                  </h2>
                  <Button onClick={() => addSection(subject)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
                <Accordion type="single" collapsible className="">
                  {sections
                    .filter((section) => section.subject === subject)
                    .map((section) => (
                      <AccordionItem
                        value={section.name}
                        key={section.id}
                        className="mt-6 border rounded-lg px-4 py-2"
                      >
                        <AccordionTrigger>
                          <h3 className="text-xl font-medium">
                            {section.name}
                          </h3>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Separator className={"mb-4"} />
                          <div className="grid gap-4">
                            <div className="grid gap-4">
                              <div className="flex gap-2">
                                <Label>Question Type</Label>
                                <Select
                                  value={currentQuestion.type}
                                  onValueChange={(value) =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      type: value,
                                    })
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
                                  value={currentQuestion.content}
                                  onChange={(e) =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      content: e.target.value,
                                    })
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
                                      value={currentQuestion.imageUrl}
                                      onChange={(e) =>
                                        setCurrentQuestion({
                                          ...currentQuestion,
                                          imageUrl: e.target.value,
                                        })
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
                                      onChange={handleImageUpload}
                                      className="hidden"
                                      id="imageUpload"
                                    />
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() =>
                                        document
                                          .getElementById("imageUpload")
                                          .click()
                                      }
                                    >
                                      <ImagePlus className="mr-2 h-4 w-4" />
                                      Choose Image
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {currentQuestion.type.includes("mcq") && (
                                <div className="grid gap-4">
                                  <Label>Options</Label>
                                  {currentQuestion.options.map(
                                    (option, index) => (
                                      <div
                                        key={index}
                                        className="grid gap-4 p-4 border rounded-lg"
                                      >
                                        <div className="flex gap-2">
                                          <Input
                                            value={option.text}
                                            onChange={(e) => {
                                              const newOptions = [
                                                ...currentQuestion.options,
                                              ];
                                              newOptions[index] = {
                                                ...newOptions[index],
                                                text: e.target.value,
                                              };
                                              setCurrentQuestion({
                                                ...currentQuestion,
                                                options: newOptions,
                                              });
                                            }}
                                            placeholder={`Option ${index + 1}`}
                                          />
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                              const newOptions =
                                                currentQuestion.options.filter(
                                                  (_, i) => i !== index
                                                );
                                              setCurrentQuestion({
                                                ...currentQuestion,
                                                options: newOptions,
                                              });
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <div className="flex gap-4">
                                          <div className="flex flex-1 gap-2 flex-row">
                                            <Label>Option Image URL</Label>
                                            <div className="flex gap-2 flex-1">
                                              <Input
                                                className={"w-full"}
                                                value={option.imageUrl}
                                                onChange={(e) => {
                                                  const newOptions = [
                                                    ...currentQuestion.options,
                                                  ];
                                                  newOptions[index] = {
                                                    ...newOptions[index],
                                                    imageUrl: e.target.value,
                                                  };
                                                  setCurrentQuestion({
                                                    ...currentQuestion,
                                                    options: newOptions,
                                                  });
                                                }}
                                                placeholder="Enter image URL"
                                              />
                                              {/* <Button variant="outline" size="icon">
                                          <LinkIcon className="h-4 w-4" />
                                        </Button> */}
                                            </div>
                                          </div>
                                          <Separator orientation="vertical" />

                                          <div className="">
                                            <div className="flex gap-2">
                                              <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                  handleOptionImageUpload(
                                                    e,
                                                    index
                                                  )
                                                }
                                                className="hidden"
                                                id={`optionImageUpload${index}`}
                                              />
                                              <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() =>
                                                  document
                                                    .getElementById(
                                                      `optionImageUpload${index}`
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
                                            alt={`Option ${index + 1}`}
                                            className="mt-2 max-w-xs rounded"
                                          />
                                        )}
                                      </div>
                                    )
                                  )}
                                  {currentQuestion.options.length < 6 && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setCurrentQuestion({
                                          ...currentQuestion,
                                          options: [
                                            ...currentQuestion.options,
                                            {
                                              text: "",
                                              imageUrl: "",
                                              imageUpload: null,
                                            },
                                          ],
                                        })
                                      }
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
                                  {currentQuestion.type.includes("mcq")
                                    ? "Correct Option(s)"
                                    : "Correct Answer"}
                                </Label>
                                {currentQuestion.type === "single-mcq" ? (
                                  <Select
                                    value={currentQuestion.correctAnswer}
                                    onValueChange={(value) =>
                                      setCurrentQuestion({
                                        ...currentQuestion,
                                        correctAnswer: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select correct option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentQuestion.options.map(
                                        (option, index) => (
                                          <SelectItem
                                            key={index}
                                            value={String(index)}
                                          >
                                            Option {index + 1}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    value={currentQuestion.correctAnswer}
                                    onChange={(e) =>
                                      setCurrentQuestion({
                                        ...currentQuestion,
                                        correctAnswer: e.target.value,
                                      })
                                    }
                                    className={"flex-1"}
                                    placeholder={
                                      currentQuestion.type === "multi-mcq"
                                        ? "Enter comma-separated option numbers"
                                        : "Enter the correct answer"
                                    }
                                  />
                                )}
                              </div>

                              <div className="flex gap-4">
                                <Label>Marks</Label>
                                <Input
                                  type="number"
                                  value={currentQuestion.marks}
                                  onChange={(e) =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      marks: parseInt(e.target.value),
                                    })
                                  }
                                  className={"w-fit"}
                                  min="1"
                                />
                              </div>
                            </div>

                            <Button onClick={addQuestion} className="mt-4">
                              Add Question
                            </Button>
                          </div>
                          <div className="">
                            {questions
                              .filter((q) => q.sectionId === section.id)
                              .map((question, index) => (
                                <div
                                  key={question.id}
                                  className="mt-4 p-4 border rounded-lg relative"
                                >
                                  <div className="absolute top-4 right-4 h-fit">
                                    <Trash2 size={16} className="hover:text-red-700 cursor-pointer"/>
                                  </div>
                                  <h4 className="font-medium">
                                    Question {index + 1} ({question.type})
                                  </h4>
                                  <p className="mt-2">{question.content}</p>
                                  {question.imageUrl && (
                                    <img
                                      src={question.imageUrl}
                                      alt="Question"
                                      className="mt-2 max-w-md rounded"
                                    />
                                  )}
                                  {question.type.includes("mcq") && (
                                    <div className="mt-4 grid gap-4 relative">
                                      {question.options.map(
                                        (option, optIndex) => (
                                          <div
                                            key={optIndex}
                                            className="flex items-start gap-4"
                                          >
                                            <span>
                                              {String.fromCharCode(
                                                65 + optIndex
                                              )}
                                              .
                                            </span>
                                            <div>
                                              <p>{option.text}</p>
                                              {option.imageUrl && (
                                                <img
                                                  src={option.imageUrl}
                                                  alt={`Option ${optIndex + 1}`}
                                                  className="mt-2 max-w-xs rounded"
                                                />
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
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
  );
}
``