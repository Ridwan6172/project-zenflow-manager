
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ProjectFilters as FilterType, SortConfig } from '../types/project';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort({ field: field as any, direction });
  };

  const handleReset = () => {
    setFilters({
      dateRange: { start: null, end: null },
      assignedTo: '',
      status: 'all',
      upcomingMeetings: false
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
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <div className="flex gap-2">
              {/* Start Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange.start && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateRange.start ? (
                      format(filters.dateRange.start, "MMM d, yyyy")
                    ) : (
                      "Start Date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateRange.start || undefined}
                    onSelect={(date) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: date || null }
                    })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {/* End Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange.end && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateRange.end ? (
                      format(filters.dateRange.end, "MMM d, yyyy")
                    ) : (
                      "End Date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateRange.end || undefined}
                    onSelect={(date) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: date || null }
                    })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Assigned To Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            <Select
              value={filters.assignedTo}
              onValueChange={(value) => setFilters({ ...filters, assignedTo: value })}
            >
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

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value: any) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upcoming Meetings Filter */}
          <div className="flex items-center mt-6">
            <Checkbox
              id="upcomingMeetings"
              checked={filters.upcomingMeetings}
              onCheckedChange={(checked) => setFilters({ 
                ...filters, 
                upcomingMeetings: !!checked
              })}
            />
            <label htmlFor="upcomingMeetings" className="ml-2 text-sm font-medium">
              Show only projects with upcoming meetings
            </label>
          </div>
        </div>
      )}

      {isFilterExpanded && (
        <div className="border-t mt-4 pt-4">
          <h3 className="text-sm font-medium mb-2">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={sort.field === 'name' ? 'default' : 'outline'}
              onClick={() => handleSortChange(
                'name', 
                sort.field === 'name' && sort.direction === 'asc' ? 'desc' : 'asc'
              )}
            >
              Name {sort.field === 'name' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              size="sm" 
              variant={sort.field === 'budget' ? 'default' : 'outline'}
              onClick={() => handleSortChange(
                'budget', 
                sort.field === 'budget' && sort.direction === 'asc' ? 'desc' : 'asc'
              )}
            >
              Budget {sort.field === 'budget' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              size="sm" 
              variant={sort.field === 'nextMeeting' ? 'default' : 'outline'}
              onClick={() => handleSortChange(
                'nextMeeting', 
                sort.field === 'nextMeeting' && sort.direction === 'asc' ? 'desc' : 'asc'
              )}
            >
              Meeting Date {sort.field === 'nextMeeting' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              size="sm" 
              variant={sort.field === 'startDate' ? 'default' : 'outline'}
              onClick={() => handleSortChange(
                'startDate', 
                sort.field === 'startDate' && sort.direction === 'asc' ? 'desc' : 'asc'
              )}
            >
              Start Date {sort.field === 'startDate' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              size="sm" 
              variant={sort.field === 'endDate' ? 'default' : 'outline'}
              onClick={() => handleSortChange(
                'endDate', 
                sort.field === 'endDate' && sort.direction === 'asc' ? 'desc' : 'asc'
              )}
            >
              End Date {sort.field === 'endDate' && (sort.direction === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
