import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SaveModal from '../SaveModal';
import { vi } from 'vitest';
import { mockGenerateSummary } from '@/lib/ai';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock AI summary generator
vi.mock('@/lib/ai', () => ({
  getSummaryGenerator: () => mockGenerateSummary,
  mockGenerateSummary: vi.fn(),
}));

describe('SaveModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    mockOnClose.mockClear();
    vi.clearAllMocks();
  });

  it('renders the modal with all form fields', () => {
    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail url/i)).toBeInTheDocument();
  });

  it('fetches Twitter metadata and generates AI summary', async () => {
    const mockTwitterResponse = {
      title: 'Test Tweet',
      description: 'Tweet content',
      image: 'https://example.com/image.jpg',
      source_type: 'twitter',
      created_at: '2024-01-01T00:00:00Z',
      content: 'This is the full tweet content that will be summarized',
    };

    const mockSummary = 'This is an AI-generated summary of the tweet.';

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTwitterResponse),
    });

    (mockGenerateSummary as jest.Mock).mockResolvedValueOnce(mockSummary);

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    const urlInput = screen.getByLabelText(/url/i);
    fireEvent.change(urlInput, { target: { value: 'https://twitter.com/user/status/123' } });
    fireEvent.blur(urlInput);

    // Check loading state
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for metadata to be fetched and form to be updated
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Tweet');
      expect(screen.getByLabelText(/type/i)).toHaveValue('twitter');
      expect(screen.getByLabelText(/thumbnail url/i)).toHaveValue('https://example.com/image.jpg');
    });

    // Wait for AI summary to be generated
    await waitFor(() => {
      expect(screen.getByLabelText(/summary/i)).toHaveValue(mockSummary);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/social/twitter?url=https%3A%2F%2Ftwitter.com%2Fuser%2Fstatus%2F123');
    expect(mockGenerateSummary).toHaveBeenCalledWith(mockTwitterResponse.content);
  });

  it('fetches generic metadata and generates AI summary', async () => {
    const mockGenericResponse = {
      title: 'Test Article',
      description: 'Article content',
      image: 'https://example.com/image.jpg',
      content: 'This is the full article content that will be summarized',
    };

    const mockSummary = 'This is an AI-generated summary of the article.';

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGenericResponse),
    });

    (mockGenerateSummary as jest.Mock).mockResolvedValueOnce(mockSummary);

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);

    const urlInput = screen.getByLabelText(/url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/article' } });
    fireEvent.blur(urlInput);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Article');
      expect(screen.getByLabelText(/type/i)).toHaveValue('article');
      expect(screen.getByLabelText(/thumbnail url/i)).toHaveValue('https://example.com/image.jpg');
    });

    // Wait for AI summary to be generated
    await waitFor(() => {
      expect(screen.getByLabelText(/summary/i)).toHaveValue(mockSummary);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/metadata?url=https%3A%2F%2Fexample.com%2Farticle');
    expect(mockGenerateSummary).toHaveBeenCalledWith(mockGenericResponse.content);
  });

  it('shows error message when metadata fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);

    const urlInput = screen.getByLabelText(/url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/article' } });
    fireEvent.blur(urlInput);

    await waitFor(() => {
      expect(screen.getByText(/could not retrieve metadata/i)).toBeInTheDocument();
    });
  });

  it('handles AI summary generation failure gracefully', async () => {
    const mockGenericResponse = {
      title: 'Test Article',
      description: 'Article content',
      image: 'https://example.com/image.jpg',
      content: 'This is the full article content that will be summarized',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGenericResponse),
    });

    (mockGenerateSummary as jest.Mock).mockRejectedValueOnce(new Error('AI summary failed'));

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    const urlInput = screen.getByLabelText(/url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/article' } });
    fireEvent.blur(urlInput);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Article');
      expect(screen.getByLabelText(/summary/i)).toHaveValue('Article content');
    });
  });

  it('validates form before submission', async () => {
    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/url is required/i)).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const mockSaveResource = vi.fn();
    vi.mock('@/lib/utils', () => ({
      saveResource: mockSaveResource,
    }));

    render(<SaveModal isOpen={true} onClose={mockOnClose} />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Resource' } });
    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'article' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'test, example' } });

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSaveResource).toHaveBeenCalledWith({
        title: 'Test Resource',
        url: 'https://example.com',
        type: 'article',
        tags: ['test', 'example'],
        thumbnail_url: '',
        summary: '',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
}); 