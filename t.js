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
import { Trash2, Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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

  // Add a new section
  const addSection = (subject) => {
    if (sections.length >= 4) {
      toast.error("Maximum Sections Created!");
      return;
    }
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      subject,
      defaultQuestionType: "single-mcq",
      questions: [],
    };
    setSections([...sections, newSection]);
    setCurrentSection(newSection); // Set the new section as current
  };

  // Handle question type change
  const handleQuestionTypeChange = (value) => {
    setCurrentQuestion({ ...currentQuestion, type: value });
    const updatedSections = sections.map((section) =>
      section.id === currentSection.id
        ? { ...section, defaultQuestionType: value }
        : section
    );
    setSections(updatedSections);
  };

  // Add a new question
  const addQuestion = () => {
    if (!currentSection) return;

    const newQuestion = {
      id: Date.now(),
      sectionId: currentSection.id,
      ...currentQuestion,
    };

    // Add question to global questions and current section
    setQuestions([...questions, newQuestion]);
    const updatedSections = sections.map((section) =>
      section.id === currentSection.id
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    );
    setSections(updatedSections);

    // Reset the question form
    setCurrentQuestion({
      type: currentSection.defaultQuestionType,
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

  // Edit a question
  const editQuestion = (question) => {
    const parentSection = sections.find((s) => s.id === question.sectionId);
    setCurrentSection(parentSection);
    setCurrentQuestion(question);
  };

  // Delete a question
  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    const updatedSections = sections.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.id !== questionId),
    }));
    setSections(updatedSections);
  };

  return (
    <div className="container mx-auto p-6 max-w-[860px]">
      <h1 className="text-3xl font-bold mb-6">Create New Test Batch</h1>

      <Card className="p-6">
        <Label htmlFor="batchName">Batch Name</Label>
        <Input
          id="batchName"
          placeholder="Enter batch name"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
        />
        {/* Other input fields for test name and dates */}
      </Card>

      <Tabs defaultValue="mathematics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
        </TabsList>

        {["mathematics", "physics", "chemistry"].map((subject) => (
          <TabsContent key={subject} value={subject}>
            <Button onClick={() => addSection(subject)}>Add Section</Button>
            {/* Section Tabs */}
            <Tabs defaultValue={sections[0]?.name || ""}>
              <TabsList>
                {sections
                  .filter((s) => s.subject === subject)
                  .map((section) => (
                    <TabsTrigger key={section.id} value={section.name}>
                      {section.name}
                    </TabsTrigger>
                  ))}
              </TabsList>

              {/* Section Content */}
              {sections
                .filter((s) => s.subject === subject)
                .map((section) => (
                  <TabsContent key={section.id} value={section.name}>
                    {/* Question Form */}
                    {/* Render Questions */}
                    {questions
                      .filter((q) => q.sectionId === section.id)
                      .map((question) => (
                        <div key={question.id}>
                          <p>{question.content}</p>
                          <Button onClick={() => editQuestion(question)}>
                            Edit
                          </Button>
                          <Button onClick={() => deleteQuestion(question.id)}>
                            Delete
                          </Button>
                        </div>
                      ))}
                  </TabsContent>
                ))}
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>

      <Button onClick={() => console.log("Save Test Batch")}>
        Save Test Batch
      </Button>
    </div>
  );
}
