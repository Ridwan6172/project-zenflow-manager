import { useState, useEffect, useMemo } from 'react';
import { Project, ProjectFilters, SortConfig } from '../types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const dbToProject = (row: any): Project => ({
  id: row.id,
  name: row.name,
  assignedTo: row.assigned_to,
  clientName: row.client_name,
  clientCountry: row.client_country || '',
  techStack: row.tech_stack || '',
  milestone: row.milestone || '',
  nextAction: row.next_action || '',
  nextMeeting: row.next_meeting ? new Date(row.next_meeting) : null,
  budget: Number(row.budget),
  startDate: new Date(row.start_date),
  endDate: row.end_date ? new Date(row.end_date) : null,
  endDateNotes: row.end_date_notes || '',
  remarks: row.remarks || '',
  status: row.status,
  completionPercentage: Number(row.completion_percentage) || 0,
});

const projectToDb = (project: Omit<Project, 'id'>) => ({
  name: project.name,
  assigned_to: project.assignedTo,
  client_name: project.clientName,
  client_country: project.clientCountry,
  tech_stack: project.techStack,
  milestone: project.milestone,
  next_action: project.nextAction,
  next_meeting: project.nextMeeting ? project.nextMeeting.toISOString() : null,
  budget: project.budget,
  start_date: project.startDate.toISOString().substring(0, 10),
  end_date: project.endDate ? project.endDate.toISOString().substring(0, 10) : null,
  end_date_notes: project.endDateNotes,
  remarks: project.remarks,
  status: project.status,
  completion_percentage: project.completionPercentage,
});

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({
    dateRange: { start: null, end: null },
    assignedTo: '',
    status: 'all',
    upcomingMeetings: false
  });
  const [sort, setSort] = useState<SortConfig>({
    field: 'completionPercentage',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        setProjects(data.map(dbToProject));
      } catch (err: any) {
        console.error('Failed to fetch projects:', err);
        setError(`Failed to load projects: ${err.message || 'Unknown error'}`);
        toast.error(`Failed to load projects: ${err.message || 'Unknown error'}`);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectToDb(project), user_id: null }])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setProjects((prev) => [...prev, dbToProject(data[0])]);
        toast.success('Project added successfully');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to add project:', err);
      toast.error(`Failed to add project: ${err.message || 'Unknown error'}`);
      return false;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const { id, ...rest } = updatedProject;
      const { data, error } = await supabase
        .from('projects')
        .update(projectToDb(rest))
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setProjects((prev) =>
          prev.map((proj) => (proj.id === id ? dbToProject(data[0]) : proj))
        );
        toast.success('Project updated successfully');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to update project:', err);
      toast.error(`Failed to update project: ${err.message || 'Unknown error'}`);
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setProjects((prev) => prev.filter((proj) => proj.id !== id));
      toast.success('Project deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      toast.error(`Failed to delete project: ${err.message || 'Unknown error'}`);
      return false;
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (filters.assignedTo && filters.assignedTo !== 'all') {
      result = result.filter(p =>
        p.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }

    if (filters.dateRange.start) {
      result = result.filter(p =>
        p.startDate >= filters.dateRange.start! ||
        (p.endDate && p.endDate >= filters.dateRange.start!)
      );
    }

    if (filters.dateRange.end) {
      result = result.filter(p =>
        p.startDate <= filters.dateRange.end! ||
        (p.endDate && p.endDate <= filters.dateRange.end!)
      );
    }

    if (filters.upcomingMeetings) {
      const now = new Date();
      result = result.filter(p =>
        p.nextMeeting && p.nextMeeting > now
      );
    }

    result.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'nextMeeting':
          aValue = a.nextMeeting ? a.nextMeeting.getTime() : Number.MAX_SAFE_INTEGER;
          bValue = b.nextMeeting ? b.nextMeeting.getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'startDate':
          aValue = a.startDate.getTime();
          bValue = b.startDate.getTime();
          break;
        case 'endDate':
          aValue = a.endDate ? a.endDate.getTime() : Number.MAX_SAFE_INTEGER;
          bValue = b.endDate ? b.endDate.getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'completionPercentage':
          aValue = a.completionPercentage;
          bValue = b.completionPercentage;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [projects, filters, sort]);

  const getUniqueAssignees = () => {
    return Array.from(new Set(projects.map(p => p.assignedTo)));
  };

  return {
    projects: filteredAndSortedProjects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    filters,
    setFilters,
    sort,
    setSort,
    getUniqueAssignees
  };
}
