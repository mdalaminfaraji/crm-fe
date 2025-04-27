import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import clientService, { Client } from "../../services/clientService";
import projectService, { Project } from "../../services/projectService";
import {
  InputField,
  TextareaField,
  SelectField,
  DatePickerField,
} from "../common";

export interface ReminderFormData {
  title: string;
  description?: string;
  dueDate: Date | string;
  completed?: boolean;
  clientId?: string;
  projectId?: string;
}

interface ReminderFormProps {
  onSubmit: (data: ReminderFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ReminderFormData>;
  isSubmitting?: boolean;
}

const ReminderForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isSubmitting = false,
}: ReminderFormProps) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ReminderFormData>({
    defaultValues: {
      ...initialData,
      dueDate: initialData.dueDate
        ? new Date(initialData.dueDate as string)
        : new Date(),
      completed: initialData.completed || false,
    },
    mode: "onSubmit",
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch clients and projects for dropdowns
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const response = await clientService.getAll();
        setClients(response.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await projectService.getAll();
        setProjects(response.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchClients();
    fetchProjects();
  }, []);

  const onFormSubmit = (data: ReminderFormData) => {
    const formattedData = {
      ...data,
      dueDate:
        data.dueDate instanceof Date
          ? data.dueDate.toISOString().split("T")[0]
          : String(data.dueDate),
    };

    onSubmit(formattedData);
  };

  const onError = (errors: Record<string, unknown>) => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onError)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <InputField
            name="title"
            control={control}
            label="Title"
            placeholder="Enter reminder title"
            error={errors.title}
            isRequired={true}
          />
        </div>

        {/* Due Date */}
        <div>
          <DatePickerField
            name="dueDate"
            control={control}
            label="Due Date"
            error={errors.dueDate}
            isRequired={true}
            placeholderText="Select due date"
          />
        </div>

        {/* Client */}
        <div>
          <SelectField
            name="clientId"
            control={control}
            label="Client"
            options={clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))}
            placeholder="Select a client"
            error={errors.clientId}
            isLoading={isLoadingClients}
            loadingText="Loading clients..."
          />
        </div>

        {/* Project */}
        <div>
          <SelectField
            name="projectId"
            control={control}
            label="Project"
            options={projects.map((project) => ({
              value: project.id,
              label: project.title,
            }))}
            placeholder="Select a project"
            error={errors.projectId}
            isLoading={isLoadingProjects}
            loadingText="Loading projects..."
          />
        </div>

        {/* Completed */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            {...register("completed")}
          />
          <label
            htmlFor="completed"
            className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Mark as completed
          </label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <TextareaField
            name="description"
            control={control}
            label="Description"
            placeholder="Enter reminder details"
            error={errors.description}
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;
