import { DataTableColumn, DataTableFilter, DataTableSort, SortConfig, UseDataTableState, ProcessedTableData, SummaryStats, ColumnType } from '../types';

/**
 * Main hook for DataTable state management
 */
export declare const useDataTableState: (defaultItemsPerPage?: number) => UseDataTableState;
/**
 * Hook for processing columns with auto-detection
 */
export declare const useProcessedColumns: <T>(columns: DataTableColumn<T>[], data: T[]) => (DataTableColumn<T> | {
    accessor: string | keyof T;
    header: string;
    type: ColumnType;
    formatter: (value: any) => any;
} | {
    type: "number" | "boolean" | "text" | "date";
    formatter: (value: any) => any;
    accessor: string | keyof T;
    header: string;
    render?: (value: any, row: T, index: number) => import('react').ReactNode;
    icon?: import('..').IconComponent;
    sortable?: boolean;
    className?: string;
    width?: string | number;
    hidden?: boolean;
})[];
/**
 * Hook for processing and filtering data
 */
export declare const useProcessedData: <T>(data: T[], searchTerm: string, multipleFilters: DataTableFilter[], sortConfig: SortConfig, multipleSortConfig: DataTableSort[], groupByColumn: string | null, currentPage: number, itemsPerPage: number) => ProcessedTableData<T>;
/**
 * Hook for managing filters
 */
export declare const useFilters: (processedColumns: DataTableColumn[]) => {
    multipleFilters: DataTableFilter[];
    setMultipleFilters: import('react').Dispatch<import('react').SetStateAction<DataTableFilter[]>>;
    addFilter: () => void;
    removeFilter: (filterId: number) => void;
    updateFilter: (filterId: number, updates: Partial<DataTableFilter>) => void;
};
/**
 * Hook for managing sorts
 */
export declare const useSorts: (processedColumns: DataTableColumn[]) => {
    multipleSortConfig: DataTableSort[];
    setMultipleSortConfig: import('react').Dispatch<import('react').SetStateAction<DataTableSort[]>>;
    addSort: () => void;
    removeSort: (sortId: number) => void;
    updateSort: (sortId: number, updates: Partial<DataTableSort>) => void;
};
/**
 * Hook for calculating summary statistics
 */
export declare const useSummaryStats: <T>(processedColumns: DataTableColumn<T>[], filteredData: T[], excludeFromSummary?: string[]) => SummaryStats[];
/**
 * Hook for column visibility management
 */
export declare const useColumnVisibility: () => {
    hiddenColumns: Set<string>;
    setHiddenColumns: import('react').Dispatch<import('react').SetStateAction<Set<string>>>;
    toggleColumnVisibility: (columnAccessor: string) => void;
    getVisibleColumns: <T>(columns: DataTableColumn<T>[]) => DataTableColumn<T>[];
};
/**
 * Hook for row selection management
 */
export declare const useRowSelection: () => {
    selectedRows: Set<any>;
    setSelectedRows: import('react').Dispatch<import('react').SetStateAction<Set<any>>>;
    handleSelectRow: (id: any) => void;
    handleSelectAll: (currentData: any[]) => void;
    clearSelection: () => void;
};
//# sourceMappingURL=index.d.ts.map