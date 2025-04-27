
import { useState } from 'react';
import { ProjectFilters as FilterType, SortConfig } from '../types/project';
import { Button } from '@/components/ui/button';
import DateRangeFilter from './ProjectFilters/DateRangeFilter';
import AssignedToFilter from './ProjectFilters/AssignedToFilter';
import StatusFilter from './ProjectFilters/StatusFilter';
import ProjectTypeFilter from './ProjectFilters/ProjectTypeFilter';
import UpcomingMeetingsFilter from './ProjectFilters/UpcomingMeetingsFilter';
import SortButtons from './ProjectFilters/SortButtons';

interface ProjectFiltersProps {
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  sort: SortConfig;
  setSort: (sort: SortConfig) => void;
  uniqueAssignees: string[];
}

export default function ProjectFilters({
  filters,
  setFilters,
  sort,
  setSort,
  uniqueAssignees
}: ProjectFiltersProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const handleReset = () => {
    setFilters({
      dateRange: { start: null, end: null },
      assignedTo: '',
      status: 'all',
      upcomingMeetings: false,
      projectType: 'all'
    });
    setSort({
      field: 'name',
      direction: 'asc'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-lg font-semibold mb-2 md:mb-0">Project Filters</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            {isFilterExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {isFilterExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <ProjectTypeFilter
            projectType={filters.projectType}
            setProjectType={(val) => setFilters({ ...filters, projectType: val })}
          />
          <DateRangeFilter
            dateRange={filters.dateRange}
            setDateRange={(range) => setFilters({ ...filters, dateRange: range })}
          />
          <AssignedToFilter
            assignedTo={filters.assignedTo}
            setAssignedTo={(val) => setFilters({ ...filters, assignedTo: val })}
            uniqueAssignees={uniqueAssignees}
          />
          <StatusFilter
            status={filters.status}
            setStatus={(val) => setFilters({ ...filters, status: val })}
          />
          <UpcomingMeetingsFilter
            upcomingMeetings={filters.upcomingMeetings}
            setUpcomingMeetings={(checked) => setFilters({ ...filters, upcomingMeetings: checked })}
          />
        </div>
      )}

      {isFilterExpanded && (
        <div className="border-t mt-4 pt-4">
          <h3 className="text-sm font-medium mb-2">Sort by</h3>
          <SortButtons sort={sort} setSort={setSort} />
        </div>
      )}
    </div>
  );
}
