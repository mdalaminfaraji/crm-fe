import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InteractionType } from "../../services/interactionService";
import clientService, { Client } from "../../services/clientService";
import projectService, { Project } from "../../services/projectService";
import {
  SelectField,
  TextareaField,
  DatePickerField,
} from "../common";

export interface InteractionFormData {
  date: Date | string;
  type: InteractionType;
  notes?: string;
  clientId?: string;
  projectId?: string;
}

interface InteractionFormProps {
  onSubmit: (data: InteractionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<InteractionFormData>;
  isSubmitting?: boolean;
}

const InteractionForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isSubmitting = false,
}: InteractionFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InteractionFormData>({
    defaultValues: {
      ...initialData,
      date: initialData.date ? new Date(initialData.date as string) : new Date(),
      type: initialData.type || InteractionType.MEETING,
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

  const onFormSubmit = (data: InteractionFormData) => {
    const formattedData = {
      ...data,
      date: data.date instanceof Date
        ? data.date.toISOString().split("T")[0]
        : String(data.date),
    };
    
    onSubmit(formattedData);
  };
  
  const onError = (errors: Record<string, unknown>) => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onError)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <DatePickerField
            name="date"
            control={control}
            label="Date"
            error={errors.date}
            isRequired={true}
            placeholderText="Select interaction date"
          />
        </div>

        {/* Type */}
        <div>
          <SelectField
            name="type"
            control={control}
            label="Type"
            options={Object.values(InteractionType).map((type) => ({
              value: type,
              label: type,
            }))}
            placeholder="Select interaction type"
            error={errors.type}
            isRequired={true}
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

        {/* Notes */}
        <div className="md:col-span-2">
          <TextareaField
            name="notes"
            control={control}
            label="Notes"
            placeholder="Enter details about the interaction"
            error={errors.notes}
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

export default InteractionForm;
