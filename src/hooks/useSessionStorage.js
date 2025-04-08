import { useEffect, useState } from "react";

export default function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("useSessionStorage error:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error("useSessionStorage set error:", error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
