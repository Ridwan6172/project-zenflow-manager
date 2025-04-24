
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFilters } from "@/types/project";

interface StatusFilterProps {
  status: ProjectFilters['status'];
  setStatus: (value: ProjectFilters['status']) => void;
}

export default function StatusFilter({ status, setStatus }: StatusFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Status</label>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="waiting">Waiting</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
