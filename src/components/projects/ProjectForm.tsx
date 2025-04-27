import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clientService, { Client } from '../../services/clientService';
import { ProjectStatus } from '../../services/projectService';
import { DatePickerField } from '../common';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ProjectFormData>;
  isSubmitting?: boolean;
}

export interface ProjectFormData {
  title: string;
  description?: string;
  clientId: string;
  status: ProjectStatus;
  budget?: number;
  deadline?: string;
}

const ProjectForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isSubmitting = false,
}: ProjectFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: initialData,
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const response = await clientService.getAll();
        setClients(response.clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="label">
            Project Title <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              id="title"
              type="text"
              className="input"
              placeholder="Enter project title"
              {...register('title', {
                required: 'Project title is required',
              })}
            />
          </div>
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        {/* Client */}
        <div>
          <label htmlFor="clientId" className="label">
            Client <span className="text-red-500">*</span>
          </label>
          <div>
            <select
              id="clientId"
              className="input"
              disabled={isLoadingClients}
              {...register('clientId', { required: 'Client is required' })}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          {errors.clientId && <p className="error">{errors.clientId.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="label">
            Status <span className="text-red-500">*</span>
          </label>
          <div>
            <select
              id="status"
              className="input"
              {...register('status', { required: 'Status is required' })}
            >
              <option value={ProjectStatus.NOT_STARTED}>Not Started</option>
              <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
              <option value={ProjectStatus.ON_HOLD}>On Hold</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
              <option value={ProjectStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
          {errors.status && <p className="error">{errors.status.message}</p>}
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="label">
            Budget
          </label>
          <div>
            <input
              id="budget"
              type="number"
              step="0.01"
              min="0"
              className="input"
              placeholder="Enter budget amount"
              {...register('budget', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'Budget must be a positive number',
                },
              })}
            />
          </div>
          {errors.budget && <p className="error">{errors.budget.message}</p>}
        </div>

        {/* Deadline */}
        <div>
          <DatePickerField
            name="deadline"
            control={control}
            label="Deadline"
            error={errors.deadline}
            placeholderText="Select deadline date"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="label">
            Description
          </label>
          <div>
            <textarea
              id="description"
              rows={4}
              className="input"
              placeholder="Enter project description"
              {...register('description')}
            ></textarea>
          </div>
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData.title ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
