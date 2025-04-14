"use client";

import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import * as OCL from "openchemlib/full";

export default function LatexText({ text }) {
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\[chem:.*?\])/g;
  const parts = text.split(regex);

  return (
    <div className="whitespace-pre-wrap relative">
      {parts.map((part, i) => {
        const isInlineMath = part.startsWith("\\(") && part.endsWith("\\)");
        const isBlockMath = part.startsWith("\\[") && part.endsWith("\\]");
        const isChem = part.startsWith("[chem:") && part.endsWith("]");

        if (isInlineMath || isBlockMath) {
          const latex = part.slice(2, -2);
          const html = katex.renderToString(latex, {
            throwOnError: false,
            displayMode: isBlockMath,
          });
          return (
            <span
              key={i}
              className={`${
                isBlockMath ? "block my-4 text-center" : ""
              } overflow-auto break-words`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (isChem) {
          const chemContent = part.slice(6, -1);
          const [smiles, size] = chemContent.split("|");
          const [width, height] = size?.split("x").map(Number) || [200, 150];
          return (
            <MoleculeRenderer
              key={i}
              smiles={smiles}
              width={width}
              height={height}
            />
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

function MoleculeRenderer({
  smiles,
  width = 200,
  height = 150,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const mol = OCL.Molecule.fromSmiles(smiles);
    const svg = mol.toSVG(width, height);
    if (ref.current) {
      ref.current.innerHTML = svg;
    }
  }, [smiles, width, height]);

  return <div ref={ref} className="my-2" />;
}
