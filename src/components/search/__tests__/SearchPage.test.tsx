import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from '../SearchPage';
import { searchResources, getResourcesByTags } from '@/lib/utils';

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  searchResources: jest.fn(),
  getResourcesByTags: jest.fn(),
}));

describe('SearchPage', () => {
  const mockResources = [
    {
      id: '1',
      title: 'React Hooks Guide',
      url: 'https://example.com/1',
      type: 'article' as const,
      tags: ['react', 'hooks'],
      summary: 'Learn about React hooks',
      dateAdded: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Vue Components',
      url: 'https://example.com/2',
      type: 'article' as const,
      tags: ['vue'],
      summary: 'Vue component patterns',
      dateAdded: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (searchResources as jest.Mock).mockReturnValue(mockResources);
    (getResourcesByTags as jest.Mock).mockReturnValue(mockResources);
  });

  it('should render search input and results', () => {
    render(<SearchPage />);
    
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should filter resources by search query', async () => {
    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'react' } });
    
    await waitFor(() => {
      expect(searchResources).toHaveBeenCalledWith('react');
    });
    
    expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
  });

  it('should filter resources by tags', async () => {
    render(<SearchPage />);
    
    const tagButton = screen.getByText('react');
    fireEvent.click(tagButton);
    
    await waitFor(() => {
      expect(getResourcesByTags).toHaveBeenCalledWith(['react']);
    });
    
    expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
  });

  it('should show empty state when no results', async () => {
    (searchResources as jest.Mock).mockReturnValue([]);
    
    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('should handle multiple tag selections', async () => {
    render(<SearchPage />);
    
    const reactTag = screen.getByText('react');
    const hooksTag = screen.getByText('hooks');
    
    fireEvent.click(reactTag);
    fireEvent.click(hooksTag);
    
    await waitFor(() => {
      expect(getResourcesByTags).toHaveBeenCalledWith(['react', 'hooks']);
    });
  });

  it('should clear search results when input is cleared', async () => {
    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    // Enter search query
    fireEvent.change(searchInput, { target: { value: 'react' } });
    await waitFor(() => {
      expect(searchResources).toHaveBeenCalledWith('react');
    });
    
    // Clear search input
    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => {
      expect(searchResources).toHaveBeenCalledWith('');
    });
  });
}); 