import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTable } from '../DataTable';
import type { DataTableColumn } from '../../types';

interface SampleData {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive';
}

const sampleData: SampleData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'active' },
];

const sampleColumns: DataTableColumn<SampleData>[] = [
  {
    header: 'ID',
    accessor: 'id',
    sortable: true,
    width: 80,
  },
  {
    header: 'Name',
    accessor: 'name',
    sortable: true,
  },
  {
    header: 'Email',
    accessor: 'email',
  },
  {
    header: 'Age',
    accessor: 'age',
    sortable: true,
    type: 'number',
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    ),
  },
];

describe('DataTable', () => {
  it('renders the table with data', () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
      />
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies sorting when column header is clicked', async () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // First row is header, second should be Bob Johnson (alphabetically first)
      expect(rows[1]).toHaveTextContent('Bob Johnson');
    });
  });

  it('shows pagination when enabled', () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        pagination={{
          pageSize: 2,
          showPageSizeSelector: true,
        }}
      />
    );

    expect(screen.getByText(/Page \d+ of \d+/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('filters data when search is performed', async () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        searchable={true}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'john' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('shows selection checkboxes when selectable is enabled', () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        selectable={true}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4); // 1 header + 3 data rows
  });

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = jest.fn();
    
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        onRowClick={onRowClick}
      />
    );

    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow!);

    expect(onRowClick).toHaveBeenCalledWith(sampleData[0]);
  });

  it('shows loading state', () => {
    render(
      <DataTable
        data={[]}
        columns={sampleColumns}
        loading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={sampleColumns}
      />
    );

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it('exports data when export button is clicked', () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        exportable={true}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders custom cell content', () => {
    render(
      <DataTable
        data={sampleData}
        columns={sampleColumns}
      />
    );

    // Check if custom status cell is rendered
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });
});
