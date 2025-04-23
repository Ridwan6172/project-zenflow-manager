
export interface Project {
  id: string;
  name: string;
  assignedTo: string;
  clientName: string;
  clientAddress: string;
  nextMeeting: Date | null;
  budget: number;
  startDate: Date;
  endDate: Date | null;
  remarks: string;
  status: 'active' | 'completed' | 'waiting'; // Updated to include 'waiting'
}

export type ProjectFormData = Omit<Project, 'id'>;

export interface ProjectFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  assignedTo: string;
  status: 'all' | 'active' | 'completed' | 'waiting'; // Updated to include 'waiting'
  upcomingMeetings: boolean;
}

export type SortField = 'name' | 'budget' | 'nextMeeting' | 'startDate' | 'endDate';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
