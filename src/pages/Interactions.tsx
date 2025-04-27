import { useEffect, useCallback } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiX,
  FiPhone,
  FiMail,
  FiUsers,
  FiFolder,
} from "react-icons/fi";
import Modal from "../components/common/Modal";
import InteractionForm, {
  InteractionFormData,
} from "../components/interactions/InteractionForm";
import interactionService, {
  Interaction as InteractionType,
  InteractionType as InteractionTypeEnum,
} from "../services/interactionService";
import Pagination from "../components/common/Pagination";
import useDebounce from "../hooks/useDebounce";
import { useImmerReducer } from "use-immer";
import { formatDate } from "../utils/formatters";
import Swal from "sweetalert2";

// Define pagination data interface
interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Define search parameters interface
interface InteractionSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: InteractionTypeEnum;
  clientId?: string;
  projectId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Action types
type InteractionsAction =
  | { type: "FETCH_INTERACTIONS_START" }
  | {
      type: "FETCH_INTERACTIONS_SUCCESS";
      payload: { interactions: InteractionType[]; pagination: PaginationData };
    }
  | { type: "FETCH_INTERACTIONS_ERROR"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_TYPE_FILTER"; payload: string }
  | { type: "SET_PAGINATION"; payload: PaginationData }
  | { type: "TOGGLE_MODAL"; payload?: InteractionType }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "ADD_INTERACTION"; payload: InteractionType }
  | { type: "UPDATE_INTERACTION"; payload: InteractionType }
  | { type: "DELETE_INTERACTION"; payload: string };

// State interface
interface InteractionsState {
  interactions: InteractionType[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  typeFilter: string;
  pagination: PaginationData;
  isModalOpen: boolean;
  currentInteraction: InteractionType | null;
  isSubmitting: boolean;
}

// Initial state
const initialState: InteractionsState = {
  interactions: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  typeFilter: "",
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isModalOpen: false,
  currentInteraction: null,
  isSubmitting: false,
};

// Reducer function
const interactionsReducer = (
  draft: InteractionsState,
  action: InteractionsAction
) => {
  switch (action.type) {
    case "FETCH_INTERACTIONS_START":
      draft.isLoading = true;
      draft.error = null;
      break;
    case "FETCH_INTERACTIONS_SUCCESS":
      draft.isLoading = false;
      draft.interactions = action.payload.interactions;
      draft.pagination = action.payload.pagination;
      break;
    case "FETCH_INTERACTIONS_ERROR":
      draft.isLoading = false;
      draft.error = action.payload;
      break;
    case "SET_SEARCH_TERM":
      draft.searchTerm = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case "SET_TYPE_FILTER":
      draft.typeFilter = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case "SET_PAGINATION":
      draft.pagination = action.payload;
      break;
    case "TOGGLE_MODAL":
      draft.isModalOpen = !draft.isModalOpen;
      draft.currentInteraction = action.payload || null;
      break;
    case "SET_SUBMITTING":
      draft.isSubmitting = action.payload;
      break;
    case "ADD_INTERACTION":
      draft.interactions.unshift(action.payload);
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    case "UPDATE_INTERACTION": {
      const index = draft.interactions.findIndex(
        (i) => i.id === action.payload.id
      );
      if (index !== -1) {
        draft.interactions[index] = action.payload;
      }
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    }
    case "DELETE_INTERACTION":
      draft.interactions = draft.interactions.filter(
        (i) => i.id !== action.payload
      );
      break;
    default:
      break;
  }
};

const Interactions = () => {
  // Use immer reducer for state management
  const [state, dispatch] = useImmerReducer(interactionsReducer, initialState);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(state.searchTerm, 500);

  // Memoize pagination values to avoid reference issues
  const paginationPage = state.pagination.page;
  const paginationLimit = state.pagination.limit;

  // Fetch interactions data with search, filter, and pagination
  const fetchInteractions = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_INTERACTIONS_START" });

      const searchParams: InteractionSearchParams = {
        page: paginationPage,
        limit: paginationLimit,
        search: debouncedSearchTerm,
        type: state.typeFilter as InteractionTypeEnum || undefined,
        sortBy: "date",
        sortOrder: "desc",
      };

      const response = await interactionService.getAll(searchParams);

      dispatch({
        type: "FETCH_INTERACTIONS_SUCCESS",
        payload: {
          interactions: response.interactions,
          pagination: response.pagination || state.pagination,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch interactions";
      dispatch({ type: "FETCH_INTERACTIONS_ERROR", payload: errorMessage });
      Swal.fire({
        icon: "error",
        title: "Failed to fetch interactions",
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }, [
    dispatch,
    paginationPage,
    paginationLimit,
    debouncedSearchTerm,
    state.typeFilter,
  ]);

  // Load interactions when component mounts and when dependencies change
  useEffect(() => {
    fetchInteractions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, state.typeFilter, paginationPage, paginationLimit]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  // Clear search
  const handleClearSearch = () => {
    dispatch({ type: "SET_SEARCH_TERM", payload: "" });
  };

  // Handle type filter change
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_TYPE_FILTER", payload: e.target.value });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newPagination = { ...state.pagination, page };
    dispatch({ type: "SET_PAGINATION", payload: newPagination });
  };

  // Handle opening the modal for adding a new interaction
  const handleAddInteraction = () => {
    dispatch({ type: "TOGGLE_MODAL" });
  };

  // Handle opening the modal for editing an existing interaction
  const handleEditInteraction = (interaction: InteractionType) => {
    dispatch({ type: "TOGGLE_MODAL", payload: interaction });
  };

  // Handle form submission
  const handleSubmitInteraction = async (data: InteractionFormData) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });

    try {
      if (state.currentInteraction) {
        // Update existing interaction
        const response = await interactionService.update(
          state.currentInteraction.id,
          data
        );

        dispatch({ type: "UPDATE_INTERACTION", payload: response.interaction });

        Swal.fire({
          icon: "success",
          title: "Interaction updated successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Create new interaction
        const response = await interactionService.create(data);

        dispatch({ type: "ADD_INTERACTION", payload: response.interaction });

        Swal.fire({
          icon: "success",
          title: "Interaction created successfully",
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
      console.error("Error submitting interaction:", error);
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  // Handle interaction deletion
  const handleDeleteInteraction = async (id: string) => {
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
          await interactionService.delete(id);

          dispatch({ type: "DELETE_INTERACTION", payload: id });

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Interaction deleted successfully.",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to delete interaction";
          Swal.fire({
            icon: "error",
            title: "Failed to delete interaction",
            text: errorMessage,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  // Get interaction type icon
  const getInteractionTypeIcon = (type: string) => {
    switch (type) {
      case InteractionTypeEnum.CALL:
        return <FiPhone className="mr-1" />;
      case InteractionTypeEnum.EMAIL:
        return <FiMail className="mr-1" />;
      case InteractionTypeEnum.MEETING:
        return <FiUsers className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interactions</h1>
        <button
          onClick={handleAddInteraction}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" /> Add Interaction
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
            placeholder="Search interactions by notes..."
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
            value={state.typeFilter}
            onChange={handleTypeFilterChange}
          >
            <option value="">All Types</option>
            {Object.values(InteractionTypeEnum).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactions list */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {state.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : state.error ? (
          <div className="p-6 text-center text-red-500">{state.error}</div>
        ) : state.interactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No interactions found. Create your first interaction by clicking the
            "Add Interaction" button.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client/Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {state.interactions.map((interaction) => (
                    <tr
                      key={interaction.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(interaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center text-sm font-medium">
                          {getInteractionTypeIcon(interaction.type)}
                          {interaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {interaction.clientId && (
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <FiUsers className="mr-1" />
                            {interaction.clientName || "Client"}
                          </div>
                        )}
                        {interaction.projectId && (
                          <div className="flex items-center text-green-600 dark:text-green-400 mt-1">
                            <FiFolder className="mr-1" />
                            {interaction.projectTitle || "Project"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="max-w-xs truncate">
                          {interaction.notes || "No notes"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                          onClick={() => handleEditInteraction(interaction)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          onClick={() =>
                            handleDeleteInteraction(interaction.id)
                          }
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
            {!state.isLoading && !state.error && state.interactions.length > 0 && (
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

      {/* Interaction Form Modal */}
      <Modal
        isOpen={state.isModalOpen}
        onClose={() => dispatch({ type: "TOGGLE_MODAL" })}
        title={
          state.currentInteraction ? "Edit Interaction" : "Add New Interaction"
        }
      >
        <InteractionForm
          onSubmit={handleSubmitInteraction}
          onCancel={() => dispatch({ type: "TOGGLE_MODAL" })}
          initialData={state.currentInteraction || {}}
          isSubmitting={state.isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Interactions;
