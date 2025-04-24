
export interface Project {
  id: string;
  name: string;
  assignedTo: string;
  clientName: string;
  clientAddress: string;
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
}

export type SortField = 'name' | 'budget' | 'nextMeeting' | 'startDate' | 'endDate';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
