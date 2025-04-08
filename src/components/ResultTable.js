import React from "react";

export default function ResultTable({ result }) {
  return (
    <div className="space-y-6 bg-gray-100">
      {Object.entries(result).map(([subject, sections]) => (
        <div key={subject} className="border p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold capitalize mb-4">{subject}</h2>
          <table className="table-auto w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Section</th>
                <th className="p-2">Total</th>
                <th className="p-2">Attempted</th>
                <th className="p-2">Correct</th>
                <th className="p-2">Incorrect</th>
                <th className="p-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sections).map(([section, stats]) => (
                <tr key={section} className="border-t">
                  <td className="p-2">{section}</td>
                  <td className="p-2">{stats.total}</td>
                  <td className="p-2">{stats.attempted}</td>
                  <td className="p-2 text-green-600">{stats.correct}</td>
                  <td className="p-2 text-red-600">{stats.incorrect}</td>
                  <td className="p-2 font-semibold">{stats.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
