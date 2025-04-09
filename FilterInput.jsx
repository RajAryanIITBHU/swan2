"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const FilterInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(searchParams.get("filter") || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (filter.trim()) {
        params.set("filter", filter);
      } else {
        params.delete("filter");
      }

      router.replace(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [filter]);

  const handleClearFilter = () => {
    setFilter("");
  };

  return (
    <div className={`h-full rounded-xl bg-background flex gap-1 items-center px-3 max-w-[220px] w-full border-4 ${filter ? "border-primary/50":"border-transparent"}`}>
      <ListFilter size={18} className="" />
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="flex-1 border-none h-full shadow-none outline-none focus:outline-none cursor-pointer">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ongoing">Ongoing</SelectItem>
          <SelectItem value="yet-to-start">Yet To Start</SelectItem>
          <SelectItem value="ended">Ended</SelectItem>
        </SelectContent>
      </Select>

      {filter && (
        <button
          type="button"
          onClick={handleClearFilter}
          className="text-muted-foreground hover:text-destructive transition cursor-pointer"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default FilterInput;
