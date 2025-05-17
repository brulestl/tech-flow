import { render, screen, fireEvent } from '@testing-library/react';
import ResourceCard from '../ResourceCard';

const mockResource = {
  id: '1',
  title: 'Test Resource',
  url: 'https://example.com',
  type: 'article',
  tags: ['test', 'example'],
  summary: 'This is a test resource summary',
  dateCreated: '2024-01-01T00:00:00.000Z',
  dateModified: '2024-01-02T00:00:00.000Z',
};

describe('ResourceCard', () => {
  it('renders resource information correctly', () => {
    render(<ResourceCard resource={mockResource} onEdit={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText(mockResource.title)).toBeInTheDocument();
    expect(screen.getByText(mockResource.summary)).toBeInTheDocument();
    expect(screen.getByText(mockResource.url)).toBeInTheDocument();
    mockResource.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<ResourceCard resource={mockResource} onEdit={handleEdit} onDelete={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(mockResource);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<ResourceCard resource={mockResource} onEdit={() => {}} onDelete={handleDelete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith(mockResource.id);
  });

  it('displays formatted dates correctly', () => {
    render(<ResourceCard resource={mockResource} onEdit={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText(/Created: Jan 1, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Modified: Jan 2, 2024/)).toBeInTheDocument();
  });

  it('handles missing summary gracefully', () => {
    const resourceWithoutSummary = { ...mockResource, summary: '' };
    render(<ResourceCard resource={resourceWithoutSummary} onEdit={() => {}} onDelete={() => {}} />);
    
    expect(screen.queryByText(mockResource.summary)).not.toBeInTheDocument();
  });

  it('handles missing tags gracefully', () => {
    const resourceWithoutTags = { ...mockResource, tags: [] };
    render(<ResourceCard resource={resourceWithoutTags} onEdit={() => {}} onDelete={() => {}} />);
    
    expect(screen.queryByText('test')).not.toBeInTheDocument();
    expect(screen.queryByText('example')).not.toBeInTheDocument();
  });

  it('displays resource type icon correctly', () => {
    render(<ResourceCard resource={mockResource} onEdit={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByTestId('resource-type-icon')).toHaveAttribute('data-type', mockResource.type);
  });
}); 