import { InputHTMLAttributes } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  isRequired?: boolean;
  disabled?: boolean;
}

const InputField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  error,
  isRequired = false,
  disabled = false,
  ...rest
}: InputFieldProps<T>) => {
  return (
    <div>
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
          render={({ field }) => (
            <div className="relative">
              <input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 p-2 block w-full rounded-md shadow-sm dark:bg-[#374151] dark:text-white ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                {...field}
                {...rest}
              />
            </div>
          )}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
