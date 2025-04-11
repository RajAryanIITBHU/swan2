"use client";

import LatexText from "@/components/LatexText";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const Page = () => {
  const [value, setValue] = useState(``);

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          MathJax + Chemistry Renderer
        </h1>

        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-5 max-h-52"
          rows={5}
          placeholder="Type math or chemical markup here..."
        />

        {/* Convert double backslashes from textarea into single ones for KaTeX */}
        <LatexText text={value.replace(/\\\\/g, "\\")} />
      </div>
    </div>
  );
};

export default Page;
