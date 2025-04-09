"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  correct: "#22c55e", // green
  incorrect: "#ef4444", // red
  unattempted: "#9ca3af", // gray
};

export default function SubjectPieChart({ subject, stats }) {
  const data = [
    { name: "Correct", value: stats.correct, color: COLORS.correct },
    { name: "Incorrect", value: stats.incorrect, color: COLORS.incorrect },
    {
      name: "Unattempted",
      value: stats.total - stats.attempted,
      color: COLORS.unattempted,
    },
  ];

  return (
    <div className="w-full sm:w-72 md:w-80 lg:w-96 p-4 border rounded-lg bg-sidebar">
      <h4 className="text-center text-base font-semibold capitalize mb-2">
        {subject} Performance
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
