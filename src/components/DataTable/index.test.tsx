import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable } from './index';

// Mock framer-motion to avoid issues in test environment
jest.mock('framer-motion', () => {
  const stripFMProps = (Tag: any) => ({ children, whileHover, whileTap, layout, transition, initial, animate, exit, variants, ...rest }: any) => (
    <Tag {...rest}>{children}</Tag>
  );
  return {
    motion: {
      div: stripFMProps('div'),
      tr: stripFMProps('tr'),
      button: stripFMProps('button'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <div data-testid="chevron-left" />,
  ChevronRight: () => <div data-testid="chevron-right" />,
  ChevronsLeft: () => <div data-testid="chevrons-left" />,
  ChevronsRight: () => <div data-testid="chevrons-right" />,
  Search: () => <div data-testid="search" />,
  Eye: () => <div data-testid="eye" />,
  ArrowUpDown: () => <div data-testid="arrow-up-down" />,
  ArrowUp: () => <div data-testid="arrow-up" />,
  ArrowDown: () => <div data-testid="arrow-down" />,
  MoreHorizontal: () => <div data-testid="more-horizontal" />,
  RefreshCw: () => <div data-testid="refresh-cw" />,
  FileText: () => <div data-testid="file-text" />,
  TrendingUp: () => <div data-testid="trending-up" />,
  TrendingDown: () => <div data-testid="trending-down" />,
  ExternalLink: () => <div data-testid="external-link" />,
  LineChart: () => <div data-testid="line-chart" />,
  Settings: () => <div data-testid="settings" />,
}));

// Mock react-icons
jest.mock('react-icons/bs', () => ({
  BsFiletypeXls: () => <div data-testid="bs-filetype-xls" />,
}));

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  ];

  const mockColumns = [
    { accessor: 'name', header: 'Name', type: 'text' as const },
    { accessor: 'age', header: 'Age', type: 'number' as const },
    { accessor: 'email', header: 'Email', type: 'text' as const },
  ];

  it('renders without crashing', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    expect(screen.getByText('جدول داده‌ها')).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    render(<DataTable />);
    expect(screen.getByText('جدول داده‌ها')).toBeInTheDocument();
  });
});
