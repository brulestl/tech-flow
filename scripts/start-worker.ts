import { startBackgroundWorker } from '../src/lib/workers/backgroundWorker';

console.log('Starting background worker...');
startBackgroundWorker().catch((error) => {
  console.error('Failed to start background worker:', error);
  process.exit(1);
}); 