import 'openai/shims/node'
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import OpenAI from 'openai';

type Resource = Database['public']['Tables']['resources']['Row'];
type ResourceUpdate = Database['public']['Tables']['resources']['Update'];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    // Basic HTML to text conversion - you might want to use a proper HTML parser
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

async function generateSummary(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise summaries of web content. Keep summaries under 200 characters."
        },
        {
          role: "user",
          content: `Please summarize this content: ${content.substring(0, 4000)}`
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    return '';
  }
}

async function processResource(resource: Resource) {
  if (!resource.url) return;

  try {
    // Update status to processing
    await supabase
      .from('resources')
      .update({ summary_status: 'processing' })
      .eq('id', resource.id);

    // Fetch and summarize content
    const content = await fetchPageContent(resource.url);
    const summary = await generateSummary(content);

    // Update resource with summary
    const update: ResourceUpdate = {
      summary: summary,
      summary_status: summary ? 'completed' : 'failed',
      summary_updated_at: new Date().toISOString()
    };

    await supabase
      .from('resources')
      .update(update)
      .eq('id', resource.id);

  } catch (error) {
    console.error('Error processing resource:', error);
    await supabase
      .from('resources')
      .update({ summary_status: 'failed' })
      .eq('id', resource.id);
  }
}

export async function startSummarizationWorker() {
  console.log('Starting summarization worker...');

  // Process pending resources
  const processPendingResources = async () => {
    const { data: resources, error } = await supabase
      .from('resources')
      .select('*')
      .is('summary', null)
      .eq('summary_status', 'pending')
      .limit(5);

    if (error) {
      console.error('Error fetching pending resources:', error);
      return;
    }

    for (const resource of resources) {
      await processResource(resource);
    }
  };

  // Run initial processing
  await processPendingResources();

  // Set up realtime subscription for new resources
  const subscription = supabase
    .channel('resource-summarization')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'resources'
      },
      async (payload) => {
        const resource = payload.new as Resource;
        if (!resource.summary) {
          await processResource(resource);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
} 