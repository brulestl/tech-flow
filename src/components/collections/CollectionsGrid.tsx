"use client"

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Code, Paintbrush, Book, FileText } from 'lucide-react';
import { useSupabase } from '@/lib/supabase';
import type { Database } from "@/lib/database.types";

type Collection = Database['public']['Tables']['collections']['Row'] & {
  resource_count: number;
};

interface CollectionsGridProps {
  onCollectionClick?: (collection: Collection) => void;
}

const CollectionsGrid: React.FC<CollectionsGridProps> = ({ onCollectionClick }) => {
  const supabase = useSupabase();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('Please connect your social media account to start saving resources');

        const { data, error } = await supabase
          .from('collections')
          .select(`
            *,
            resource_count:resource_collections(count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Please connect your social media account to start saving resources');
            return;
          }
          throw error;
        }

        if (!mounted) return;

        // Transform the data to flatten the resource_count
        const collectionsWithCount = (data || []).map(collection => ({
          ...collection,
          resource_count: collection.resource_count[0]?.count || 0
        }));

        setCollections(collectionsWithCount);
      } catch (error) {
        console.error('Error fetching collections:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Failed to load collections');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCollections();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('code') || lowerName.includes('dev')) {
      return <Code className="h-6 w-6" />;
    }
    if (lowerName.includes('design') || lowerName.includes('art')) {
      return <Paintbrush className="h-6 w-6" />;
    }
    if (lowerName.includes('book') || lowerName.includes('read')) {
      return <Book className="h-6 w-6" />;
    }
    return <FileText className="h-6 w-6" />;
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <div className="animate-spin text-2xl mb-2">⟳</div>
        Loading collections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{error}</p>
        {error.includes('connect your social media account') && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              To get started, please connect your social media account:
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter' })}
                className="btn btn-outline"
              >
                Connect Twitter
              </button>
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
                className="btn btn-outline"
              >
                Connect GitHub
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">
          No collections found. Create your first collection to get started!
        </p>
        <p className="text-sm text-muted-foreground">
          Collections help you organize your saved resources into meaningful groups
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map(collection => (
        <Card
          key={collection.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onCollectionClick?.(collection)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              {getIcon(collection.name)}
              <h3 className="text-lg font-semibold">{collection.name}</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {collection.resource_count} {collection.resource_count === 1 ? 'resource' : 'resources'}
            </span>
          </CardHeader>
          <CardContent>
            {collection.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Last modified: {format(new Date(collection.updated_at), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CollectionsGrid; 