import 'openai/shims/node'
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SummaryOptions {
  maxLength?: number;
  tone?: 'professional' | 'casual';
}

/**
 * Generates a concise summary of the provided text using OpenAI's API
 */
export async function generateSummary(
  text: string,
  options: SummaryOptions = {}
): Promise<string> {
  const { maxLength = 2, tone = 'professional' } = options;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates concise summaries. 
          Create a ${maxLength}-sentence summary in a ${tone} tone. 
          Focus on the main points and key insights.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}

/**
 * Mock function for testing environments
 */
export function mockGenerateSummary(text: string): Promise<string> {
  return Promise.resolve(
    `This is a mock summary of the provided text. It simulates the behavior of the OpenAI API in test environments.`
  );
}

// Export the appropriate function based on environment
export const getSummaryGenerator = () => {
  if (process.env.NODE_ENV === 'test' || !process.env.OPENAI_API_KEY) {
    return mockGenerateSummary;
  }
  return generateSummary;
}; 