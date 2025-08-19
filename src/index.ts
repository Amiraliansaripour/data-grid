// Main exports
export { DataTable as default, DataTable } from './components/DataTable';
export { default as ChartModal } from './components/ChartModal';

// Type exports
export type {
  DataTableProps,
  DataTableColumn,
  DataTableFilter,
  DataTableSort,
  SortConfig,
  ColumnType,
  FilterOperator,
  SortDirection,
  ChartType,
  ChartDisplayMode,
  RowAction,
  CustomAction,
  SummaryStats,
  GroupChartConfig,
  ChartModalProps,
  UseDataTableState,
  ProcessedTableData,
  IconComponent
} from './types';

// Hook exports
export {
  useDataTableState,
  useProcessedColumns,
  useProcessedData,
  useFilters,
  useSorts,
  useSummaryStats,
  useColumnVisibility,
  useRowSelection
} from './hooks';

// Utility exports
export {
  formatNumber,
  formatDate,
  detectColumnType,
  generateId,
  deepClone,
  debounce,
  getNestedValue,
  setNestedValue,
  matchesFilter,
  sortByMultipleCriteria,
  groupDataByColumn,
  calculateColumnStats,
  downloadFile,
  isValidEmail,
  cx
} from './utils';
