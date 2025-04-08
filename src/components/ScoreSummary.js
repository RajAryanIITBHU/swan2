"use client";

import { useEffect, useState } from "react";
import ResultTable from "@/components/ResultTable";
import { calculateResults } from "@/utils/calculateResult"; 

export default function ScoreSummary({questionData}) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const local = localStorage.getItem("data");
    if (!local) return;

    const responseObj = JSON.parse(local)?.test;
    if (!responseObj) return;

    const computed = calculateResults(questionData, responseObj);
    setResult(computed);
  }, []);

  return (
    <section className="w-full bg-gray-50">
      <div className="p-4 max-w-4xl mx-auto text-neutral-900">
        <h1 className="text-2xl font-bold mb-6">Test Result</h1>
        {result ? <ResultTable result={result} /> : <p>Loading result...</p>}
      </div>
    </section>
  );
}
