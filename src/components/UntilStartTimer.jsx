"use client";
import { useEffect, useState } from "react";

export default function UntilStartTimer({ className, start, end }) {
  const [status, setStatus] = useState(null); // Start with null

  useEffect(() => {
    const updateStatus = () => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const now = new Date();

      if (now >= endDate) {
        setStatus("Ended");
        return;
      }

      if (now >= startDate) {
        setStatus("Ongoing");
        return;
      }

      const diff = startDate.getTime() - now.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setStatus(`Starts in: ${hours}h ${minutes}m ${seconds}s`);
    };

    updateStatus(); // Immediately run on mount
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  if (status === null)
    return (
      <div
        className={`${className}flex gap-1 text-xs border ${
          status === "Ongoing"
            ? "text-green-500 bg-green-200 border-green-300"
            : status === "Ended"
            ? "bg-red-50 text-red-500 border-red-300"
            : ""
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full mt-[1px] ${
            status === "Ongoing"
              ? "bg-green-500"
              : status === "Ended"
              ? "bg-red-500 "
              : "bg-secondary"
          }}`}
        ></div>
        <span>{""}</span>
      </div>
    );

  return (
    <div
      className={`${className} flex items-center gap-1.5 text-xs border ${
        status === "Ongoing"
          ? "text-green-500 bg-green-200 border-green-300"
          : status === "Ended"
          ? "bg-red-50 text-red-500 border-red-300"
          : ""
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full mt-[1px] ${
          status === "Ongoing"
            ? "bg-green-500"
            : status === "Ended"
            ? "bg-red-500 "
            : "bg-secondary"
        }}`}
      ></div>
      <span>{status}</span>
    </div>
  );
}
