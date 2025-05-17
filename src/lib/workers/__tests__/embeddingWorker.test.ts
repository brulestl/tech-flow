import { processResource, processEmbeddingQueue } from '../embeddingWorker';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Mock dependencies
jest.mock('openai');
jest.mock('@supabase/supabase-js');

describe('Embedding Worker', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('processResource', () => {
    it('should generate and save embedding for a resource', async () => {
      // Mock Supabase response
      const mockResource = {
        id: '1',
        title: 'Test Resource',
        description: 'Test description',
      };
      mockSupabase.select.mockResolvedValue({ data: mockResource, error: null });

      // Mock OpenAI response
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockOpenAI = {
        embeddings: {
          create: jest.fn().mockResolvedValue({
            data: [{ embedding: mockEmbedding }]
          })
        }
      };
      (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

      const result = await processResource('1');

      expect(result.success).toBe(true);
      expect(mockOpenAI.embeddings.create).toHaveBeenCalledWith({
        model: 'text-embedding-ada-002',
        input: 'Test Resource Test description'
      });
      expect(mockSupabase.update).toHaveBeenCalledWith({
        embedding: mockEmbedding
      });
    });

    it('should handle missing resource', async () => {
      mockSupabase.select.mockResolvedValue({ data: null, error: null });

      const result = await processResource('1');

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('should handle database errors', async () => {
      mockSupabase.select.mockResolvedValue({ data: null, error: new Error('Database error') });

      const result = await processResource('1');

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('processEmbeddingQueue', () => {
    it('should process multiple resources without embeddings', async () => {
      // Mock Supabase response
      const mockResources = [
        { id: '1' },
        { id: '2' }
      ];
      mockSupabase.select.mockResolvedValue({ data: mockResources, error: null });

      // Mock OpenAI response
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockOpenAI = {
        embeddings: {
          create: jest.fn().mockResolvedValue({
            data: [{ embedding: mockEmbedding }]
          })
        }
      };
      (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

      const result = await processEmbeddingQueue();

      expect(result.success).toBe(true);
      expect(result.processed).toBe(2);
      expect(mockOpenAI.embeddings.create).toHaveBeenCalledTimes(2);
    });

    it('should handle empty queue', async () => {
      mockSupabase.select.mockResolvedValue({ data: [], error: null });

      const result = await processEmbeddingQueue();

      expect(result.success).toBe(true);
      expect(result.processed).toBe(0);
    });

    it('should handle database errors', async () => {
      mockSupabase.select.mockResolvedValue({ data: null, error: new Error('Database error') });

      const result = await processEmbeddingQueue();

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });
}); 