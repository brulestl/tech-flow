import 'openai/shims/node'
import { POST } from '../route';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

// Mock external dependencies
jest.mock('openai');
jest.mock('@mozilla/readability');
jest.mock('jsdom');

describe('Summarize API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip summarization for code and other types', async () => {
    const request = new Request('http://localhost:3000/api/summarize', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com',
        title: 'Test Code',
        type: 'code'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.summary).toBeNull();
  });

  it('should extract and summarize article content', async () => {
    // Mock JSDOM and Readability
    const mockArticle = {
      textContent: 'This is a test article content'
    };
    (JSDOM as jest.Mock).mockImplementation(() => ({
      window: {
        document: {}
      }
    }));
    (Readability as jest.Mock).mockImplementation(() => ({
      parse: () => mockArticle
    }));

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
    (OpenAI as jest.Mock).mockImplementation(() => mockOpenAI);

    const request = new Request('http://localhost:3000/api/summarize', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/article',
        title: 'Test Article',
        type: 'article'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.summary).toBe('Test summary');
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    // Mock fetch to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const request = new Request('http://localhost:3000/api/summarize', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/article',
        title: 'Test Article',
        type: 'article'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.summary).toBeNull();
  });
}); 