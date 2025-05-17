import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
  summary: string;
  dateCreated: string;
  dateModified: string;
}

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit, onDelete }) => {
  const handleExternalLink = () => {
    window.open(resource.url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div data-testid="resource-type-icon" data-type={resource.type}>
            {resource.type === 'article' && <ExternalLink className="h-4 w-4" />}
            {resource.type === 'video' && <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>}
            {resource.type === 'book' && <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>}
          </div>
          <h3 className="text-lg font-semibold">{resource.title}</h3>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(resource)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(resource.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {resource.summary && (
          <p className="text-sm text-muted-foreground mb-4">{resource.summary}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button variant="link" className="p-0 h-auto" onClick={handleExternalLink}>
          {resource.url}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span>Created: {format(new Date(resource.dateCreated), 'MMM d, yyyy')}</span>
        <span>Modified: {format(new Date(resource.dateModified), 'MMM d, yyyy')}</span>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard; 