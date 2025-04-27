import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ClientForm, { ClientFormData } from '../components/clients/ClientForm';

// Client type definition
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // Simulate fetching clients data
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          company: 'Acme Inc',
          status: 'Active',
          createdAt: '2025-01-15T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '(555) 987-6543',
          company: 'Globex Corp',
          status: 'Active',
          createdAt: '2025-02-20T00:00:00.000Z'
        },
        {
          id: '3',
          name: 'Robert Johnson',
          email: 'robert@example.com',
          phone: '(555) 456-7890',
          company: 'Initech',
          status: 'Inactive',
          createdAt: '2025-03-10T00:00:00.000Z'
        },
      ];
      setClients(mockClients);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle opening the modal for adding a new client
  const handleAddClient = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing client
  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmitClient = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      // This would be an API call in a real application
      // if (currentClient) {
      //   // Update existing client
      //   const response = await fetch(`http://localhost:5000/api/clients/${currentClient.id}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(data),
      //     credentials: 'include'
      //   });
      //   if (!response.ok) throw new Error('Failed to update client');
      // } else {
      //   // Create new client
      //   const response = await fetch('http://localhost:5000/api/clients', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(data),
      //     credentials: 'include'
      //   });
      //   if (!response.ok) throw new Error('Failed to create client');
      // }

      // Mock API response
      console.log('Form data submitted:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with the new/updated client
      if (currentClient) {
        // Update existing client in the list
        setClients(prevClients => 
          prevClients.map(c => 
            c.id === currentClient.id 
              ? { ...c, ...data, updatedAt: new Date().toISOString() } 
              : c
          )
        );
      } else {
        // Add new client to the list
        const newClient: Client = {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          createdAt: new Date().toISOString()
        };
        setClients(prevClients => [newClient, ...prevClients]);
      }
      
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting client:', error);
      // Here you would show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle client deletion
  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    
    try {
      // This would be an API call in a real application
      // const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
      //   method: 'DELETE',
      //   credentials: 'include'
      // });
      // if (!response.ok) throw new Error('Failed to delete client');
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove client from local state
      setClients(prevClients => prevClients.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      // Here you would show an error message to the user
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Clients</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={handleAddClient}
        >
          <FiPlus className="mr-2" /> Add Client
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="card p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Clients table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-4 text-center">No clients found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
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
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {client.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {client.status}
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
      </div>

      {/* Client Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <ClientForm
          onSubmit={handleSubmitClient}
          onCancel={() => setIsModalOpen(false)}
          initialData={currentClient || {}}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Clients;
