import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../../../components/common/InputField';
import { useForm, FormProvider, FieldError } from 'react-hook-form';

type TestInputFieldProps = {
  label: string;
  className?: string;
  error?: FieldError;
};

// Create a test wrapper component that provides the form context
const TestInputField = ({ label, className, error }: TestInputFieldProps) => {
  const methods = useForm({
    defaultValues: {
      testField: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <InputField
        name="testField"
        label={label}
        control={methods.control}
        className={className}
        error={error}
      />
    </FormProvider>
  );
};

describe('InputField Component', () => {
  test('renders correctly with label', () => {
    render(<TestInputField label="Test Label" />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  test('applies provided className to input', () => {
    render(<TestInputField label="Test Label" className="test-custom-class" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('test-custom-class');
  });

  test('shows error message when provided', () => {
    const error = {
      type: 'required',
      message: 'This field is required',
    };

    render(<TestInputField label="Test Label" error={error} />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('handles onChange events', () => {
    render(<TestInputField label="Test Label" />);

    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(input).toHaveValue('New Value');
  });
});
