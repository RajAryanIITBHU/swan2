"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import RecentTestGroupServer from "./RecentTestGroup";


export default function SearchTestsClient({ files }) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(files);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(files.filter((file) => file.name.toLowerCase().includes(term)));
  }, [search, files]);

  const grouped = filtered.reduce((acc, file) => {
    const letter = file.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(file);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <>
      <div className="w-full h-12 flex gap-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 h-full rounded-xl bg-background flex gap-3 items-center px-3 focus-within:border-primary focus-within:border-2 border-2 border-transparent"
        >
          <Search className="text-accent-foreground/70" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full shadow-none border-none w-full rounded-xl outline-none"
            placeholder="Search Test..."
          />
        </form>
        <div className="h-full rounded-xl bg-background py-2 md:py-3 px-4 text-sm text-muted-foreground">
          Filter
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="w-full px-4 py-12 text-center text-foreground/70 font-lg rounded-xl bg-background overflow-hidden">
          No Available Tests Right Now
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {letters.map((letter) => (
            <div key={letter}>
              <h2 className="text-xl font-semibold text-primary mb-2">
                {letter}
              </h2>
              {/* ✅ Pass grouped files to server component */}
              <RecentTestGroupServer files={grouped[letter]} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
