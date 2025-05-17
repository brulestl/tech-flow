"use client";

import { useState, useEffect } from "react";
import { getCollection, getCollectionResources, removeResourceFromCollection } from '@/lib/dataService';
import ResourceCard from '@/components/features/ResourceCard';
import EditResourceModal from '@/components/features/EditResourceModal';
import { notFound, useParams } from 'next/navigation';

export default function CollectionDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id[0];

  const [collection, setCollection] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const col = await getCollection(id);
      const res = await getCollectionResources(id);
      setCollection(col);
      setResources(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!collection && !isLoading) {
    notFound();
  }

  const handleRemove = async (resourceId: string) => {
    try {
      await removeResourceFromCollection(id, resourceId);
      setResources(prev => prev.filter(r => r.id !== resourceId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove resource from collection');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{collection?.name}</h1>
        {collection?.description && (
          <p className="text-muted-foreground">{collection.description}</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin text-2xl">⟳</div>
        </div>
      ) : resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="relative group border rounded-lg p-4 bg-card">
              <ResourceCard resource={resource} />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => setEditingResource(resource)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-destructive"
                  onClick={() => handleRemove(resource.id)}
                >
                  Remove from Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No resources in this collection</p>
          <p className="text-muted-foreground">Add resources to this collection to see them here.</p>
        </div>
      )}

      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
} 