/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format a currency value
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return 'Not set';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};
