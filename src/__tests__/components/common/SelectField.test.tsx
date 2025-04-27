import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectField from '../../../components/common/SelectField';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';

type TestSelectFieldProps = {
  label: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  error?: FieldError;
};

// Create a test wrapper component that provides the form context
const TestSelectField = ({ label, options, className, error }: TestSelectFieldProps) => {
  const methods = useForm({
    defaultValues: {
      testSelect: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <SelectField 
        name="testSelect" 
        label={label} 
        control={methods.control}
        options={options}
        className={className}
        error={error}
      />
    </FormProvider>
  );
};

describe('SelectField Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  test('renders correctly with label', () => {
    render(<TestSelectField label="Test Select Label" options={options} />);
    
    expect(screen.getByLabelText('Test Select Label')).toBeInTheDocument();
  });

  test('renders all provided options', () => {
    render(<TestSelectField label="Test Select Label" options={options} />);
    
    // Test that each option is in the document
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('applies provided className to select wrapper', () => {
    const { container } = render(
      <TestSelectField 
        label="Test Select Label" 
        options={options}
        className="test-custom-class" 
      />
    );
    
    // The SelectField component applies the className to the outermost div wrapper
    // We need to modify how we test this based on the component's structure
    const formDiv = container.querySelector('.test-custom-class');
    expect(formDiv).toBeInTheDocument();
  });

  test('shows error message when provided', () => {
    const error = {
      type: 'required',
      message: 'Please select an option'
    };
    
    render(
      <TestSelectField 
        label="Test Select Label" 
        options={options}
        error={error}
      />
    );
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  test('handles selection change', () => {
    render(<TestSelectField label="Test Select Label" options={options} />);
    
    const select = screen.getByLabelText('Test Select Label');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(select).toHaveValue('option2');
  });
});
