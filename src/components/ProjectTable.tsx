import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from '../types/project';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import AddEditProjectModal from './AddEditProjectModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Toggle } from '@/components/ui/toggle';

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject: (updatedProject: Project) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectTable({
  projects,
  onUpdateProject,
  onDeleteProject
}: ProjectTableProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<{ id: string; value: number } | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null);
  const [editingRemarks, setEditingRemarks] = useState<{ id: string; value: string } | null>(null);
  const [editingCompletionPercentage, setEditingCompletionPercentage] = useState<{ id: string; value: number } | null>(null);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setDeletingProject(project);
    setDeleteModalOpen(true);
  };

  const handleSaveProject = (updatedData: Omit<Project, 'id'>) => {
    if (editingProject) {
      onUpdateProject({ ...editingProject, ...updatedData });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingProject) {
      onDeleteProject(deletingProject.id);
    }
  };

  const handleSaveBudget = () => {
    if (editingBudget) {
      const project = projects.find(p => p.id === editingBudget.id);
      if (project) {
        onUpdateProject({ ...project, budget: editingBudget.value });
      }
      setEditingBudget(null);
    }
  };

  const handleSaveRemarks = () => {
    if (editingRemarks) {
      const project = projects.find(p => p.id === editingRemarks.id);
      if (project) {
        onUpdateProject({ ...project, remarks: editingRemarks.value });
      }
      setEditingRemarks(null);
    }
  };
  
  const handleSaveCompletionPercentage = () => {
    if (editingCompletionPercentage) {
      const project = projects.find(p => p.id === editingCompletionPercentage.id);
      if (project) {
        onUpdateProject({ ...project, completionPercentage: editingCompletionPercentage.value });
      }
      setEditingCompletionPercentage(null);
    }
  };

  const handleSetMeeting = (id: string, date: Date | null) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      onUpdateProject({ ...project, nextMeeting: date });
    }
    setEditingMeeting(null);
  };
  
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'waiting': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-800">
          Projects Overview
        </h2>
        <div className="flex items-center gap-2">
          <Toggle 
            pressed={showDeleteButtons} 
            onPressedChange={setShowDeleteButtons}
            className="hover:bg-gray-100"
          >
            {showDeleteButtons ? 'Hide Delete' : 'Show Delete'}
          </Toggle>
        </div>
      </div>

      <div className="w-full bg-white shadow-lg rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[8%]">Client Country</TableHead>
              <TableHead className="w-[10%]">Client Name</TableHead>
              <TableHead className="w-[12%]">Project Name</TableHead>
              <TableHead className="w-[8%]">Assigned To</TableHead>
              <TableHead className="w-[8%]">Tech Stack</TableHead>
              <TableHead className="w-[8%]">Budget</TableHead>
              <TableHead className="w-[8%]">Milestone</TableHead>
              <TableHead className="w-[8%]">Status</TableHead>
              <TableHead className="w-[8%]">Completion %</TableHead>
              <TableHead className="w-[10%]">Remarks</TableHead>
              <TableHead className="w-[12%]">Start/End Date</TableHead>
              <TableHead className="w-[8%]">Next Action</TableHead>
              <TableHead className="w-[8%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="h-24 text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow 
                  key={project.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="whitespace-nowrap">{project.clientCountry}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{project.clientName}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-purple-700">{project.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{project.assignedTo}</TableCell>
                  <TableCell className="whitespace-nowrap">{project.techStack}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {editingBudget?.id === project.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={editingBudget.value}
                          onChange={(e) => setEditingBudget({ 
                            ...editingBudget, 
                            value: parseFloat(e.target.value) || 0 
                          })}
                          className="w-24"
                          onBlur={handleSaveBudget}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingBudget({ id: project.id, value: project.budget })}
                        className="hover:text-blue-500"
                      >
                        {formatCurrency(project.budget)}
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{project.milestone || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge 
                      variant="outline" 
                      className={cn("text-white", getStatusColor(project.status))}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {editingCompletionPercentage?.id === project.id ? (
                      <div className="flex flex-col gap-2 w-24">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editingCompletionPercentage.value}
                          onChange={(e) => setEditingCompletionPercentage({ 
                            ...editingCompletionPercentage, 
                            value: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                          })}
                          className="w-full"
                          onBlur={handleSaveCompletionPercentage}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveCompletionPercentage()}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingCompletionPercentage({ id: project.id, value: project.completionPercentage })}
                        className="hover:text-blue-500 w-full"
                      >
                        <div className="flex items-center gap-2">
                          <Progress value={project.completionPercentage} className="h-2 w-16" />
                          <span>{project.completionPercentage}%</span>
                        </div>
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {editingRemarks?.id === project.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingRemarks.value}
                          onChange={(e) => setEditingRemarks({ 
                            ...editingRemarks, 
                            value: e.target.value 
                          })}
                          onBlur={handleSaveRemarks}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRemarks()}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingRemarks({ id: project.id, value: project.remarks })}
                        className="text-left text-sm truncate hover:text-blue-500 max-w-[160px] block"
                        title={project.remarks}
                      >
                        {project.remarks || "Add remarks..."}
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-xs">
                      <span>From: {format(project.startDate, "MMM d, yyyy")}</span>
                      <br />
                      <span>
                        To: {project.endDate ? format(project.endDate, "MMM d, yyyy") : "Ongoing"}
                        {project.endDateNotes && (
                          <Popover>
                            <PopoverTrigger className="text-xs text-blue-500 ml-1 hover:underline">
                              (Notes)
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">{project.endDateNotes}</p>
                            </PopoverContent>
                          </Popover>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {project.nextAction || 
                      <span className="text-gray-400 text-sm">No action</span>
                    }
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {showDeleteButtons && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeleteClick(project)}
                          className="text-red-500 hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject || undefined}
        isEdit={true}
      />
      
      <DeleteConfirmModal
        project={deletingProject}
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
