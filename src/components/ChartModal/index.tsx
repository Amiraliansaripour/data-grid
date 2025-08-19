import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BarChart3, 
  LineChart, 
  PieChart,
  Download
} from 'lucide-react';
import type { DataTableColumn, ChartType } from '../../types';

interface ChartModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: DataTableColumn<T>[];
  title?: string;
}

const ChartModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  data,
  columns,
  title = 'Chart View'
}: ChartModalProps<T>) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartType>('line');

  const handleCreateChart = () => {
    // This is where you would integrate with your preferred charting library
    // For example: Chart.js, Recharts, Victory, etc.
    console.log('Creating chart with:', {
      data,
      columns: selectedColumns,
      type: chartType
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualize your data with interactive charts
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Column Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                Select Chart Columns
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {columns.map((column) => (
                  <label key={String(column.accessor)} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(String(column.accessor))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColumns([...selectedColumns, String(column.accessor)]);
                        } else {
                          setSelectedColumns(selectedColumns.filter(col => col !== String(column.accessor)));
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {column.header}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
              <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                Chart Ready for Display
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Charts will be displayed here using your preferred charting library
              </p>
              
              {/* Chart Type Selection */}
              <div className="flex justify-center gap-2 mb-4">
                {[
                  { type: 'line', icon: LineChart, label: 'Line' },
                  { type: 'bar', icon: BarChart3, label: 'Bar' },
                  { type: 'area', icon: LineChart, label: 'Area' },
                  { type: 'pie', icon: PieChart, label: 'Pie' },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type as ChartType)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      chartType === type
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                    title={label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>

              {/* Sample Chart Implementation */}
              {selectedColumns.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Selected columns: {selectedColumns.join(', ')}
                  </p>
                  <div className="h-48 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {chartType} chart for {selectedColumns.length} columns
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Data points: {data.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedColumns.length === 0 && (
                <div className="text-gray-400 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Please select at least one column</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChart}
              disabled={selectedColumns.length === 0}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Create Chart
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChartModal;
