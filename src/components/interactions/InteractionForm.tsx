import { useState, useEffect } from "react";
import { InteractionType } from "../../services/interactionService";
import clientService, { Client } from "../../services/clientService";
import projectService, { Project } from "../../services/projectService";

export interface InteractionFormData {
  date?: string;
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
  const [formData, setFormData] = useState<InteractionFormData>({
    date: initialData.date || new Date().toISOString().split("T")[0],
    type: initialData.type || InteractionType.MEETING,
    notes: initialData.notes || "",
    clientId: initialData.clientId || "",
    projectId: initialData.projectId || "",
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        >
          {Object.values(InteractionType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="clientId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Client
        </label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select a client (optional)</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {isLoadingClients && (
          <p className="text-sm text-gray-500">Loading clients...</p>
        )}
      </div>

      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Project
        </label>
        <select
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select a project (optional)</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {isLoadingProjects && (
          <p className="text-sm text-gray-500">Loading projects...</p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default InteractionForm;
