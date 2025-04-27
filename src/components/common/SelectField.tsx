import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: FieldError;
  isRequired?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
}

const SelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select an option',
  error,
  isRequired = false,
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  className = '',
}: SelectFieldProps<T>) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"
      >
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <div className="relative">
              <select
                id={name}
                ref={ref}
                value={value || ''}
                onChange={onChange}
                disabled={disabled || isLoading}
                className={`mt-1 p-2 block w-full rounded-md shadow-sm text-white focus:border-blue-500 focus:ring-blue-500 dark:bg-[#374151] dark:text-white appearance-none ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                {...rest}
              >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        {!error && isLoading && <p className="mt-1 text-sm text-gray-500">{loadingText}</p>}
      </div>
    </div>
  );
};

export default SelectField;
