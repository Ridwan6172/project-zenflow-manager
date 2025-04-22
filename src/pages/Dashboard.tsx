
import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import ProjectTable from '@/components/ProjectTable';
import ProjectFilters from '@/components/ProjectFilters';
import AddEditProjectModal from '@/components/AddEditProjectModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    filters,
    setFilters,
    sort,
    setSort,
    getUniqueAssignees
  } = useProjects();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Project Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <Plus className="mr-1 h-4 w-4" /> Add New Project
        </Button>
      </div>

      <ProjectFilters 
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        uniqueAssignees={getUniqueAssignees()}
      />

      <ProjectTable 
        projects={projects}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
      />

      <AddEditProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addProject}
      />
    </div>
  );
}
