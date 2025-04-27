import { useForm } from 'react-hook-form';
interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ClientFormData>;
  isSubmitting?: boolean;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status?: string;
  address?: string;
  notes?: string;
}

const ClientForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isSubmitting = false,
}: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: ClientFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="label">
            Client Name <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              id="name"
              type="text"
              className="input pl-10"
              placeholder="Enter client name"
              {...register('name', {
                required: 'Client name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
          </div>
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="label">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              id="email"
              type="email"
              className="input pl-10"
              placeholder="client@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="label">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              id="phone"
              type="text"
              className="input pl-10"
              placeholder="(123) 456-7890"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9()\-\s+]+$/,
                  message: 'Invalid phone number format',
                },
              })}
            />
          </div>
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="label">
            Company Name
          </label>
          <div>
            <input
              id="company"
              type="text"
              className="input pl-10"
              placeholder="Enter company name"
              {...register('company', {
                required: 'Company name is required',
              })}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="label">
            Status
          </label>
          <div>
            <select
              id="status"
              className="input pl-10"
              {...register('status', { required: 'Status is required' })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {errors.status && <p className="error">{errors.status.message}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="label">
            Address
          </label>
          <input
            id="address"
            type="text"
            className="input"
            placeholder="Enter client address (optional)"
            {...register('address')}
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="label">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            className="input"
            placeholder="Enter any additional notes about this client (optional)"
            {...register('notes')}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData.name ? 'Update Client' : 'Add Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
