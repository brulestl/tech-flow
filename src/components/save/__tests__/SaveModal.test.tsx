import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SaveModal from '../SaveModal';
import { saveResource } from '@/lib/utils';

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  saveResource: jest.fn(),
}));

describe('SaveModal', () => {
  const mockResource = {
    title: 'Test Resource',
    url: 'https://example.com',
    type: 'article' as const,
    tags: ['test'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render save modal with form', () => {
    render(<SaveModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const mockOnClose = jest.fn();
    (saveResource as jest.Mock).mockReturnValue({
      ...mockResource,
      id: '1',
      dateAdded: '2023-01-01T00:00:00Z',
    });

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: mockResource.title },
    });
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: mockResource.url },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: mockResource.type },
    });
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: mockResource.tags.join(', ') },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(saveResource).toHaveBeenCalledWith(mockResource);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should validate required fields', async () => {
    render(<SaveModal isOpen={true} onClose={() => {}} />);
    
    // Submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/url is required/i)).toBeInTheDocument();
    expect(screen.getByText(/type is required/i)).toBeInTheDocument();
  });

  it('should validate URL format', async () => {
    render(<SaveModal isOpen={true} onClose={() => {}} />);
    
    // Enter invalid URL
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: 'invalid-url' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(screen.getByText(/invalid url format/i)).toBeInTheDocument();
  });

  it('should handle tag input', () => {
    render(<SaveModal isOpen={true} onClose={() => {}} />);
    
    const tagInput = screen.getByLabelText(/tags/i);
    fireEvent.change(tagInput, {
      target: { value: 'react, typescript, testing' },
    });
    
    expect(tagInput).toHaveValue('react, typescript, testing');
  });

  it('should close modal on cancel', () => {
    const mockOnClose = jest.fn();
    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle save errors', async () => {
    const mockOnClose = jest.fn();
    (saveResource as jest.Mock).mockRejectedValue(new Error('Save failed'));

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: mockResource.title },
    });
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: mockResource.url },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: mockResource.type },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to save resource/i)).toBeInTheDocument();
    });
  });
}); 