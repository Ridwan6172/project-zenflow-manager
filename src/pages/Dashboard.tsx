
import React from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectTable from '../components/ProjectTable';
import ProjectFilters from '../components/ProjectFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddEditProjectModal from '../components/AddEditProjectModal';

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

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const uniqueAssignees = getUniqueAssignees();

  const handleAddProject = (projectData: any) => {
    const success = addProject(projectData);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Project Management Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add Project
        </Button>
      </div>

      <ProjectFilters
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        uniqueAssignees={uniqueAssignees}
      />

      <ProjectTable
        projects={projects}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
      />

      <AddEditProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProject}
      />
    </div>
  );
};

export default Dashboard;
