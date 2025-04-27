import '@testing-library/jest-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';

describe('Formatter Utilities', () => {
  describe('formatDate', () => {
    test('formats a valid date string correctly', () => {
      // Mock the Date.prototype.toLocaleDateString to return a consistent value
      const originalToLocaleDateString = Date.prototype.toLocaleDateString;
      Date.prototype.toLocaleDateString = jest.fn(() => '1/1/2025');

      const result = formatDate('2025-01-01T12:00:00Z');
      expect(result).toBe('1/1/2025');

      // Restore original method
      Date.prototype.toLocaleDateString = originalToLocaleDateString;
    });

    test('returns "Not set" for empty input', () => {
      expect(formatDate('')).toBe('Not set');
    });

    test('handles invalid date inputs gracefully', () => {
      const result = formatDate('invalid-date');
      // Even with invalid input, it should return something rather than crashing
      expect(result).toBeTruthy();
    });
  });

  describe('formatCurrency', () => {
    test('formats a number as USD currency', () => {
      const result = formatCurrency(1234.56);
      // Using a regex to match currency format because actual formatting can vary slightly depending on environment
      expect(result).toMatch(/\$1,234\.56/);
    });

    test('returns "Not set" for undefined or null input', () => {
      expect(formatCurrency(undefined)).toBe('Not set');
      expect(formatCurrency(null as unknown as number)).toBe('Not set');
    });

    test('handles zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$0\.00/);
    });

    test('handles negative values correctly', () => {
      const result = formatCurrency(-99.99);
      expect(result).toMatch(/-\$99\.99/);
    });
  });
});
