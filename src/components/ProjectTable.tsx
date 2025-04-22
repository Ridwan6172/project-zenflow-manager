
import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash, Calendar } from 'lucide-react';
import { Project } from '../types/project';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

  const handleSetMeeting = (id: string, date: Date | null) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      onUpdateProject({ ...project, nextMeeting: date });
    }
    setEditingMeeting(null);
  };
  
  return (
    <>
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[180px]">Project Name</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead className="hidden md:table-cell">Next Meeting</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="hidden lg:table-cell">Start/End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.assignedTo}</TableCell>
                  <TableCell>
                    <div>
                      {project.clientName}
                      {project.clientAddress && (
                        <Popover>
                          <PopoverTrigger className="text-xs text-blue-500 block hover:underline">
                            View Address
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <p className="text-sm">{project.clientAddress}</p>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {editingMeeting === project.id ? (
                      <Popover open={true} onOpenChange={(open) => !open && setEditingMeeting(null)}>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3">
                            <CalendarComponent
                              mode="single"
                              selected={project.nextMeeting || undefined}
                              onSelect={(date) => handleSetMeeting(project.id, date)}
                              initialFocus
                              className="pointer-events-auto"
                            />
                            {project.nextMeeting && (
                              <div className="mt-4">
                                <Input
                                  type="time"
                                  defaultValue={project.nextMeeting ? format(project.nextMeeting, "HH:mm") : ""}
                                  onChange={(e) => {
                                    if (project.nextMeeting && e.target.value) {
                                      const [hours, minutes] = e.target.value.split(':');
                                      const newDate = new Date(project.nextMeeting);
                                      newDate.setHours(parseInt(hours), parseInt(minutes));
                                      handleSetMeeting(project.id, newDate);
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <button 
                        onClick={() => setEditingMeeting(project.id)}
                        className="flex items-center text-sm hover:text-blue-500"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        {project.nextMeeting 
                          ? format(project.nextMeeting, "MMM d, yyyy HH:mm") 
                          : "Schedule"}
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
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
                  <TableCell className="hidden lg:table-cell whitespace-nowrap">
                    <div className="text-xs">
                      <span>From: {format(project.startDate, "MMM d, yyyy")}</span>
                      <br />
                      <span>
                        To: {project.endDate ? format(project.endDate, "MMM d, yyyy") : "Ongoing"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Active' : 'Completed'}
                    </Badge>
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeleteClick(project)}
                        className="text-red-500 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Project Modal */}
      <AddEditProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject || undefined}
        isEdit={true}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        project={deletingProject}
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
