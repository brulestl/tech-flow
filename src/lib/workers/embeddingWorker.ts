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

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  
  return response.data[0].embedding;
}

export async function processResource(resourceId: string) {
  try {
    // Fetch resource data
    const { data: resource, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error) throw error;
    if (!resource) throw new Error('Resource not found');

    // Generate embedding from title and description
    const textToEmbed = `${resource.title} ${resource.description || ''}`;
    const embedding = await generateEmbedding(textToEmbed);

    // Update resource with embedding
    const { error: updateError } = await supabase
      .from('resources')
      .update({ embedding })
      .eq('id', resourceId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error processing resource:', error);
    return { success: false, error };
  }
}

// Queue worker function
export async function processEmbeddingQueue() {
  try {
    // Get resources without embeddings
    const { data: resources, error } = await supabase
      .from('resources')
      .select('id')
      .is('embedding', null)
      .limit(10);

    if (error) throw error;

    // Process each resource
    for (const resource of resources) {
      await processResource(resource.id);
    }

    return { success: true, processed: resources.length };
  } catch (error) {
    console.error('Error processing embedding queue:', error);
    return { success: false, error };
  }
} 