import { renderHook, act } from '@testing-library/react';
import { useDataTableState } from './index';

describe('useDataTableState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useDataTableState(25));
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(25);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.sortConfig.key).toBe(null);
    expect(result.current.sortConfig.direction).toBe('asc');
  });

  it('updates current page', () => {
    const { result } = renderHook(() => useDataTableState());
    
    act(() => {
      result.current.setCurrentPage(3);
    });
    
    expect(result.current.currentPage).toBe(3);
  });

  it('updates search term', () => {
    const { result } = renderHook(() => useDataTableState());
    
    act(() => {
      result.current.setSearchTerm('test search');
    });
    
    expect(result.current.searchTerm).toBe('test search');
  });

  it('updates sort configuration', () => {
    const { result } = renderHook(() => useDataTableState());
    
    act(() => {
      result.current.setSortConfig({ key: 'name', direction: 'desc' });
    });
    
    expect(result.current.sortConfig.key).toBe('name');
    expect(result.current.sortConfig.direction).toBe('desc');
  });
});
