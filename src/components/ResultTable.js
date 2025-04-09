import React from "react";
import SubjectPieChart from "./SubjectPieChart";
import MarksOverview from "./MarkOverview";

function evaluateDataSectionWise(subject) {
  const a = {
    total: 0,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    marks: 0,
  };

  for (const sec in subject) {
    a.total += subject[sec].total;
    a.attempted += subject[sec].attempted;
    a.correct += subject[sec].correct;
    a.incorrect += subject[sec].incorrect;
    a.marks += subject[sec].marks;
  }

  return a;
}

function getMaxMarks(result){
  let total = 0
  for (const subj in result){
    if(subj !== "totalResult"){
      for (const sec in result[subj]){
        total+=result[subj][sec].totalMarks
      }
    }
  }
  return total
}



export default function ResultTable({ result }) {
const { marks, attempted, correct, incorrect } = result.totalResult;
const maxMarks = getMaxMarks(result);
  return (
    <div className="space-y-6">
      <div className="border p-6 rounded-2xl bg-background w-full space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold capitalize mb-4 md:mb-0 text-muted-foreground">
              Total Performance
            </h2>
            <div className="text-3xl font-semibold tracking-wide text-primary">
              <span>{marks}</span> / <span>{maxMarks}</span> Marks
            </div>
          </div>

          {/* Marks Overview */}
          <div className="w-full md:w-64">
            <MarksOverview marks={marks} total={maxMarks} />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left border rounded-xl overflow-hidden bg-card shadow-md">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-4">Total Ques</th>
                <th className="p-4 text-blue-600">Attempted</th>
                <th className="p-4 text-green-600">Correct</th>
                <th className="p-4 text-red-600">Incorrect</th>
                <th className="p-4">Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-muted/20 transition duration-200 ease-in-out">
                <td className="p-4">{result.totalResult.total}</td>
                <td className="p-4 text-blue-600">{attempted}</td>
                <td className="p-4 text-green-600">{correct}</td>
                <td className="p-4 text-red-600">{incorrect}</td>
                <td className="p-4 font-medium">{marks}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        {Object.entries(result).map(([subject, sections]) => {
          if (subject !== "totalResult") {
            return (
              <SubjectPieChart
                key={subject}
                subject={subject}
                stats={evaluateDataSectionWise(result[subject])}
              />
            );
          }
        })}
      </div>

      {Object.entries(result).map(([subject, sections]) => {
        if (subject !== "totalResult") {
          evaluateDataSectionWise(result[subject]);
          return (
            <div
              key={subject}
              className="border p-4 rounded-xl shadow bg-sidebar"
            >
              <h2 className="text-xl font-bold capitalize mb-4 ml-2">
                {subject}
              </h2>
              <table className="table-auto w-full text-sm text-left">
                <thead>
                  <tr className="">
                    <th className="p-2">Section</th>
                    <th className="p-2">Total Ques</th>
                    <th className="p-2 text-blue-500">Attempted</th>
                    <th className="p-2 text-green-600">Correct</th>
                    <th className="p-2 text-red-600">Incorrect</th>
                    <th className="p-2">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sections).map(([section, stats]) => (
                    <tr key={section} className="border-t">
                      <td className="p-2">{section}</td>
                      <td className="p-2">{stats.total}</td>
                      <td className="p-2 text-blue-500">{stats.attempted}</td>
                      <td className="p-2 text-green-600">{stats.correct}</td>
                      <td className="p-2 text-red-600">{stats.incorrect}</td>
                      <td className="p-2 font-semibold">{stats.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      })}
    </div>
  );
}


