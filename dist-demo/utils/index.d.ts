/**
 * Format number for Persian display
 */
export declare const formatNumber: (num: number | string) => string;
/**
 * Format date for Persian display
 */
export declare const formatDate: (dateStr: string | Date) => string;
/**
 * Auto-detect column type based on sample data
 */
export declare const detectColumnType: (sampleValue: any) => "text" | "number" | "date" | "boolean";
/**
 * Generate unique ID for filters and sorts
 */
export declare const generateId: () => number;
/**
 * Deep clone object utility
 */
export declare const deepClone: <T>(obj: T) => T;
/**
 * Debounce function for search
 */
export declare const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => ((...args: Parameters<T>) => void);
/**
 * Get nested object value by path
 */
export declare const getNestedValue: (obj: any, path: string) => any;
/**
 * Set nested object value by path
 */
export declare const setNestedValue: (obj: any, path: string, value: any) => void;
/**
 * Check if value matches filter criteria
 */
export declare const matchesFilter: (value: any, filterValue: string | number, operator: string, _columnType?: string) => boolean;
/**
 * Sort array by multiple criteria
 */
export declare const sortByMultipleCriteria: <T>(data: T[], sortConfigs: Array<{
    column: string;
    direction: "asc" | "desc";
}>) => T[];
/**
 * Group data by column value
 */
export declare const groupDataByColumn: <T>(data: T[], groupColumn: string) => Record<string, T[]>;
/**
 * Calculate statistics for numeric columns
 */
export declare const calculateColumnStats: (values: number[]) => {
    sum: number;
    avg: number;
    min: number;
    max: number;
    count: number;
};
/**
 * Export utilities
 */
export declare const downloadFile: (blob: Blob, filename: string) => void;
/**
 * Validate email format
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Generate CSS classes conditionally
 */
export declare const cx: (...classes: (string | undefined | null | false)[]) => string;
//# sourceMappingURL=index.d.ts.map