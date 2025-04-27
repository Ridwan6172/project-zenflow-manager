
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFilters } from "@/types/project";

interface ProjectTypeFilterProps {
  projectType: ProjectFilters['projectType'];
  setProjectType: (value: ProjectFilters['projectType']) => void;
}

export default function ProjectTypeFilter({ projectType, setProjectType }: ProjectTypeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Project Type</label>
      <Select value={projectType} onValueChange={setProjectType}>
        <SelectTrigger>
          <SelectValue placeholder="Select project type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="AI">AI</SelectItem>
          <SelectItem value="NON AI">NON AI</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
