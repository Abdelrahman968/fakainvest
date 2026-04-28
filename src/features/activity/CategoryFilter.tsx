import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  categories: readonly string[];
}

export default function CategoryFilter({
  activeFilter,
  onFilterChange,
  categories,
}: CategoryFilterProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
      <div className="flex gap-2 pb-1">
        <Filter className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onFilterChange(c)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeFilter === c
                ? "bg-gradient-accent text-primary-foreground shadow-glow"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
