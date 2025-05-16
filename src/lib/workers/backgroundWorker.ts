import { processEmbeddingQueue } from './embeddingWorker';
import { processSummaryQueue } from './summaryWorker';

const WORKER_INTERVAL = 30000; // 30 seconds

export async function startBackgroundWorker() {
  console.log('Starting background worker...');
  
  async function processQueues() {
    try {
      // Process embedding queue
      const embeddingResult = await processEmbeddingQueue();
      console.log('Embedding queue processed:', embeddingResult);

      // Process summary queue
      const summaryResult = await processSummaryQueue();
      console.log('Summary queue processed:', summaryResult);
    } catch (error) {
      console.error('Error in background worker:', error);
    }
  }

  // Run immediately on start
  await processQueues();

  // Then run every 30 seconds
  setInterval(processQueues, WORKER_INTERVAL);
}

// Start the worker if this file is run directly
if (require.main === module) {
  startBackgroundWorker().catch(console.error);
} 