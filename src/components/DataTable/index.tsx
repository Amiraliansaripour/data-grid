import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  RefreshCw,
  FileText,
  BarChart3,
  Calendar,
  Hash,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  LineChart,
  Settings,
  X,
  Plus,
  Layers,
  SortAsc,
  Group,
} from 'lucide-react';
import { BsFiletypeXls } from 'react-icons/bs';

import { DataTableProps, CustomAction, RowAction } from '../../types';
import {
  useDataTableState,
  useProcessedColumns,
  useProcessedData,
  useFilters,
  useSorts,
  useSummaryStats,
  useColumnVisibility,
  useRowSelection
} from '../../hooks';
import { formatNumber, formatDate, generateId, downloadFile } from '../../utils';
import ChartModal from '../ChartModal';

/**
 * Advanced DataTable Component with TypeScript support
 * 
 * Features:
 * - Advanced filtering and sorting
 * - Grouping and pagination
 * - Export to Excel/PDF
 * - Column visibility management
 * - Row selection
 * - Chart integration
 * - Persian/RTL support
 * - Dark mode support
 * - Responsive design
 */
export const DataTable: React.FC<DataTableProps> = (props = {}) => {
  const {
    data = [],
    columns = [],
    title = "جدول داده‌ها",
    subtitle = "",
    showSearch = true,
    showFilter = true,
    showExport = true,
    showColumnToggle = true,
    showPagination = true,
    showSummary = true,
    excludeFromSummary = [],
    itemsPerPageOptions = [10, 25, 50, 100],
    defaultItemsPerPage = 25,
    loading = false,
    onRefresh = null,
    className = "",
    emptyStateMessage = "هیچ داده‌ای یافت نشد",
    emptyStateIcon = FileText,
    customActions = [],
    onRowClick = null,
    highlightedRowId = null,
    striped = true,
    bordered = true,
    hover = true,
    compact = false,
    stickyHeader = false,
    exportFileName = "data-export",
    searchPlaceholder = "جستجو در داده‌ها...",
    showMoreColumn = false,
    rowActions = [],
    showComparison = false,
    comparisonAccessor = "symbol",
    selectedComparisons = [],
    onComparisonChange = null,
    maxComparisons = 4,
    comparisonLabel = "انتخاب برای مقایسه",
    showColumnComparison = false,
    selectedColumnsForComparison = [],
    onColumnComparisonChange = null,
    maxColumnComparisons = 4,
    columnComparisonLabel = "انتخاب ستون برای مقایسه",
    onOpenColumnComparison = null,
    columnComparisonButtonLabel = "مقایسه ستون‌ها",
    showSymbolCharting = false,
    symbolAccessor = "symbol",
    selectedSymbolsForChart = [],
    onSymbolChartChange = null,
    maxSymbolsForChart = 4,
    symbolChartLabel = "انتخاب نماد برای نمودار",
    onOpenSymbolChart = null,
    symbolChartButtonLabel = "نمودار نمادها",
    chartOptions = ["area", "line", "bar"],
  } = props;

  // Early safety checks
  if (!Array.isArray(data)) {
    console.error("DataTable: data prop must be an array");
    return null;
  }

  if (!Array.isArray(columns)) {
    console.error("DataTable: columns prop must be an array");
    return null;
  }

  // State management using custom hooks
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    groupByColumn,
    setGroupByColumn,
    expandedGroups,
    setExpandedGroups,
  } = useDataTableState(defaultItemsPerPage);

  // Column visibility
  const { hiddenColumns, toggleColumnVisibility } = useColumnVisibility();

  // Row selection
  const { selectedRows, handleSelectRow, handleSelectAll } = useRowSelection();

  // Filters and sorts
  const { multipleFilters, addFilter, removeFilter, updateFilter } = useFilters(columns);
  const { multipleSortConfig, addSort, removeSort, updateSort } = useSorts(columns);

  // UI state
  const [openDropdownRowId, setOpenDropdownRowId] = useState<string | number | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showAdvancedFilterPanel, setShowAdvancedFilterPanel] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedColumnsForChart, setSelectedColumnsForChart] = useState<string[]>([]);

  // Process columns with auto-detection
  const processedColumns = useProcessedColumns(columns, data);

  // Process data with filtering, sorting, and pagination
  const {
    filteredData,
    sortedData,
    paginatedData,
    groupedData,
    totalPages,
    startItem,
    endItem,
  } = useProcessedData(
    data,
    searchTerm,
    multipleFilters,
    sortConfig,
    multipleSortConfig,
    groupByColumn,
    currentPage,
    itemsPerPage
  );

  // Summary statistics
  const summaryStats = useSummaryStats(processedColumns, filteredData, excludeFromSummary);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element)?.closest('.dropdown-container')) {
        setOpenDropdownRowId(null);
      }
    };

    if (openDropdownRowId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdownRowId]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return processedColumns.filter((col) => !hiddenColumns.has(col.accessor as string));
  }, [processedColumns, hiddenColumns]);

  // Filter columns suitable for charts
  const yAxisColumns = useMemo(() => {
    return processedColumns.filter(
      (col) => col.type === 'number' || col.type === 'percentage'
    );
  }, [processedColumns]);

  // Event handlers
  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, [setSortConfig]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    },
    [totalPages, setCurrentPage]
  );

  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    },
    [setItemsPerPage, setCurrentPage]
  );

  // Export as XLSX
  const handleExportExcel = useCallback(() => {
    const wsData = [
      visibleColumns.map((col) => col.header),
      ...sortedData.map((row) =>
        visibleColumns.map((col) => {
          const value = (row as any)[col.accessor as string];
          return col.formatter ? col.formatter(value) : value;
        })
      ),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  }, [visibleColumns, sortedData, exportFileName]);

  // Handle opening chart modal
  const handleOpenChartModal = useCallback(() => {
    setShowChartModal(true);
  }, []);

  // Handle chart modal close
  const handleCloseChartModal = useCallback(() => {
    setShowChartModal(false);
    setSelectedColumnsForChart([]);
  }, []);

  // Group expansion handler
  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  }, [setExpandedGroups]);

  // Comparison handlers
  const handleComparisonToggle = useCallback(
    (row: any, isSelected: boolean) => {
      if (!onComparisonChange) return;
      const comparisonValue = row[comparisonAccessor];
      onComparisonChange(comparisonValue, isSelected);
    },
    [onComparisonChange, comparisonAccessor]
  );

  const isSelectedForComparison = useCallback(
    (row: any) => {
      const comparisonValue = row[comparisonAccessor];
      return selectedComparisons.includes(comparisonValue);
    },
    [selectedComparisons, comparisonAccessor]
  );

  // Symbol chart handlers
  const handleSymbolChartToggle = useCallback(
    (row: any, isSelected: boolean) => {
      if (!onSymbolChartChange) return;
      const symbolValue = row[symbolAccessor];
      onSymbolChartChange(symbolValue, isSelected);
    },
    [onSymbolChartChange, symbolAccessor]
  );

  const isSelectedForSymbolChart = useCallback(
    (row: any) => {
      const symbolValue = row[symbolAccessor];
      return selectedSymbolsForChart.includes(symbolValue);
    },
    [selectedSymbolsForChart, symbolAccessor]
  );

  // Column comparison handlers
  const handleColumnComparisonToggle = useCallback(
    (columnAccessor: string, isSelected: boolean) => {
      if (!onColumnComparisonChange) return;
      onColumnComparisonChange(columnAccessor, isSelected);
    },
    [onColumnComparisonChange]
  );

  const isColumnSelectedForComparison = useCallback(
    (columnAccessor: string) => {
      return selectedColumnsForComparison.includes(columnAccessor);
    },
    [selectedColumnsForComparison]
  );

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  const EmptyStateIcon = emptyStateIcon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onRefresh && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRefresh}
                disabled={loading}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                title="بروزرسانی"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
            )}

            {showColumnToggle && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title="نمایش/مخفی کردن ستون‌ها"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showColumnSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-20 min-w-48"
                    >
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ستون‌های قابل نمایش:
                      </div>
                      {processedColumns.map((col) => (
                        <label
                          key={col.accessor as string}
                          className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2"
                        >
                          <input
                            type="checkbox"
                            checked={!hiddenColumns.has(col.accessor as string)}
                            onChange={() => toggleColumnVisibility(col.accessor as string)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {col.header}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {showExport && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportExcel}
                className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                title="دانلود Excel"
              >
                <BsFiletypeXls className="w-4 h-4" />
              </motion.button>
            )}

            {/* Chart button - only show if there are numeric columns */}
            {yAxisColumns.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenChartModal}
                className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                title="تبدیل به نمودار"
              >
                <LineChart className="w-4 h-4" />
              </motion.button>
            )}

            {/* Advanced Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdvancedFilterPanel(!showAdvancedFilterPanel)}
              className={`p-2 rounded-lg transition-colors ${
                showAdvancedFilterPanel ||
                multipleFilters.length > 0 ||
                multipleSortConfig.length > 0 ||
                groupByColumn
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="فیلتر و مرتب‌سازی پیشرفته"
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            {customActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={
                  action.className ||
                  'p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                }
                title={action.title}
              >
                {action.icon}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search row */}
        {showSearch && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-5/12 w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {showSummary && summaryStats.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            خلاصه آماری:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {summaryStats.map((stat) => (
              <div
                key={stat.accessor}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.column}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    مجموع: <span className="font-medium">{stat.sum}</span>
                  </div>
                  <div>
                    میانگین: <span className="font-medium">{stat.avg}</span>
                  </div>
                  <div className="text-green-600">
                    بیشترین: <span className="font-medium">{stat.max}</span>
                  </div>
                  <div className="text-red-600">
                    کمترین: <span className="font-medium">{stat.min}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600 dark:text-gray-400">
              در حال بارگذاری...
            </span>
          </div>
        ) : paginatedData?.length === 0 ||
          (groupByColumn && (!groupedData || Object.keys(groupedData).length === 0)) ? (
          <div className="text-center py-12">
            <EmptyStateIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {emptyStateMessage}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? 'نتیجه‌ای برای جستجوی شما یافت نشد'
                : 'هنوز داده‌ای اضافه نشده است'}
            </p>
          </div>
        ) : (
          <table className={`w-full ${stickyHeader ? 'table-fixed' : ''}`}>
            <thead
              className={`
              bg-gray-50 dark:bg-gray-900/50 
              ${stickyHeader ? 'sticky top-0 z-10' : ''}
              border-b border-gray-200 dark:border-gray-700
            `}
            >
              <tr>
                {/* Select all checkbox */}
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size > 0}
                    onChange={() => handleSelectAll(paginatedData || [])}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    title="انتخاب همه"
                  />
                </th>

                {visibleColumns.map((column) => (
                  <th
                    key={column.accessor as string}
                    className={`
                        px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                        ${
                          column.sortable !== false
                            ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                            : ''
                        }
                      `}
                    onClick={() =>
                      column.sortable !== false && handleSort(column.accessor as string)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {column.icon && <column.icon className="w-4 h-4" />}
                        {column.header}
                      </div>
                      {column.sortable !== false && (
                        <div className="flex flex-col">
                          {sortConfig.key === column.accessor ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}

                {/* Actions column */}
                {(showMoreColumn || rowActions.length > 0) && (
                  <th className="w-20 px-4 py-3 text-center">
                    <MoreHorizontal className="w-4 h-4 mx-auto text-gray-400" />
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="popLayout">
                {paginatedData && paginatedData.length > 0
                  ? paginatedData.map((row, index) => {
                      const rowId = (row as any).id || (row as any).key || index;
                      const isSelected = selectedRows.has(rowId);
                      const isHighlighted = highlightedRowId === rowId;

                      return (
                        <motion.tr
                          key={rowId}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={rowVariants}
                          layout
                          className={`
                          ${
                            striped && index % 2 === 0
                              ? 'bg-gray-50/50 dark:bg-gray-900/25'
                              : ''
                          }
                          ${
                            hover
                              ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              : ''
                          }
                          ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                          ${
                            isHighlighted
                              ? 'ring-2 ring-blue-500 ring-inset'
                              : ''
                          }
                          ${
                            bordered
                              ? 'border-b border-gray-200 dark:border-gray-700'
                              : ''
                          }
                          ${onRowClick ? 'cursor-pointer' : ''}
                          transition-colors duration-150
                        `}
                          onClick={() => onRowClick && onRowClick(row, index)}
                        >
                          {/* Select checkbox */}
                          <td className="px-4 py-3 w-12">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(rowId)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                              title="انتخاب ردیف"
                            />
                          </td>

                          {visibleColumns.map((column) => {
                            const value = (row as any)[column.accessor as string];
                            const formattedValue = column.formatter
                              ? column.formatter(value)
                              : value;

                            return (
                              <td
                                key={column.accessor as string}
                                className={`
                                px-4 py-3 text-sm text-gray-900 dark:text-gray-100
                                ${compact ? 'py-2' : 'py-3'}
                                ${column.className || ''}
                              `}
                              >
                                {column.render ? (
                                  column.render(value, row, index)
                                ) : (
                                  <div className="flex items-center gap-2">
                                    {column.type === 'number' && value > 0 && (
                                      <TrendingUp className="w-3 h-3 text-gray-500" />
                                    )}
                                    {column.type === 'number' && value < 0 && (
                                      <TrendingDown className="w-3 h-3 text-gray-500" />
                                    )}
                                    <span>{formattedValue}</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}

                          {/* Actions cell */}
                          {(showMoreColumn || rowActions.length > 0) && (
                            <td className="px-4 py-3 text-center relative dropdown-container">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownRowId(
                                      openDropdownRowId === rowId ? null : rowId
                                    );
                                  }}
                                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                  {openDropdownRowId === rowId && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        y: -10,
                                        scale: 0.95,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute left-0 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 min-w-48"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {rowActions.map((action, actionIndex) => (
                                        <button
                                          key={actionIndex}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle action click
                                            setOpenDropdownRowId(null);
                                          }}
                                          className="w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-sm"
                                        >
                                          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                          <span className="text-blue-700 dark:text-blue-300">
                                            {action.title}
                                          </span>
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      );
                    })
                  : null}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && !groupByColumn && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">نمایش</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                مورد از {sortedData.length} مورد ({startItem}-{endItem})
              </span>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              {/* Page numbers */}
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                        w-8 h-8 rounded-lg text-sm font-medium transition-colors
                        ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      <ChartModal
        isOpen={showChartModal}
        onClose={handleCloseChartModal}
        data={sortedData}
        columns={processedColumns}
        title={`Chart View - ${title}`}
      />
    </motion.div>
  );
};

export default DataTable;
