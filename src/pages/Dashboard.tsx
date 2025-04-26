
import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types/project';
import ProjectTable from '../components/ProjectTable';
import ProjectFilters from '../components/ProjectFilters';

const Dashboard = () => {
  const { 
    projects, 
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
  } = useProjects();
  
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8"> {/* Removed max-width constraint */}
        <div className="dashboard-header bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Project Management Dashboard
          </h1>
          <p className="text-gray-600">Track and manage all your projects in one place</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <ProjectFilters 
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
            uniqueAssignees={getUniqueAssignees()}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-xl text-gray-600">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-xl text-red-500">Error loading projects: {error}</p>
            </div>
          ) : (
            <ProjectTable
              projects={projects}
              onUpdateProject={updateProject}
              onDeleteProject={deleteProject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
