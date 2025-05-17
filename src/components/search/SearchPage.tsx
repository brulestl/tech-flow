"use client"

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchResources, getResourcesByTags, Resource } from '@/lib/utils';
import ResourceCard from '@/components/resources/ResourceCard';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    // Get all unique tags from resources
    const tags = new Set<string>();
    resources.forEach(resource => {
      resource.tags.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  }, [resources]);

  useEffect(() => {
    let results: Resource[];
    if (selectedTags.length > 0) {
      results = getResourcesByTags(selectedTags);
    } else {
      results = searchResources(searchQuery);
    }
    setResources(results);
  }, [searchQuery, selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleEdit = (resource: Resource) => {
    // TODO: Implement edit functionality
    console.log('Edit resource:', resource);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete resource:', id);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {resources.length === 0 ? (
          <p className="text-center text-muted-foreground">No results found</p>
        ) : (
          resources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage; 