
import { useState, useEffect, useMemo } from 'react';
import { Project, ProjectFilters, SortConfig } from '../types/project';
import { supabase } from '@/integrations/supabase/client';

// Utility to convert supabase DB row to Project interface (with Dates)
const dbToProject = (row: any): Project => ({
  id: row.id,
  name: row.name,
  assignedTo: row.assigned_to,
  clientName: row.client_name,
  clientAddress: row.client_address,
  nextMeeting: row.next_meeting ? new Date(row.next_meeting) : null,
  budget: Number(row.budget),
  startDate: new Date(row.start_date),
  endDate: row.end_date ? new Date(row.end_date) : null,
  remarks: row.remarks || '',
  status: row.status,
});

// Utility to convert Project to DB object for insert/update
const projectToDb = (project: Omit<Project, 'id'>) => ({
  name: project.name,
  assigned_to: project.assignedTo,
  client_name: project.clientName,
  client_address: project.clientAddress,
  next_meeting: project.nextMeeting ? project.nextMeeting.toISOString() : null,
  budget: project.budget,
  start_date: project.startDate.toISOString().substring(0, 10), // yyyy-mm-dd
  end_date: project.endDate ? project.endDate.toISOString().substring(0, 10) : null,
  remarks: project.remarks,
  status: project.status,
});

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    dateRange: { start: null, end: null },
    assignedTo: '',
    status: 'all',
    upcomingMeetings: false
  });
  const [sort, setSort] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
        return;
      }
      setProjects(data.map(dbToProject));
    };
    fetchProjects();
  }, []);

  // Add a new project
  const addProject = async (project: Omit<Project, 'id'>) => {
    // Add created_at/updated_at handled by supabase default, user_id is managed by logged-in context (here must be set manually because project.user_id is required)
    // We'll leave user_id as null for now as there's no auth context yet, fix this once auth is added!
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectToDb(project), user_id: '00000000-0000-0000-0000-000000000000' }]) // TEMP: user_id placeholder
      .select();
    if (error) {
      console.error('Failed to add project:', error);
      return;
    }
    if (data && data.length > 0) {
      setProjects((prev) => [...prev, dbToProject(data[0])]);
    }
  };

  // Update an existing project
  const updateProject = async (updatedProject: Project) => {
    const { id, ...rest } = updatedProject;
    const { data, error } = await supabase
      .from('projects')
      .update(projectToDb(rest))
      .eq('id', id)
      .select();
    if (error) {
      console.error('Failed to update project:', error);
      return;
    }
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? dbToProject(data[0]) : proj))
    );
  };

  // Delete a project
  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete project:', error);
      return;
    }
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Apply filters
    if (filters.assignedTo) {
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

    // Sort results
    result.sort((a, b) => {
      let aValue: any, bValue: any;

      // Handle different field types for sorting
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
        default:
          aValue = a.name;
          bValue = b.name;
      }

      // Sort based on direction
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [projects, filters, sort]);

  // Get unique values for filter dropdowns
  const getUniqueAssignees = () => {
    return Array.from(new Set(projects.map(p => p.assignedTo)));
  };

  return {
    projects: filteredAndSortedProjects,
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

