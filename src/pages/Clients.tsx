import { useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Modal from "../components/common/Modal";
import ClientForm, { ClientFormData } from "../components/clients/ClientForm";
import clientService, { Client as ClientType } from "../services/clientService";
import { useImmerReducer } from "use-immer";
import Swal from "sweetalert2";

// State interface
interface ClientsState {
  clients: ClientType[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  isModalOpen: boolean;
  isSubmitting: boolean;
  currentClient: ClientType | null;
}

// Action types
type ClientsAction =
  | { type: "FETCH_CLIENTS_START" }
  | { type: "FETCH_CLIENTS_SUCCESS"; payload: ClientType[] }
  | { type: "FETCH_CLIENTS_ERROR"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "TOGGLE_MODAL"; payload?: ClientType | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "ADD_CLIENT"; payload: ClientType }
  | { type: "UPDATE_CLIENT"; payload: ClientType }
  | { type: "DELETE_CLIENT"; payload: string };

// Initial state
const initialState: ClientsState = {
  clients: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  isModalOpen: false,
  isSubmitting: false,
  currentClient: null,
};

// Reducer function
const clientsReducer = (draft: ClientsState, action: ClientsAction) => {
  switch (action.type) {
    case "FETCH_CLIENTS_START":
      draft.isLoading = true;
      draft.error = null;
      break;
    case "FETCH_CLIENTS_SUCCESS":
      draft.clients = action.payload;
      draft.isLoading = false;
      break;
    case "FETCH_CLIENTS_ERROR":
      draft.error = action.payload;
      draft.isLoading = false;
      break;
    case "SET_SEARCH_TERM":
      draft.searchTerm = action.payload;
      break;
    case "TOGGLE_MODAL":
      draft.isModalOpen = !draft.isModalOpen;
      draft.currentClient = action.payload || null;
      break;
    case "SET_SUBMITTING":
      draft.isSubmitting = action.payload;
      break;
    case "ADD_CLIENT":
      draft.clients.unshift(action.payload);
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    case "UPDATE_CLIENT": {
      const index = draft.clients.findIndex(
        (client) => client.id === action.payload.id
      );
      if (index !== -1) {
        draft.clients[index] = action.payload;
      }
      draft.isModalOpen = false;
      draft.isSubmitting = false;
      break;
    }
    case "DELETE_CLIENT":
      draft.clients = draft.clients.filter(
        (client) => client.id !== action.payload
      );
      break;
  }
};

const Clients = () => {
  // Use immer reducer for state management
  const [state, dispatch] = useImmerReducer(clientsReducer, initialState);

  // Fetch clients data
  const fetchClients = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_CLIENTS_START" });
      const response = await clientService.getAll();
      dispatch({ type: "FETCH_CLIENTS_SUCCESS", payload: response.clients });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch clients";
      dispatch({ type: "FETCH_CLIENTS_ERROR", payload: errorMessage });
      Swal.fire({
        icon: "error",
        title: "Failed to fetch clients",
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }, [dispatch]);

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter clients based on search term
  const filteredClients = state.clients.filter(
    (client) =>
      client.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      (client.company &&
        client.company.toLowerCase().includes(state.searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  // Handle opening the modal for adding a new client
  const handleAddClient = () => {
    dispatch({ type: "TOGGLE_MODAL" });
  };

  // Handle opening the modal for editing an existing client
  const handleEditClient = (client: ClientType) => {
    dispatch({ type: "TOGGLE_MODAL", payload: client });
  };

  // Handle form submission
  const handleSubmitClient = async (data: ClientFormData) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });

    try {
      if (state.currentClient) {
        // Update existing client
        const response = await clientService.update(
          state.currentClient.id,
          data
        );

        dispatch({ type: "UPDATE_CLIENT", payload: response.client });

        Swal.fire({
          icon: "success",
          title: "Client updated successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Create new client
        const response = await clientService.create(data);

        dispatch({ type: "ADD_CLIENT", payload: response.client });

        Swal.fire({
          icon: "success",
          title: "Client created successfully",
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
      console.error("Error submitting client:", error);
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  // Handle client deletion after confirmation
  const handleDeleteClient = async (id: string) => {
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
          await clientService.delete(id);

          dispatch({ type: "DELETE_CLIENT", payload: id });

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Client deleted successfully.",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete client";
          Swal.fire({
            icon: "error",
            title: "Failed to delete client",
            text: errorMessage,
            showConfirmButton: false,
            timer: 2000,
          });
        } finally {
          dispatch({ type: "TOGGLE_MODAL" });
        }
      }
    });
    return;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={handleAddClient}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" /> Add Client
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
            value={state.searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Client list */}
      {state.isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {state.searchTerm
              ? "No clients match your search criteria."
              : "No clients found. Add your first client!"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
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
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {client.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client?.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {client?.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(client.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                      onClick={() => handleEditClient(client)}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Client Form Modal */}
      <Modal
        isOpen={state.isModalOpen}
        onClose={() => dispatch({ type: "TOGGLE_MODAL" })}
        title={state.currentClient ? "Edit Client" : "Add New Client"}
      >
        <ClientForm
          onSubmit={handleSubmitClient}
          onCancel={() => dispatch({ type: "TOGGLE_MODAL" })}
          initialData={state.currentClient || {}}
          isSubmitting={state.isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Clients;
