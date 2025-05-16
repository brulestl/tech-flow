import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { Database } from '../database.types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateSummary(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that creates concise summaries of web content. Create a 2-3 sentence summary that captures the main points."
      },
      {
        role: "user",
        content: `Please summarize this content: ${content}`
      }
    ],
    max_tokens: 150,
    temperature: 0.3,
  });

  return response.choices[0].message.content || '';
}

export async function processResourceSummary(resourceId: string) {
  try {
    // Fetch resource data
    const { data: resource, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error) throw error;
    if (!resource) throw new Error('Resource not found');

    // Generate summary from content
    const summary = await generateSummary(resource.content || resource.description || resource.title);

    // Update resource with summary
    const { error: updateError } = await supabase
      .from('resources')
      .update({ summary })
      .eq('id', resourceId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error processing resource summary:', error);
    return { success: false, error };
  }
}

// Queue worker function
export async function processSummaryQueue() {
  try {
    // Get resources without summaries
    const { data: resources, error } = await supabase
      .from('resources')
      .select('id')
      .is('summary', null)
      .limit(10);

    if (error) throw error;

    // Process each resource
    for (const resource of resources) {
      await processResourceSummary(resource.id);
    }

    return { success: true, processed: resources.length };
  } catch (error) {
    console.error('Error processing summary queue:', error);
    return { success: false, error };
  }
} 