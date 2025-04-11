// hooks/useMathJax.js
import { useEffect } from "react";

export const useMathJax = (deps = []) => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, deps);
};
