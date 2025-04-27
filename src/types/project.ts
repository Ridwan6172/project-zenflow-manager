export interface Project {
  id: string;
  name: string;
  assignedTo: string;
  clientName: string;
  clientCountry: string;
  techStack: string;
  milestone: string;
  nextAction: string;
  nextMeeting: Date | null;
  budget: number;
  startDate: Date;
  endDate: Date | null;
  endDateNotes: string;
  remarks: string;
  status: 'active' | 'completed' | 'waiting' | 'cancelled';
  completionPercentage: number;
  projectType: 'AI' | 'NON AI';
}

export type ProjectFormData = Omit<Project, 'id'>;

export interface ProjectFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  assignedTo: string;
  status: 'all' | 'active' | 'completed' | 'waiting' | 'cancelled';
  upcomingMeetings: boolean;
  projectType: 'all' | 'AI' | 'NON AI';
}

export type SortField = 'name' | 'budget' | 'nextMeeting' | 'startDate' | 'endDate' | 'completionPercentage';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
