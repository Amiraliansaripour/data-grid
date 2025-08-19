import React from 'react';
import { DataTable, DataTableColumn } from './index';
import './index.css';

// Sample data
const sampleData = [
  { id: 1, name: 'احمد محمدی', age: 28, email: 'ahmad@example.com', salary: 5000000, date: '2023-01-15' },
  { id: 2, name: 'فاطمه حسینی', age: 32, email: 'fateme@example.com', salary: 6500000, date: '2023-02-20' },
  { id: 3, name: 'علی رضایی', age: 25, email: 'ali@example.com', salary: 4500000, date: '2023-03-10' },
  { id: 4, name: 'مریم کریمی', age: 29, email: 'maryam@example.com', salary: 5500000, date: '2023-04-05' },
  { id: 5, name: 'حسین صادقی', age: 35, email: 'hossein@example.com', salary: 7000000, date: '2023-05-12' },
];

// Column definitions
const columns: DataTableColumn[] = [
  {
    accessor: 'name',
    header: 'نام',
    type: 'text',
  },
  {
    accessor: 'age',
    header: 'سن',
    type: 'number',
  },
  {
    accessor: 'email',
    header: 'ایمیل',
    type: 'text',
  },
  {
    accessor: 'salary',
    header: 'حقوق',
    type: 'number',
    formatter: (value: number) => `${value.toLocaleString('fa-IR')} تومان`,
  },
  {
    accessor: 'date',
    header: 'تاریخ',
    type: 'date',
  },
];

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          React Advanced DataTable Demo
        </h1>
        
        <DataTable
          data={sampleData}
          columns={columns}
          title="لیست کارمندان"
          subtitle="نمایش اطلاعات کارمندان شرکت"
          showSearch={true}
          showFilter={true}
          showExport={true}
          showColumnToggle={true}
          showPagination={true}
          showSummary={true}
          defaultItemsPerPage={10}
          exportFileName="employees"
        />
      </div>
    </div>
  );
};

export default App;
