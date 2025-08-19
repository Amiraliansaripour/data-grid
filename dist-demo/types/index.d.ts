import { ReactNode } from 'react';

/**
 * Icon component type (compatible with Lucide React)
 */
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
/**
 * Supported data types for columns
 */
export type ColumnType = 'text' | 'number' | 'date' | 'boolean' | 'percentage';
/**
 * Supported operators for filtering
 */
export type FilterOperator = 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'not_equal' | 'is_empty' | 'is_not_empty';
/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';
/**
 * Chart types supported
 */
export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'scatter';
/**
 * Chart display modes
 */
export type ChartDisplayMode = 'normal' | 'symbol-comparison' | 'group-time-series';
/**
 * Column definition interface
 */
export interface DataTableColumn<T = any> {
    /** Unique accessor key for the column */
    accessor: keyof T | string;
    /** Display header text */
    header: string;
    /** Data type of the column */
    type?: ColumnType;
    /** Custom formatter function */
    formatter?: (value: any) => string | number;
    /** Custom render function */
    render?: (value: any, row: T, index: number) => ReactNode;
    /** Icon to display in header */
    icon?: IconComponent;
    /** Whether column is sortable */
    sortable?: boolean;
    /** Custom CSS classes */
    className?: string;
    /** Width configuration */
    width?: string | number;
    /** Whether column is initially hidden */
    hidden?: boolean;
}
/**
 * Filter configuration
 */
export interface DataTableFilter {
    id: number;
    column: string;
    operator: FilterOperator;
    value: string | number;
    type: ColumnType;
}
/**
 * Sort configuration
 */
export interface DataTableSort {
    id: number;
    column: string;
    direction: SortDirection;
}
/**
 * Simple sort configuration
 */
export interface SortConfig {
    key: string | null;
    direction: SortDirection;
}
/**
 * Row action configuration
 */
export interface RowAction {
    title: string;
    path: string;
    color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'red';
    icon?: IconComponent;
}
/**
 * Custom action configuration
 */
export interface CustomAction {
    title: string;
    icon: ReactNode;
    onClick: () => void;
    className?: string;
}
/**
 * Statistics summary data
 */
export interface SummaryStats {
    column: string;
    accessor: string;
    sum: string;
    avg: string;
    min: string;
    max: string;
    count: number;
}
/**
 * Group chart configuration
 */
export interface GroupChartConfig {
    xAxisColumn?: string;
    yAxisColumn?: string;
    groupByColumn?: string;
    chartType?: ChartType;
    isFinancialData?: boolean;
    yearColumns?: string[];
    dataTransformationType?: 'financial-transpose' | 'normal';
}
/**
 * Main DataTable props interface
 */
export interface DataTableProps<T = Record<string, any>> {
    /** Array of data to display */
    data?: T[];
    /** Column definitions */
    columns?: DataTableColumn<T>[];
    /** Table title */
    title?: string;
    /** Table subtitle */
    subtitle?: string;
    /** Show search input */
    showSearch?: boolean;
    /** Show filter controls */
    showFilter?: boolean;
    /** Show export buttons */
    showExport?: boolean;
    /** Show column visibility toggle */
    showColumnToggle?: boolean;
    /** Show pagination controls */
    showPagination?: boolean;
    /** Show statistics summary */
    showSummary?: boolean;
    /** Columns to exclude from summary calculations */
    excludeFromSummary?: string[];
    /** Options for items per page */
    itemsPerPageOptions?: number[];
    /** Default items per page */
    defaultItemsPerPage?: number;
    /** Loading state */
    loading?: boolean;
    /** Refresh handler */
    onRefresh?: (() => void) | null;
    /** Custom CSS classes */
    className?: string;
    /** Empty state message */
    emptyStateMessage?: string;
    /** Empty state icon */
    emptyStateIcon?: IconComponent;
    /** Custom actions in header */
    customActions?: CustomAction[];
    /** Row click handler */
    onRowClick?: ((row: T, index: number) => void) | null;
    /** Highlighted row ID */
    highlightedRowId?: string | number | null;
    /** Striped rows */
    striped?: boolean;
    /** Bordered table */
    bordered?: boolean;
    /** Hover effects */
    hover?: boolean;
    /** Compact mode */
    compact?: boolean;
    /** Sticky header */
    stickyHeader?: boolean;
    /** Virtual scrolling (future feature) */
    virtualScrolling?: boolean;
    /** Export file name */
    exportFileName?: string;
    /** Search placeholder text */
    searchPlaceholder?: string;
    /** Show more actions column */
    showMoreColumn?: boolean;
    /** Row actions configuration */
    rowActions?: RowAction[];
    /** Enable comparison mode */
    showComparison?: boolean;
    /** Column accessor for comparison */
    comparisonAccessor?: string;
    /** Selected items for comparison */
    selectedComparisons?: any[];
    /** Comparison change handler */
    onComparisonChange?: ((value: any, isSelected: boolean) => void) | null;
    /** Maximum comparisons allowed */
    maxComparisons?: number;
    /** Comparison label */
    comparisonLabel?: string;
    /** Enable column comparison */
    showColumnComparison?: boolean;
    /** Selected columns for comparison */
    selectedColumnsForComparison?: string[];
    /** Column comparison change handler */
    onColumnComparisonChange?: ((columnAccessor: string, isSelected: boolean) => void) | null;
    /** Maximum column comparisons */
    maxColumnComparisons?: number;
    /** Column comparison label */
    columnComparisonLabel?: string;
    /** Open column comparison handler */
    onOpenColumnComparison?: (() => void) | null;
    /** Column comparison button label */
    columnComparisonButtonLabel?: string;
    /** Enable symbol charting */
    showSymbolCharting?: boolean;
    /** Symbol column accessor */
    symbolAccessor?: string;
    /** Selected symbols for chart */
    selectedSymbolsForChart?: any[];
    /** Symbol chart change handler */
    onSymbolChartChange?: ((value: any, isSelected: boolean) => void) | null;
    /** Maximum symbols for chart */
    maxSymbolsForChart?: number;
    /** Symbol chart label */
    symbolChartLabel?: string;
    /** Open symbol chart handler */
    onOpenSymbolChart?: (() => void) | null;
    /** Symbol chart button label */
    symbolChartButtonLabel?: string;
    /** Chart display options */
    chartOptions?: ChartType[];
}
/**
 * Chart Modal props interface
 */
export interface ChartModalProps<T = any> {
    /** Whether modal is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Data for chart */
    data: T[];
    /** Column definitions */
    columns: DataTableColumn<T>[];
    /** Selected columns */
    selectedColumns: string[];
    /** Column selection change handler */
    onColumnSelectionChange: (columns: string[]) => void;
    /** Chart title */
    title: string;
    /** Selected row IDs */
    selectedRowIds: Set<any>;
    /** Symbol accessor */
    symbolAccessor: string;
    /** Selected symbols for chart */
    selectedSymbolsForChart: any[];
    /** Chart display mode */
    chartDisplayMode: ChartDisplayMode;
    /** Symbol chart data */
    symbolChartData?: T[] | null;
    /** Group chart configuration */
    groupChartConfig?: GroupChartConfig;
}
/**
 * Hook return types
 */
export interface UseDataTableState {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    sortConfig: SortConfig;
    setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>;
    hiddenColumns: Set<string>;
    setHiddenColumns: React.Dispatch<React.SetStateAction<Set<string>>>;
    selectedRows: Set<any>;
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<any>>>;
    multipleFilters: DataTableFilter[];
    setMultipleFilters: React.Dispatch<React.SetStateAction<DataTableFilter[]>>;
    multipleSortConfig: DataTableSort[];
    setMultipleSortConfig: React.Dispatch<React.SetStateAction<DataTableSort[]>>;
    groupByColumn: string | null;
    setGroupByColumn: React.Dispatch<React.SetStateAction<string | null>>;
    expandedGroups: Set<string>;
    setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
}
/**
 * Processed data return type
 */
export interface ProcessedTableData<T = any> {
    filteredData: T[];
    sortedData: T[];
    paginatedData: T[] | null;
    groupedData: Record<string, T[]> | null;
    totalPages: number;
    startItem: number;
    endItem: number;
}
export default DataTableProps;
//# sourceMappingURL=index.d.ts.map