import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collection } from '@/lib/utils';
import { getFromStorage } from '@/lib/utils';
import { Code, Paintbrush, Book, FileText } from 'lucide-react';

interface CollectionsGridProps {
  onCollectionClick?: (collection: Collection) => void;
}

const CollectionsGrid: React.FC<CollectionsGridProps> = ({ onCollectionClick }) => {
  const collections = getFromStorage<Collection[]>('collections') || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="h-6 w-6" />;
      case 'paintbrush':
        return <Paintbrush className="h-6 w-6" />;
      case 'book':
        return <Book className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  if (collections.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No collections found
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
              {getIcon(collection.icon)}
              <h3 className="text-lg font-semibold">{collection.name}</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {collection.resources.length} resources
            </span>
          </CardHeader>
          <CardContent>
            {collection.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Last modified: {format(new Date(collection.dateModified), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CollectionsGrid; 