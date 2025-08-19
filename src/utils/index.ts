/**
 * Format number for Persian display
 */
export const formatNumber = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (typeof numValue !== 'number' || isNaN(numValue)) return String(num);
  return new Intl.NumberFormat('fa-IR').format(numValue);
};

/**
 * Format date for Persian display
 */
export const formatDate = (dateStr: string | Date): string => {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return new Intl.DateTimeFormat('fa-IR').format(date);
  } catch {
    return String(dateStr);
  }
};

/**
 * Auto-detect column type based on sample data
 */
export const detectColumnType = (sampleValue: any): 'text' | 'number' | 'date' | 'boolean' => {
  if (typeof sampleValue === 'number') return 'number';
  if (typeof sampleValue === 'boolean') return 'boolean';
  
  if (typeof sampleValue === 'string') {
    // Check for date patterns
    if (sampleValue.includes('T') || sampleValue.includes('-') || sampleValue.includes('/')) {
      const date = new Date(sampleValue);
      if (!isNaN(date.getTime())) return 'date';
    }
  }
  
  return 'text';
};

/**
 * Generate unique ID for filters and sorts
 */
export const generateId = (): number => Date.now() + Math.random();

/**
 * Deep clone object utility
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Debounce function for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as unknown as number;
  };
};

/**
 * Get nested object value by path
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Set nested object value by path
 */
export const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  if (!lastKey) return;
  
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  
  target[lastKey] = value;
};

/**
 * Check if value matches filter criteria
 */
export const matchesFilter = (
  value: any,
  filterValue: string | number,
  operator: string
): boolean => {
  if (!filterValue && filterValue !== 0) return true;

  const stringValue = String(value || '').toLowerCase();
  const filterStringValue = String(filterValue).toLowerCase();

  switch (operator) {
    case 'contains':
      return stringValue.includes(filterStringValue);
    case 'equals':
      return stringValue === filterStringValue;
    case 'starts_with':
      return stringValue.startsWith(filterStringValue);
    case 'ends_with':
      return stringValue.endsWith(filterStringValue);
    case 'greater_than':
      return Number(value) > Number(filterValue);
    case 'less_than':
      return Number(value) < Number(filterValue);
    case 'greater_equal':
      return Number(value) >= Number(filterValue);
    case 'less_equal':
      return Number(value) <= Number(filterValue);
    case 'not_equal':
      return stringValue !== filterStringValue;
    case 'is_empty':
      return !value || value === '';
    case 'is_not_empty':
      return value && value !== '';
    default:
      return true;
  }
};

/**
 * Sort array by multiple criteria
 */
export const sortByMultipleCriteria = <T>(
  data: T[],
  sortConfigs: Array<{ column: string; direction: 'asc' | 'desc' }>
): T[] => {
  if (sortConfigs.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const sort of sortConfigs) {
      const aValue = getNestedValue(a, sort.column);
      const bValue = getNestedValue(b, sort.column);

      if (aValue === bValue) continue;

      const comparison = aValue < bValue ? -1 : 1;
      const result = sort.direction === 'desc' ? -comparison : comparison;
      return result;
    }
    return 0;
  });
};

/**
 * Group data by column value
 */
export const groupDataByColumn = <T>(
  data: T[],
  groupColumn: string
): Record<string, T[]> => {
  if (!groupColumn || !Array.isArray(data)) {
    return { ungrouped: data || [] };
  }

  return data.reduce((groups, row) => {
    if (!row || typeof row !== 'object') {
      return groups;
    }

    const groupValue = getNestedValue(row, groupColumn) || 'غیر مشخص';
    if (!groups[groupValue]) {
      groups[groupValue] = [];
    }
    groups[groupValue].push(row);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Calculate statistics for numeric columns
 */
export const calculateColumnStats = (values: number[]): {
  sum: number;
  avg: number;
  min: number;
  max: number;
  count: number;
} => {
  const validValues = values.filter(val => typeof val === 'number' && !isNaN(val));
  
  if (validValues.length === 0) {
    return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
  }

  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const avg = sum / validValues.length;
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);

  return {
    sum,
    avg,
    min,
    max,
    count: validValues.length
  };
};

/**
 * Export utilities
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate CSS classes conditionally
 */
export const cx = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
