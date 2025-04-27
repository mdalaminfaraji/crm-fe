import { useEffect, useCallback } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiX,
  FiCalendar,
  FiCheck,
  FiClock,
  FiUsers,
  FiFolder,
} from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ReminderForm, { ReminderFormData } from '../components/reminders/ReminderForm';
import reminderService, {
  Reminder as ReminderType,
  ReminderSearchParams,
  PaginationData,
} from '../services/reminderService';
import Pagination from '../components/common/Pagination';
import useDebounce from '../hooks/useDebounce';
import { useImmerReducer } from 'use-immer';
import { formatDate } from '../utils/formatters';
import Swal from 'sweetalert2';

// Action types
type RemindersAction =
  | { type: 'FETCH_REMINDERS_START' }
  | {
      type: 'FETCH_REMINDERS_SUCCESS';
      payload: { reminders: ReminderType[]; pagination: PaginationData };
    }
  | { type: 'FETCH_REMINDERS_ERROR'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_COMPLETED_FILTER'; payload: string }
  | { type: 'SET_DUE_THIS_WEEK_FILTER'; payload: boolean }
  | { type: 'SET_PAGINATION'; payload: PaginationData }
  | { type: 'TOGGLE_MODAL'; payload?: ReminderType }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'ADD_REMINDER'; payload: ReminderType }
  | { type: 'UPDATE_REMINDER'; payload: ReminderType }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'TOGGLE_REMINDER_COMPLETED'; payload: { id: string; completed: boolean } };

// State interface
interface RemindersState {
  reminders: ReminderType[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  completedFilter: string;
  dueThisWeekFilter: boolean;
  pagination: PaginationData;
  isModalOpen: boolean;
  currentReminder: ReminderType | null;
  isSubmitting: boolean;
}

// Initial state
const initialState: RemindersState = {
  reminders: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  completedFilter: '',
  dueThisWeekFilter: false,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isModalOpen: false,
  currentReminder: null,
  isSubmitting: false,
};

// Reducer function
const remindersReducer = (draft: RemindersState, action: RemindersAction) => {
  switch (action.type) {
    case 'FETCH_REMINDERS_START':
      draft.isLoading = true;
      draft.error = null;
      break;
    case 'FETCH_REMINDERS_SUCCESS':
      draft.isLoading = false;
      draft.reminders = action.payload.reminders;
      draft.pagination = action.payload.pagination;
      break;
    case 'FETCH_REMINDERS_ERROR':
      draft.isLoading = false;
      draft.error = action.payload;
      break;
    case 'SET_SEARCH_TERM':
      draft.searchTerm = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case 'SET_COMPLETED_FILTER':
      draft.completedFilter = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case 'SET_DUE_THIS_WEEK_FILTER':
      draft.dueThisWeekFilter = action.payload;
      if (draft.pagination.page !== 1) {
        draft.pagination.page = 1;
      }
      break;
    case 'SET_PAGINATION':
      draft.pagination = action.payload;
      break;
    case 'TOGGLE_MODAL':
      draft.isModalOpen = !draft.isModalOpen;
      draft.currentReminder = action.payload || null;
      break;
    case 'SET_SUBMITTING':
      draft.isSubmitting = action.payload;
      break;
    case 'ADD_REMINDER':
      draft.reminders.unshift(action.payload);
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    case 'UPDATE_REMINDER': {
      const index = draft.reminders.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        draft.reminders[index] = action.payload;
      }
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    }
    case 'DELETE_REMINDER':
      draft.reminders = draft.reminders.filter((r) => r.id !== action.payload);
      break;
    case 'TOGGLE_REMINDER_COMPLETED': {
      const index = draft.reminders.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        draft.reminders[index].completed = action.payload.completed;
      }
      break;
    }
    default:
      break;
  }
};

const Reminders = () => {
  // Use immer reducer for state management
  const [state, dispatch] = useImmerReducer(remindersReducer, initialState);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(state.searchTerm, 500);

  // Fetch reminders data with search, filter, and pagination
  const fetchReminders = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_REMINDERS_START' });

      const searchParams: ReminderSearchParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: debouncedSearchTerm,
        dueThisWeek: state.dueThisWeekFilter || undefined,
        completed:
          state.completedFilter === 'completed'
            ? true
            : state.completedFilter === 'pending'
              ? false
              : undefined,
        sortBy: 'dueDate',
        sortOrder: 'asc',
      };

      const response = await reminderService.getAll(searchParams);

      dispatch({
        type: 'FETCH_REMINDERS_SUCCESS',
        payload: {
          reminders: response.reminders,
          pagination: response.pagination || state.pagination,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reminders';
      dispatch({ type: 'FETCH_REMINDERS_ERROR', payload: errorMessage });
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch reminders',
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }, [
    dispatch,
    state.pagination.page,
    state.pagination.limit,
    debouncedSearchTerm,
    state.completedFilter,
    state.dueThisWeekFilter,
  ]);

  // Load reminders when search term, filters or pagination changes
  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  };

  // Clear search
  const handleClearSearch = () => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
  };

  // Handle completed filter change
  const handleCompletedFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_COMPLETED_FILTER', payload: e.target.value });
  };

  // Handle due this week filter toggle
  const handleDueThisWeekToggle = () => {
    dispatch({
      type: 'SET_DUE_THIS_WEEK_FILTER',
      payload: !state.dueThisWeekFilter,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newPagination = { ...state.pagination, page };
    dispatch({ type: 'SET_PAGINATION', payload: newPagination });
  };

  // Handle opening the modal for adding a new reminder
  const handleAddReminder = () => {
    dispatch({ type: 'TOGGLE_MODAL' });
  };

  // Handle opening the modal for editing an existing reminder
  const handleEditReminder = (reminder: ReminderType) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: reminder });
  };

  // Handle form submission
  const handleSubmitReminder = async (data: ReminderFormData) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      // Convert Date object to string if it's a Date
      const formattedData = {
        ...data,
        dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate
      };

      if (state.currentReminder) {
        // Update existing reminder
        const response = await reminderService.update(state.currentReminder.id, formattedData);

        dispatch({ type: 'UPDATE_REMINDER', payload: response.reminder });

        Swal.fire({
          icon: 'success',
          title: 'Reminder updated successfully',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Create new reminder
        const response = await reminderService.create(formattedData);

        dispatch({ type: 'ADD_REMINDER', payload: response.reminder });

        Swal.fire({
          icon: 'success',
          title: 'Reminder created successfully',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Operation failed';
      Swal.fire({
        icon: 'error',
        title: 'Operation failed',
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
      console.error('Error submitting reminder:', error);
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  // Handle reminder deletion
  const handleDeleteReminder = async (id: string) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await reminderService.delete(id);

          dispatch({ type: 'DELETE_REMINDER', payload: id });

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Reminder deleted successfully.',
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete reminder';
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete reminder',
            text: errorMessage,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  // Handle toggling reminder completion status
  const handleToggleCompleted = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      await reminderService.update(id, { completed: newStatus });

      dispatch({
        type: 'TOGGLE_REMINDER_COMPLETED',
        payload: { id, completed: newStatus },
      });

      Swal.fire({
        icon: 'success',
        title: newStatus ? 'Reminder marked as completed' : 'Reminder marked as pending',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update reminder status';
      Swal.fire({
        icon: 'error',
        title: 'Failed to update reminder status',
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Calculate if a reminder is overdue
  const isOverdue = (dueDate: string, completed: boolean): boolean => {
    if (completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminderDate = new Date(dueDate);
    reminderDate.setHours(0, 0, 0, 0);
    return reminderDate < today;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <button
          onClick={handleAddReminder}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" /> Add Reminder
        </button>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reminders by title or description..."
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
        <div className="relative md:col-span-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="text-gray-400" />
          </div>
          <select
            className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.completedFilter}
            onChange={handleCompletedFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <button
            onClick={handleDueThisWeekToggle}
            className={`flex items-center justify-center w-full py-2 px-4 border rounded-md transition-colors ${
              state.dueThisWeekFilter
                ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <FiClock className="mr-2" /> Due This Week
          </button>
        </div>
      </div>

      {/* Reminders list */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {state.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : state.error ? (
          <div className="p-6 text-center text-red-500">{state.error}</div>
        ) : state.reminders.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No reminders found. Create your first reminder by clicking the "Add Reminder" button.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Related To
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {state.reminders.map((reminder) => (
                    <tr
                      key={reminder.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        isOverdue(reminder.dueDate, reminder.completed)
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleCompleted(reminder.id, reminder.completed)}
                          className={`p-1 rounded-full ${
                            reminder.completed
                              ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                              : 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700'
                          }`}
                        >
                          <FiCheck className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {reminder.title}
                        </div>
                        {reminder.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {reminder.description}
                          </div>
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isOverdue(reminder.dueDate, reminder.completed)
                            ? 'text-red-600 dark:text-red-400 font-medium'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          {formatDate(reminder.dueDate)}
                          {isOverdue(reminder.dueDate, reminder.completed) && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {reminder.clientId && (
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <FiUsers className="mr-1" />
                            {reminder.clientName || 'Client'}
                          </div>
                        )}
                        {reminder.projectId && (
                          <div className="flex items-center text-green-600 dark:text-green-400 mt-1">
                            <FiFolder className="mr-1" />
                            {reminder.projectTitle || 'Project'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                          onClick={() => handleEditReminder(reminder)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          onClick={() => handleDeleteReminder(reminder.id)}
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
            {!state.isLoading && !state.error && state.reminders.length > 0 && (
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

      {/* Reminder Form Modal */}
      <Modal
        isOpen={state.isModalOpen}
        onClose={() => dispatch({ type: 'TOGGLE_MODAL' })}
        title={state.currentReminder ? 'Edit Reminder' : 'Add New Reminder'}
      >
        <ReminderForm
          onSubmit={handleSubmitReminder}
          onCancel={() => dispatch({ type: 'TOGGLE_MODAL' })}
          initialData={state.currentReminder || {}}
          isSubmitting={state.isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Reminders;
