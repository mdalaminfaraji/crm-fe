import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';

interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  error?: FieldError;
  isRequired?: boolean;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

const TextareaField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  isRequired = false,
  rows = 3,
  disabled = false,
  className = '',
}: TextareaFieldProps<T>) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"
      >
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <div className="relative">
              <textarea
                id={name}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 p-2 block w-full rounded-md shadow-sm text-white focus:border-blue-500 focus:ring-blue-500 dark:bg-[#374151] dark:text-white ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                ref={ref}
                value={value || ''}
                onChange={onChange}
                {...rest}
              />
            </div>
          )}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  );
};

export default TextareaField;
