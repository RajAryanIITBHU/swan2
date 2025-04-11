// components/MathsText.jsx
import React, { useEffect, useRef } from "react";

export const MathText = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.MathJax && containerRef.current) {
      // Process this element with MathJax
      window.MathJax.typesetPromise?.([containerRef.current]);
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="math-content"
      dangerouslySetInnerHTML={{ __html: content || "" }}
    />
  );
};
