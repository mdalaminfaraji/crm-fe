import { Control, Controller, FieldError, FieldValues, Path } from "react-hook-form";

interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

const CheckboxField = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  disabled = false,
  helperText,
  className = "",
}: CheckboxFieldProps<T>) => {
  return (
    <div className={`flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <input
            id={name}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            {...rest}
          />
        )}
      />
      <label
        htmlFor={name}
        className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      {helperText && <p className="ml-auto text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
};

export default CheckboxField;
