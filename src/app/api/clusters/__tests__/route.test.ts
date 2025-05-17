import { GET } from '../route';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Mock dependencies
jest.mock('openai');
jest.mock('@supabase/supabase-js');

describe('Clusters API Route', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('should generate clusters from resources', async () => {
    // Mock Supabase response
    const mockResources = [
      {
        id: '1',
        title: 'React Hooks Guide',
        resource_tags: [{ tags: { name: 'react' } }],
      },
      {
        id: '2',
        title: 'React Context Tutorial',
        resource_tags: [{ tags: { name: 'react' } }],
      },
      {
        id: '3',
        title: 'Vue Components',
        resource_tags: [{ tags: { name: 'vue' } }],
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
                content: JSON.stringify({
                  title: 'React Development',
                  description: 'Resources about React'
                })
              }
            }]
          })
        }
      }
    };
    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

    const response = await GET();
    const data = await response.json();

    expect(data.clusters).toBeDefined();
    expect(data.clusters.length).toBeGreaterThan(0);
    expect(data.clusters[0]).toHaveProperty('title');
    expect(data.clusters[0]).toHaveProperty('description');
    expect(data.clusters[0]).toHaveProperty('resourceIds');
  });

  it('should handle empty resources', async () => {
    mockSupabase.select.mockResolvedValue({ data: [], error: null });

    const response = await GET();
    const data = await response.json();

    expect(data.clusters).toHaveLength(0);
  });

  it('should handle database errors', async () => {
    mockSupabase.select.mockResolvedValue({ data: null, error: new Error('Database error') });

    const response = await GET();
    expect(response.status).toBe(500);
  });

  it('should handle OpenAI errors', async () => {
    mockSupabase.select.mockResolvedValue({ data: [{ id: '1', title: 'Test' }], error: null });
    
    const mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('OpenAI error'))
        }
      }
    };
    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

    const response = await GET();
    expect(response.status).toBe(500);
  });
}); 