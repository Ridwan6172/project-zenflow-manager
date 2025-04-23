
import { Button } from "@/components/ui/button";
import { SortConfig } from "../../types/project";

interface SortButtonsProps {
  sort: SortConfig;
  setSort: (sort: SortConfig) => void;
}

const sortFields = [
  { field: "name", label: "Name" },
  { field: "budget", label: "Budget" },
  { field: "nextMeeting", label: "Meeting Date" },
  { field: "startDate", label: "Start Date" },
  { field: "endDate", label: "End Date" },
] as const;

export default function SortButtons({ sort, setSort }: SortButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sortFields.map(({ field, label }) => (
        <Button
          key={field}
          size="sm"
          variant={sort.field === field ? "default" : "outline"}
          onClick={() =>
            setSort({
              field: field as SortConfig["field"],
              direction:
                sort.field === field && sort.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          {label}{" "}
          {sort.field === field && (sort.direction === "asc" ? "↑" : "↓")}
        </Button>
      ))}
    </div>
  );
}
