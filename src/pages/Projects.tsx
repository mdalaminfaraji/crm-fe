import { useEffect, useCallback } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";
import Modal from "../components/common/Modal";
import ProjectForm, {
  ProjectFormData,
} from "../components/projects/ProjectForm";
import projectService, {
  Project as ProjectType,
  ProjectStatus,
  ProjectSearchParams,
  PaginationData,
} from "../services/projectService";
import Pagination from "../components/common/Pagination";
import useDebounce from "../hooks/useDebounce";
import { useImmerReducer } from "use-immer";
import Swal from "sweetalert2";

// State interface
interface ProjectsState {
  projects: ProjectType[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  isModalOpen: boolean;
  isSubmitting: boolean;
  currentProject: ProjectType | null;
  pagination: PaginationData;
}

// Action types
type ProjectsAction =
  | { type: "FETCH_PROJECTS_START" }
  | {
      type: "FETCH_PROJECTS_SUCCESS";
      payload: { projects: ProjectType[]; pagination: PaginationData };
    }
  | { type: "FETCH_PROJECTS_ERROR"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: string }
  | { type: "TOGGLE_MODAL"; payload?: ProjectType | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "ADD_PROJECT"; payload: ProjectType }
  | { type: "UPDATE_PROJECT"; payload: ProjectType }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_PAGINATION"; payload: PaginationData };

// Initial state
const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  statusFilter: "",
  isModalOpen: false,
  isSubmitting: false,
  currentProject: null,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// Reducer function
const projectsReducer = (draft: ProjectsState, action: ProjectsAction) => {
  switch (action.type) {
    case "FETCH_PROJECTS_START":
      draft.isLoading = true;
      draft.error = null;
      break;
    case "FETCH_PROJECTS_SUCCESS":
      draft.projects = action.payload.projects;
      draft.pagination = action.payload.pagination;
      draft.isLoading = false;
      break;
    case "FETCH_PROJECTS_ERROR":
      draft.error = action.payload;
      draft.isLoading = false;
      break;
    case "SET_SEARCH_TERM":
      draft.searchTerm = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case "SET_STATUS_FILTER":
      draft.statusFilter = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case "SET_PAGINATION":
      draft.pagination = action.payload;
      break;
    case "TOGGLE_MODAL":
      draft.isModalOpen = !draft.isModalOpen;
      draft.currentProject = action.payload || null;
      break;
    case "SET_SUBMITTING":
      draft.isSubmitting = action.payload;
      break;
    case "ADD_PROJECT":
      draft.projects.unshift(action.payload);
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    case "UPDATE_PROJECT": {
      const index = draft.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        draft.projects[index] = action.payload;
      }
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    }
    case "DELETE_PROJECT":
      draft.projects = draft.projects.filter((p) => p.id !== action.payload);
      break;
    default:
      break;
  }
};

const Projects = () => {
  // Use immer reducer for state management
  const [state, dispatch] = useImmerReducer(projectsReducer, initialState);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(state.searchTerm, 500);

  // Fetch projects with search and pagination
  // Memoize pagination values to avoid reference issues
  const paginationPage = state.pagination.page;
  const paginationLimit = state.pagination.limit;
  
  const fetchProjects = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_PROJECTS_START" });

      const searchParams: ProjectSearchParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: debouncedSearchTerm,
        status: (state.statusFilter as ProjectStatus) || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const response = await projectService.getAll(searchParams);

      dispatch({
        type: "FETCH_PROJECTS_SUCCESS",
        payload: {
          projects: response.projects,
          pagination: response.pagination || state.pagination,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch projects";
      dispatch({ type: "FETCH_PROJECTS_ERROR", payload: errorMessage });
      Swal.fire({
        icon: "error",
        title: "Failed to fetch projects",
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }, [dispatch, paginationPage, paginationLimit, debouncedSearchTerm, state.statusFilter]);

  // Load projects when component mounts and when dependencies change
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, state.statusFilter, paginationPage, paginationLimit]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency for display
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  // Clear search
  const handleClearSearch = () => {
    dispatch({ type: "SET_SEARCH_TERM", payload: "" });
  };

  // Handle status filter change
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch({ type: "SET_STATUS_FILTER", payload: e.target.value });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newPagination = { ...state.pagination, page };
    dispatch({ type: "SET_PAGINATION", payload: newPagination });
  };

  // Handle opening the modal for adding a new project
  const handleAddProject = () => {
    dispatch({ type: "TOGGLE_MODAL" });
  };

  // Handle opening the modal for editing an existing project
  const handleEditProject = (project: ProjectType) => {
    dispatch({ type: "TOGGLE_MODAL", payload: project });
  };

  // Handle form submission
  const handleSubmitProject = async (data: ProjectFormData) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });

    try {
      if (state.currentProject) {
        // Update existing project
        const response = await projectService.update(
          state.currentProject.id,
          data
        );

        dispatch({ type: "UPDATE_PROJECT", payload: response.project });

        Swal.fire({
          icon: "success",
          title: "Project updated successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Create new project
        const response = await projectService.create(data);

        dispatch({ type: "ADD_PROJECT", payload: response.project });

        Swal.fire({
          icon: "success",
          title: "Project created successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Operation failed";
      Swal.fire({
        icon: "error",
        title: "Operation failed",
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
      console.error("Error submitting project:", error);
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (id: string) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await projectService.delete(id);

          dispatch({ type: "DELETE_PROJECT", payload: id });

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Project deleted successfully.",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete project";
          Swal.fire({
            icon: "error",
            title: "Failed to delete project",
            text: errorMessage,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={handleAddProject}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" /> Add Project
        </button>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.searchTerm}
            onChange={handleSearchChange}
          />
          {state.searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={handleClearSearch}
            >
              <FiX className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="text-gray-400" />
          </div>
          <select
            className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All Statuses</option>
            <option value={ProjectStatus.NOT_STARTED}>Not Started</option>
            <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
            <option value={ProjectStatus.ON_HOLD}>On Hold</option>
            <option value={ProjectStatus.COMPLETED}>Completed</option>
            <option value={ProjectStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Project table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {state.isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading projects...
            </p>
          </div>
        ) : state.error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{state.error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : state.projects.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {state.searchTerm || state.statusFilter
                ? `No projects found matching your criteria. Try different search terms or filters or`
                : "No projects found."}
              <button
                onClick={handleAddProject}
                className="text-blue-500 hover:underline ml-1"
              >
                add a new project
              </button>
              .
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {state.projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </div>
                        {project.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(project.budget)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {formatStatus(project.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(project.budget)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {project.deadline ? formatDate(project.deadline) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                          onClick={() => handleEditProject(project)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!state.isLoading && !state.error && state.projects.length > 0 && (
              <Pagination
                currentPage={state.pagination.page}
                totalPages={state.pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={state.pagination.totalCount}
                itemsPerPage={state.pagination.limit}
              />
            )}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <Modal
        isOpen={state.isModalOpen}
        onClose={() => dispatch({ type: "TOGGLE_MODAL" })}
        title={state.currentProject ? "Edit Project" : "Add New Project"}
      >
        <ProjectForm
          onSubmit={handleSubmitProject}
          onCancel={() => dispatch({ type: "TOGGLE_MODAL" })}
          initialData={state.currentProject || {}}
          isSubmitting={state.isSubmitting}
        />
      </Modal>
    </div>
  );
};
// Helper functions for formatting
const formatStatus = (status: string): string => {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "Not Started";
    case ProjectStatus.IN_PROGRESS:
      return "In Progress";
    case ProjectStatus.ON_HOLD:
      return "On Hold";
    case ProjectStatus.COMPLETED:
      return "Completed";
    case ProjectStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    case ProjectStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case ProjectStatus.ON_HOLD:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case ProjectStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case ProjectStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default Projects;
