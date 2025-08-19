import { useState, useMemo, useCallback } from 'react';
import { 
  DataTableColumn, 
  DataTableFilter, 
  DataTableSort, 
  SortConfig, 
  UseDataTableState,
  ProcessedTableData,
  SummaryStats,
  ColumnType
} from '../types';
import { 
  formatNumber, 
  formatDate, 
  detectColumnType, 
  generateId, 
  matchesFilter,
  sortByMultipleCriteria,
  groupDataByColumn,
  calculateColumnStats,
  getNestedValue
} from '../utils';

/**
 * Main hook for DataTable state management
 */
export const useDataTableState = (defaultItemsPerPage = 25): UseDataTableState => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  
  // Advanced features
  const [hiddenColumns, setHiddenColumns] = useState(new Set<string>());
  const [selectedRows, setSelectedRows] = useState(new Set<any>());
  
  // Advanced filtering
  const [multipleFilters, setMultipleFilters] = useState<DataTableFilter[]>([]);
  const [multipleSortConfig, setMultipleSortConfig] = useState<DataTableSort[]>([]);
  
  // Grouping
  const [groupByColumn, setGroupByColumn] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>());

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    hiddenColumns,
    setHiddenColumns,
    selectedRows,
    setSelectedRows,
    multipleFilters,
    setMultipleFilters,
    multipleSortConfig,
    setMultipleSortConfig,
    groupByColumn,
    setGroupByColumn,
    expandedGroups,
    setExpandedGroups
  };
};

/**
 * Hook for processing columns with auto-detection
 */
export const useProcessedColumns = <T>(
  columns: DataTableColumn<T>[],
  data: T[]
) => {
  return useMemo(() => {
    if (!Array.isArray(columns) || columns.length === 0) {
      return [];
    }

    return columns.map((col) => {
      // Ensure column has required properties
      if (!col || typeof col.accessor !== 'string') {
        console.warn('DataTable: Invalid column found', col);
        return {
          accessor: col?.accessor || '',
          header: col?.header || '',
          type: 'text' as ColumnType,
          formatter: (value: any) => value,
        };
      }

      if (col.type) return col;

      // Auto-detect column type based on data
      let sampleValue: any;
      try {
        sampleValue = Array.isArray(data) && data.length > 0
          ? data.find((row) => row && getNestedValue(row, col.accessor as string) != null)?.[col.accessor as keyof T]
          : null;
      } catch (error) {
        console.warn('DataTable: Error accessing column data', error);
        sampleValue = null;
      }

      const detectedType = detectColumnType(sampleValue);
      let formatter = (value: any) => value;

      if (detectedType === 'number') {
        formatter = formatNumber;
      } else if (detectedType === 'date') {
        formatter = formatDate;
      } else if (detectedType === 'boolean') {
        formatter = (value: any) => (value ? '✓' : '✗');
      }

      return {
        ...col,
        type: detectedType,
        formatter: col.formatter || formatter,
      };
    });
  }, [columns, data]);
};

/**
 * Hook for processing and filtering data
 */
export const useProcessedData = <T>(
  data: T[],
  searchTerm: string,
  multipleFilters: DataTableFilter[],
  sortConfig: SortConfig,
  multipleSortConfig: DataTableSort[],
  groupByColumn: string | null,
  currentPage: number,
  itemsPerPage: number
): ProcessedTableData<T> => {
  // Filter and search data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search term
    if (searchTerm) {
      result = result.filter((row) =>
        Object.values(row as Record<string, any>).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply multiple filters
    if (multipleFilters.length > 0) {
      result = result.filter((row) => {
        return multipleFilters.every((filter) => {
          const value = getNestedValue(row, filter.column);
          return matchesFilter(value, filter.value, filter.operator, filter.type);
        });
      });
    }

    return result;
  }, [data, searchTerm, multipleFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    let result = filteredData;

    // Apply multiple sorts if available, otherwise use single sort
    if (multipleSortConfig.length > 0) {
      result = sortByMultipleCriteria(result, multipleSortConfig);
    } else if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key!);
        const bValue = getNestedValue(b, sortConfig.key!);

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [filteredData, sortConfig, multipleSortConfig]);

  // Group and paginate data
  const { groupedData, paginatedData } = useMemo(() => {
    const safeData = Array.isArray(sortedData) ? sortedData : [];

    if (groupByColumn) {
      const grouped = groupDataByColumn(safeData, groupByColumn);
      return { groupedData: grouped, paginatedData: null };
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return {
        groupedData: null,
        paginatedData: safeData.slice(startIndex, startIndex + itemsPerPage),
      };
    }
  }, [sortedData, currentPage, itemsPerPage, groupByColumn]);

  // Pagination calculations
  const totalPages = Math.ceil((sortedData?.length || 0) / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData?.length || 0);

  return {
    filteredData,
    sortedData,
    paginatedData,
    groupedData,
    totalPages,
    startItem,
    endItem
  };
};

/**
 * Hook for managing filters
 */
export const useFilters = (
  processedColumns: DataTableColumn[]
) => {
  const [multipleFilters, setMultipleFilters] = useState<DataTableFilter[]>([]);

  const addFilter = useCallback(() => {
    setMultipleFilters((prev) => [
      ...prev,
      {
        id: generateId(),
        column: processedColumns[0]?.accessor as string || '',
        operator: 'contains',
        value: '',
        type: processedColumns[0]?.type || 'text',
      },
    ]);
  }, [processedColumns]);

  const removeFilter = useCallback((filterId: number) => {
    setMultipleFilters((prev) => prev.filter((f) => f.id !== filterId));
  }, []);

  const updateFilter = useCallback((filterId: number, updates: Partial<DataTableFilter>) => {
    setMultipleFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, ...updates } : f))
    );
  }, []);

  return {
    multipleFilters,
    setMultipleFilters,
    addFilter,
    removeFilter,
    updateFilter
  };
};

/**
 * Hook for managing sorts
 */
export const useSorts = (
  processedColumns: DataTableColumn[]
) => {
  const [multipleSortConfig, setMultipleSortConfig] = useState<DataTableSort[]>([]);

  const addSort = useCallback(() => {
    setMultipleSortConfig((prev) => [
      ...prev,
      {
        id: generateId(),
        column: processedColumns[0]?.accessor as string || '',
        direction: 'asc',
      },
    ]);
  }, [processedColumns]);

  const removeSort = useCallback((sortId: number) => {
    setMultipleSortConfig((prev) => prev.filter((s) => s.id !== sortId));
  }, []);

  const updateSort = useCallback((sortId: number, updates: Partial<DataTableSort>) => {
    setMultipleSortConfig((prev) =>
      prev.map((s) => (s.id === sortId ? { ...s, ...updates } : s))
    );
  }, []);

  return {
    multipleSortConfig,
    setMultipleSortConfig,
    addSort,
    removeSort,
    updateSort
  };
};

/**
 * Hook for calculating summary statistics
 */
export const useSummaryStats = <T>(
  processedColumns: DataTableColumn<T>[],
  filteredData: T[],
  excludeFromSummary: string[] = []
): SummaryStats[] => {
  return useMemo(() => {
    const numericColumns = processedColumns.filter(
      (col) =>
        col.type === 'number' && !excludeFromSummary.includes(col.accessor as string)
    );

    return numericColumns
      .map((col) => {
        const values = filteredData
          .map((row) => getNestedValue(row, col.accessor as string))
          .filter((val) => typeof val === 'number' && !isNaN(val));

        if (values.length === 0) return null;

        const stats = calculateColumnStats(values);

        return {
          column: col.header,
          accessor: col.accessor as string,
          sum: formatNumber(stats.sum),
          avg: formatNumber(Math.round(stats.avg)),
          min: formatNumber(stats.min),
          max: formatNumber(stats.max),
          count: stats.count,
        };
      })
      .filter(Boolean) as SummaryStats[];
  }, [processedColumns, filteredData, excludeFromSummary]);
};

/**
 * Hook for column visibility management
 */
export const useColumnVisibility = () => {
  const [hiddenColumns, setHiddenColumns] = useState(new Set<string>());

  const toggleColumnVisibility = useCallback((columnAccessor: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnAccessor)) {
        newSet.delete(columnAccessor);
      } else {
        newSet.add(columnAccessor);
      }
      return newSet;
    });
  }, []);

  const getVisibleColumns = useCallback(<T>(columns: DataTableColumn<T>[]) => {
    return columns.filter((col) => !hiddenColumns.has(col.accessor as string));
  }, [hiddenColumns]);

  return {
    hiddenColumns,
    setHiddenColumns,
    toggleColumnVisibility,
    getVisibleColumns
  };
};

/**
 * Hook for row selection management
 */
export const useRowSelection = () => {
  const [selectedRows, setSelectedRows] = useState(new Set<any>());

  const handleSelectRow = useCallback((id: any) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((currentData: any[]) => {
    if (selectedRows.size === currentData.length && currentData.length > 0) {
      setSelectedRows(new Set());
    } else {
      const allIds = currentData.map((row, index) => row.id || row.key || index);
      setSelectedRows(new Set(allIds));
    }
  }, [selectedRows.size]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    handleSelectRow,
    handleSelectAll,
    clearSelection
  };
};
