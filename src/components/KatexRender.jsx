"use client";
import katex from "katex";
import "katex/dist/katex.min.css";
import React from "react";

export const KaTeXRender = ({ content }) => {
  let html = "";
  try {
    html = katex.renderToString(content, {
      throwOnError: false,
      displayMode: content.includes("\\[") || content.includes("\\]"),
    });
  } catch (e) {
    html = content; // fallback to plain text
  }

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
