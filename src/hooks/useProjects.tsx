
import { useState, useEffect, useMemo } from 'react';
import { Project, ProjectFilters, SortConfig } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

// Sample data for initial projects
const sampleProjects: Project[] = [
  {
    id: uuidv4(),
    name: 'Website Redesign',
    assignedTo: 'John Smith',
    clientName: 'Acme Corp',
    clientAddress: '123 Business Ave, Suite 100, New York, NY 10001',
    nextMeeting: new Date(Date.now() + 86400000 * 3), // 3 days from now
    budget: 12500,
    startDate: new Date(Date.now() - 86400000 * 30), // 30 days ago
    endDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
    remarks: 'Phase 1 completed, moving to Phase 2',
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Mobile App Development',
    assignedTo: 'Sarah Johnson',
    clientName: 'TechStart Inc',
    clientAddress: '456 Innovation Blvd, San Francisco, CA 94107',
    nextMeeting: new Date(Date.now() + 86400000 * 1), // 1 day from now
    budget: 45000,
    startDate: new Date(Date.now() - 86400000 * 60), // 60 days ago
    endDate: new Date(Date.now() + 86400000 * 90), // 90 days from now
    remarks: 'Backend integration in progress',
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Brand Identity Redesign',
    assignedTo: 'Michael Chen',
    clientName: 'Fresh Foods Co',
    clientAddress: '789 Market St, Chicago, IL 60601',
    nextMeeting: new Date(Date.now() + 86400000 * 7), // 7 days from now
    budget: 8750,
    startDate: new Date(Date.now() - 86400000 * 15), // 15 days ago
    endDate: null, // Ongoing
    remarks: 'Logo concepts approved, working on style guide',
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'E-commerce Platform',
    assignedTo: 'Emily Rodriguez',
    clientName: 'Boutique Brands',
    clientAddress: '321 Fashion Ave, Miami, FL 33101',
    nextMeeting: null, // No meeting scheduled
    budget: 27500,
    startDate: new Date(Date.now() - 86400000 * 120), // 120 days ago
    endDate: new Date(Date.now() - 86400000 * 10), // 10 days ago
    remarks: 'Project completed, waiting for final review',
    status: 'completed'
  }
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
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

  // Add a new project
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: uuidv4()
    };
    setProjects([...projects, newProject]);
  };

  // Update an existing project
  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  // Delete a project
  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
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
      let aValue, bValue;

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
