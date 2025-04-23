
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignedToFilterProps {
  assignedTo: string;
  setAssignedTo: (value: string) => void;
  uniqueAssignees: string[];
}

export default function AssignedToFilter({ assignedTo, setAssignedTo, uniqueAssignees }: AssignedToFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Assigned To</label>
      <Select value={assignedTo} onValueChange={setAssignedTo}>
        <SelectTrigger>
          <SelectValue placeholder="Select person" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {uniqueAssignees.map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
