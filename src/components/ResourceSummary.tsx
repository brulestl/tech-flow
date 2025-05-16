import { useResourceStore } from '@/lib/stores/resourceStore';
import { Database } from '@/lib/database.types';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';

type Resource = Database['public']['Tables']['resources']['Row'];

interface ResourceSummaryProps {
  resource: Resource;
}

export function ResourceSummary({ resource }: ResourceSummaryProps) {
  const { retrySummary } = useResourceStore();

  if (!resource.url) {
    return null;
  }

  const renderSummaryContent = () => {
    switch (resource.summary_status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner size="sm" />
            <span>Generating summary...</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner size="sm" />
            <span>Processing content...</span>
          </div>
        );
      case 'completed':
        return resource.summary ? (
          <p className="text-sm text-gray-600">{resource.summary}</p>
        ) : null;
      case 'failed':
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-500">Failed to generate summary</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => retrySummary(resource.id)}
            >
              Retry
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-2">
      {renderSummaryContent()}
      {resource.summary_updated_at && (
        <p className="mt-1 text-xs text-gray-400">
          Updated {new Date(resource.summary_updated_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
} 