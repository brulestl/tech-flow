import 'openai/shims/node'
import { startSummarizationWorker } from '../summarizationWorker';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Mock dependencies
jest.mock('openai');
jest.mock('@supabase/supabase-js');

describe('Summarization Worker', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    channel: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('should process pending resources', async () => {
    // Mock Supabase response
    const mockResources = [
      {
        id: '1',
        url: 'https://example.com/article',
        title: 'Test Article',
      },
    ];
    mockSupabase.select.mockResolvedValue({ data: mockResources, error: null });

    // Mock OpenAI response
    const mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: 'Test summary'
              }
            }]
          })
        }
      }
    };
    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

    // Mock fetch response
    global.fetch = jest.fn().mockResolvedValue({
      text: () => Promise.resolve('<html><body>Test content</body></html>')
    });

    await startSummarizationWorker();

    expect(mockSupabase.select).toHaveBeenCalled();
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    expect(mockSupabase.update).toHaveBeenCalledWith({
      summary: 'Test summary',
      summary_status: 'completed',
      summary_updated_at: expect.any(String)
    });
  });

  it('should handle errors gracefully', async () => {
    // Mock Supabase error
    mockSupabase.select.mockResolvedValue({ data: null, error: new Error('Database error') });

    await startSummarizationWorker();

    expect(mockSupabase.update).not.toHaveBeenCalled();
  });

  it('should set up realtime subscription', async () => {
    mockSupabase.select.mockResolvedValue({ data: [], error: null });

    const cleanup = await startSummarizationWorker();

    expect(mockSupabase.channel).toHaveBeenCalledWith('resource-summarization');
    expect(mockSupabase.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'resources'
      },
      expect.any(Function)
    );
    expect(mockSupabase.subscribe).toHaveBeenCalled();

    // Test cleanup function
    cleanup();
    expect(mockSupabase.unsubscribe).toHaveBeenCalled();
  });
}); 