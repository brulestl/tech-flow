import { render, screen, fireEvent } from '@testing-library/react';
import CollectionsGrid from '../CollectionsGrid';
import { Collection } from '@/lib/utils';

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  getFromStorage: jest.fn(),
  setToStorage: jest.fn(),
}));

describe('CollectionsGrid', () => {
  const mockCollections: Collection[] = [
    {
      id: '1',
      name: 'React Patterns',
      description: 'Best practices and patterns for React development',
      icon: 'code',
      resources: ['1', '2'],
      dateCreated: '2023-01-01T00:00:00Z',
      dateModified: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'CSS Techniques',
      description: 'Advanced CSS layouts and animations',
      icon: 'paintbrush',
      resources: ['3'],
      dateCreated: '2023-01-02T00:00:00Z',
      dateModified: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/lib/utils').getFromStorage as jest.Mock).mockReturnValue(mockCollections);
  });

  it('should render collections grid', () => {
    render(<CollectionsGrid />);
    
    expect(screen.getByText('React Patterns')).toBeInTheDocument();
    expect(screen.getByText('CSS Techniques')).toBeInTheDocument();
  });

  it('should show empty state when no collections', () => {
    (require('@/lib/utils').getFromStorage as jest.Mock).mockReturnValue([]);
    
    render(<CollectionsGrid />);
    
    expect(screen.getByText(/no collections found/i)).toBeInTheDocument();
  });

  it('should display collection details', () => {
    render(<CollectionsGrid />);
    
    const reactCollection = screen.getByText('React Patterns');
    expect(reactCollection).toBeInTheDocument();
    expect(screen.getByText('Best practices and patterns for React development')).toBeInTheDocument();
    expect(screen.getByText('2 resources')).toBeInTheDocument();
  });

  it('should handle collection click', () => {
    const mockOnCollectionClick = jest.fn();
    render(<CollectionsGrid onCollectionClick={mockOnCollectionClick} />);
    
    const collection = screen.getByText('React Patterns');
    fireEvent.click(collection);
    
    expect(mockOnCollectionClick).toHaveBeenCalledWith(mockCollections[0]);
  });

  it('should show collection icons', () => {
    render(<CollectionsGrid />);
    
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons).toHaveLength(2);
  });

  it('should display last modified date', () => {
    render(<CollectionsGrid />);
    
    expect(screen.getByText(/last modified/i)).toBeInTheDocument();
  });

  it('should handle empty collection description', () => {
    const collectionsWithoutDescription = [
      {
        ...mockCollections[0],
        description: undefined,
      },
    ];
    (require('@/lib/utils').getFromStorage as jest.Mock).mockReturnValue(collectionsWithoutDescription);
    
    render(<CollectionsGrid />);
    
    expect(screen.getByText('React Patterns')).toBeInTheDocument();
    expect(screen.queryByText('Best practices and patterns for React development')).not.toBeInTheDocument();
  });
}); 