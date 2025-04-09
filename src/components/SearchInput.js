"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(window.location.search); // Preserve existing
      if (query.trim()) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.replace(`/?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <form
      className="flex-1 h-full rounded-xl bg-background flex gap-3 items-center px-3 focus-within:border-primary focus-within:border-2 border-2 border-transparent"
      onSubmit={(e) => e.preventDefault()}
    >
      <Search className="text-accent-foreground/70" size={18} />
      <input
        type="text"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Test..."
        className="h-full shadow-none border-none w-full rounded-xl outline-none"
      />
    </form>
  );
}
