import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';

interface DatePickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError;
  isRequired?: boolean;
  disabled?: boolean;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerField = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  isRequired = false,
  disabled = false,
  placeholderText = 'Select date',
  minDate,
  maxDate,
}: DatePickerFieldProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
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
          render={({ field: { onChange, value, ref } }) => (
            <div className="relative">
              <ReactDatePicker
                id={name}
                onChange={(date) => {
                  onChange(date);
                  setIsOpen(false);
                }}
                selected={value ? new Date(value) : null}
                disabled={disabled}
                placeholderText={placeholderText}
                className={`mt-1 p-2 block w-full rounded-md shadow-sm dark:bg-[#374151] dark:text-white ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                dateFormat="yyyy-MM-dd"
                minDate={minDate}
                maxDate={maxDate}
                open={isOpen}
                onClickOutside={() => setIsOpen(false)}
                onInputClick={toggleCalendar}
                ref={ref}
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={toggleCalendar}
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default DatePickerField;
