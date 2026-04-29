"use client";

import { useTranslations } from "next-intl";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
}

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
}: SearchFilterProps) => {
  const t = useTranslations("Transactions");

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 rounded-2xl pl-10"
        />
      </div>
      <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-card/60 p-1">
        {(["all", "in", "out"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              filterValue === filter
                ? "bg-primary-glow/15 text-primary-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="h-3 w-3" />
            {filter === "all" ? "All" : filter === "in" ? "In" : "Out"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
