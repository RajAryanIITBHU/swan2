"use client"
import { useEffect, useState } from "react";

export function useCountdown(targetTime) {
  const [remaining, setRemaining] = useState(targetTime - Date.now());
  const [isRunning, setIsRunning] = useState(remaining > 0);

  useEffect(() => {
    if (remaining <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      const diff = targetTime - Date.now();
      setRemaining(diff > 0 ? diff : 0);
      if (diff <= 0) {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const minutes = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(
    2,
    "0"
  );

  return { time: `${minutes}:${seconds}`, isRunning };
}
