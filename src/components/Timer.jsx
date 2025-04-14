import React, { useEffect } from "react";
import { Clock } from "lucide-react";

export const Timer = ({ timeRemaining, onTimeEnd, isTestStarted,className,icon=true }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeRemaining === 0 && isTestStarted) {
      onTimeEnd();
    }
  }, [timeRemaining, onTimeEnd, isTestStarted]);

  return (
    <div className={`flex items-center gap-2 text-2xl font-bold p-4 bg-gray-200 rounded-lg shadow-md ${className}`}>
      <Clock className={`w-6 h-6 ${icon ? "": "hidden"}`} />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
};
