# React Data Grid

🚀 **A powerful, feature-rich React DataTable component with TypeScript support**

Created by [Amirali Ansaripour](https://github.com/Amiraliansaripour)

[![npm version](https://badge.fury.io/js/%40amiraliansaripour%2Fdata-grid.svg)](https://badge.fury.io/js/%40amiraliansaripour%2Fdata-grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![CI/CD](https://github.com/AMSeify/data-grid/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/AMSeify/data-grid/actions/workflows/ci-cd.yml)

## 🌟 Overview

This library transforms complex data tables into beautiful, interactive components with advanced features like filtering, sorting, pagination, charting, and export capabilities. Built with modern React, TypeScript, and Tailwind CSS.

## ✨ Key Features

### 🎯 Core Features
- **TypeScript Support** - Full type safety and IntelliSense
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark Mode** - Built-in dark/light theme support
- **Advanced Filtering** - Multiple filter types and operators
- **Multi-Column Sorting** - Sort by multiple columns simultaneously
- **Pagination** - Customizable pagination controls
- **Search** - Global search across all columns
- **Export** - Export data to Excel/PDF formats

### 🚀 Advanced Features
- **Chart Integration** - Ready for chart library integration
- **Row Selection** - Multi-select with checkbox support
- **Column Visibility** - Show/hide columns dynamically
- **Data Grouping** - Group data by any column
- **Statistics** - Automatic numeric column calculations
- **Custom Rendering** - Custom cell renderers and formatters
- **Row Actions** - Dropdown actions for each row
- **Performance Optimized** - Efficient rendering with animations

### 🌍 Persian/RTL Support
- **Persian Language** - Full Persian UI support
- **RTL Layout** - Right-to-left layout
- **Persian Numbers** - Automatic Persian number formatting
- **Persian Dates** - Persian date formatting

## 🚀 Quick Start

### Installation

```bash
npm install @amiraliansaripour/data-grid
```

### Basic Usage

```jsx
import { DataTable } from '@amiraliansaripour/data-grid';
import '@amiraliansaripour/data-grid/styles';

const columns = [
  { accessor: 'name', header: 'Name', sortable: true },
  { accessor: 'email', header: 'Email' },
  { accessor: 'age', header: 'Age', type: 'number' }
];

const data = [
  { name: 'John Doe', email: 'john@example.com', age: 30 },
  { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];

function App() {
  return (
    <DataTable 
      data={data} 
      columns={columns}
      searchable
      exportable
      pagination={{ pageSize: 10 }}
    />
  );
}
```

## 📖 Documentation

### Column Configuration

```typescript
interface DataTableColumn<T> {
  accessor: keyof T | string;     // Data property key
  header: string;                 // Column header text
  type?: 'text' | 'number' | 'date' | 'boolean';
  sortable?: boolean;             // Enable sorting
  width?: string | number;        // Column width
  formatter?: (value: any) => string;
  render?: (value: any, row: T) => ReactNode;
  className?: string;             // Custom CSS classes
  hidden?: boolean;               // Initially hidden
}
```

### Props

```typescript
interface DataTableProps<T> {
  data: T[];                      // Array of data objects
  columns: DataTableColumn<T>[];  // Column definitions
  
  // Search & Filter
  searchable?: boolean;           // Enable global search
  searchPlaceholder?: string;     // Search input placeholder
  
  // Pagination
  pagination?: {
    pageSize?: number;            // Items per page
    showPageSizeSelector?: boolean;
    pageSizeOptions?: number[];
  };
  
  // Selection
  selectable?: boolean;           // Enable row selection
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Export
  exportable?: boolean;           // Enable export buttons
  
  // Styling
  className?: string;             // Custom CSS classes
  theme?: 'light' | 'dark';      // Theme mode
  
  // Events
  onRowClick?: (row: T) => void;  // Row click handler
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}
```

## 🛠️ Development

### Setup

```bash
git clone https://github.com/Amiraliansaripour/data-grid.git
cd data-grid
npm install
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Project Structure

```
src/
├── components/
│   ├── DataTable/          # Main table component
│   └── ChartModal/         # Chart visualization modal
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
└── index.ts               # Main exports
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- 📧 Email: [amiraliansaripor1383@gmail.com](mailto:amiraliansaripor1383@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/Amiraliansaripour/data-grid/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Amiraliansaripour/data-grid/discussions)

---

Made with ❤️ by [Amirali Ansaripour](https://github.com/Amiraliansaripour)
