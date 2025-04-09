"use client";

import { useEffect, useState } from "react";
import ResultTable from "@/components/ResultTable";
import { calculateResults } from "@/utils/calculateResult";
import { useSession } from "next-auth/react";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

export default function ScoreSummary({ result }) {

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto">
        
        {result ? <ResultTable result={result} /> : <p>Loading result...</p>}
      </div>
    </section>
  );
}
