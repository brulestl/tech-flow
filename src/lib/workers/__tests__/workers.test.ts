import { processResource } from '../embeddingWorker';
import { processResourceSummary } from '../summaryWorker';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Mock dependencies
jest.mock('@supabase/supabase-js');
jest.mock('openai');

describe('Worker Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Embedding Worker', () => {
    it('should generate embedding for a resource', async () => {
      const mockResource = {
        id: '123',
        title: 'Test Resource',
        description: 'Test Description'
      };

      const mockEmbedding = new Array(1536).fill(0.1);

      // Mock Supabase client
      (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockResource, error: null }),
        update: jest.fn().mockResolvedValue({ error: null })
      });

      // Mock OpenAI
      const mockOpenAI = {
        embeddings: {
          create: jest.fn().mockResolvedValue({
            data: [{ embedding: mockEmbedding }]
          })
        }
      };
      (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

      const result = await processResource('123');
      expect(result.success).toBe(true);
    });
  });

  describe('Summary Worker', () => {
    it('should generate summary for a resource', async () => {
      const mockResource = {
        id: '123',
        title: 'Test Resource',
        description: 'Test Description',
        content: 'Test Content'
      };

      const mockSummary = 'This is a test summary';

      // Mock Supabase client
      (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockResource, error: null }),
        update: jest.fn().mockResolvedValue({ error: null })
      });

      // Mock OpenAI
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: mockSummary } }]
            })
          }
        }
      };
      (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

      const result = await processResourceSummary('123');
      expect(result.success).toBe(true);
    });
  });
}); 