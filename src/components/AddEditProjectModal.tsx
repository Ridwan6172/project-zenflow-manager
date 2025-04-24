
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Project, ProjectFormData } from '../types/project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectFormData) => void;
  project?: Project;
  isEdit?: boolean;
}

const initialFormData: ProjectFormData = {
  name: '',
  assignedTo: '',
  clientName: '',
  clientAddress: '',
  clientCountry: '',
  techStack: '',
  milestone: '',
  nextAction: '',
  nextMeeting: null,
  budget: 0,
  startDate: new Date(),
  endDate: null,
  endDateNotes: '',
  remarks: '',
  status: 'active',
  completionPercentage: 0,
};

export default function AddEditProjectModal({
  isOpen,
  onClose,
  onSave,
  project,
  isEdit = false,
}: AddEditProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  useEffect(() => {
    if (project && isEdit) {
      setFormData(project);
    } else {
      setFormData(initialFormData);
    }
  }, [project, isEdit, isOpen]);

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user edits the field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    
    if (!formData.name) newErrors.name = 'Project name is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assigned person is required';
    if (!formData.clientName) newErrors.clientName = 'Client name is required';
    if (formData.budget < 0) newErrors.budget = 'Budget cannot be negative';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.completionPercentage < 0 || formData.completionPercentage > 100)
      newErrors.completionPercentage = 'Completion percentage must be between 0 and 100';
    
    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      toast.success(`Project ${isEdit ? 'updated' : 'created'} successfully!`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the project details below.' 
              : 'Fill in the project details below to create a new project.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Client Country & Client Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientCountry">Client Country</Label>
              <Input
                id="clientCountry"
                value={formData.clientCountry}
                onChange={(e) => handleChange('clientCountry', e.target.value)}
                placeholder="Enter client country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name*</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Enter client name"
                className={errors.clientName ? 'border-red-500' : ''}
              />
              {errors.clientName && <p className="text-sm text-red-500">{errors.clientName}</p>}
            </div>
          </div>

          {/* Client Address */}
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => handleChange('clientAddress', e.target.value)}
              placeholder="Enter client address"
            />
          </div>

          {/* Project Name & Assigned To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter project name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To*</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
                placeholder="Enter person's name"
                className={errors.assignedTo ? 'border-red-500' : ''}
              />
              {errors.assignedTo && <p className="text-sm text-red-500">{errors.assignedTo}</p>}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack</Label>
            <Input
              id="techStack"
              value={formData.techStack}
              onChange={(e) => handleChange('techStack', e.target.value)}
              placeholder="Enter tech stack (e.g., React, Node.js, PostgreSQL)"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)*</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
              placeholder="Enter budget amount"
              className={errors.budget ? 'border-red-500' : ''}
            />
            {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
          </div>

          {/* Milestone */}
          <div className="space-y-2">
            <Label htmlFor="milestone">Milestone</Label>
            <Input
              id="milestone"
              value={formData.milestone}
              onChange={(e) => handleChange('milestone', e.target.value)}
              placeholder="Enter current milestone"
            />
          </div>

          {/* Status & Completion Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'completed' | 'waiting' | 'cancelled') => 
                  handleChange('status', value)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completionPercentage">Completion Percentage: {formData.completionPercentage}%</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="completionPercentage"
                  value={[formData.completionPercentage]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => handleChange('completionPercentage', values[0])}
                  className={errors.completionPercentage ? 'border-red-500' : ''}
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.completionPercentage}
                  onChange={(e) => handleChange('completionPercentage', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16"
                />
              </div>
              {errors.completionPercentage && (
                <p className="text-sm text-red-500">{errors.completionPercentage}</p>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Add any notes or remarks"
              rows={3}
            />
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP")
                    ) : (
                      <span>Select start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={(date) => handleChange('startDate', date || new Date())}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP")
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => handleChange('endDate', date)}
                    fromDate={formData.startDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          {/* End Date Notes */}
          <div className="space-y-2">
            <Label htmlFor="endDateNotes">End Date Notes</Label>
            <Input
              id="endDateNotes"
              value={formData.endDateNotes}
              onChange={(e) => handleChange('endDateNotes', e.target.value)}
              placeholder="Add notes about end date"
            />
          </div>

          {/* Next Action */}
          <div className="space-y-2">
            <Label htmlFor="nextAction">Next Action</Label>
            <Input
              id="nextAction"
              value={formData.nextAction}
              onChange={(e) => handleChange('nextAction', e.target.value)}
              placeholder="Enter next action"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
