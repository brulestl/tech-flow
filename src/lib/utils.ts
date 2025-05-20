import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}

// Resource types
export type ResourceType = 'tweet' | 'instagram' | 'code' | 'article' | 'other';

// Main data interfaces
export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  thumbnail?: string;
  summary?: string;
  content?: string;
  tags: string[];
  dateAdded: string;
  notes?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  resources: string[]; // IDs of resources
  dateCreated: string;
  dateModified: string;
}

export interface Session {
  id: string;
  name: string;
  resources: string[]; // IDs of resources
  duration: number; // in minutes
  completed: boolean;
  dateCreated: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  streak: number;
  flashcardsMastered: number;
  activeSessions: number;
}

// Local storage helpers
const STORAGE_PREFIX = 'techvault_';

export function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to storage:', error);
  }
}

// Data management functions
export function saveResource(resource: Omit<Resource, 'id' | 'dateAdded'>): Resource {
  const resources = getFromStorage<Resource[]>('resources') || [];
  const newResource: Resource = {
    ...resource,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  
  resources.push(newResource);
  setToStorage('resources', resources);
  return newResource;
}

export function getResources(): Resource[] {
  return getFromStorage<Resource[]>('resources') || [];
}

export function getRecentResources(limit: number = 10): Resource[] {
  const resources = getResources();
  return resources
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, limit);
}

export function getResourcesByTags(tags: string[]): Resource[] {
  const resources = getResources();
  return resources.filter(resource =>
    tags.every(tag => resource.tags.includes(tag))
  );
}

export function searchResources(query: string): Resource[] {
  if (!query) return [];
  
  const resources = getResources();
  const searchTerms = query.toLowerCase().split(' ');
  
  return resources.filter(resource => {
    const searchableText = [
      resource.title,
      resource.summary,
      resource.tags.join(' '),
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Generate mock data for initial display
export function generateMockData(): void {
  // Check if we already have data
  if (getResources().length > 0) return;
  
  const mockResources: Omit<Resource, 'id' | 'dateAdded'>[] = [
    {
      title: "Understanding React Hooks",
      url: "https://twitter.com/user/status/1234567890",
      type: "tweet",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
      summary: "Thread explaining how useEffect, useState and useContext work together",
      tags: ["react", "hooks", "javascript"],
      notes: "Great explanation of dependency arrays in useEffect"
    },
    {
      title: "CSS Grid Layout Techniques",
      url: "https://instagram.com/p/abcdef123",
      type: "instagram",
      thumbnail: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800&auto=format&fit=crop",
      summary: "Visual guide to advanced CSS grid techniques",
      tags: ["css", "grid", "layout"],
    },
    {
      title: "Tailwind CSS Animation Examples",
      url: "https://codepen.io/username/pen/123456",
      type: "code",
      content: "const fadeIn = 'animate-fadeIn';\nconst slideIn = 'animate-slideIn';",
      summary: "Collection of reusable animation classes",
      tags: ["tailwind", "animation", "css"],
      notes: "Useful for enhancing UI interactions"
    },
    {
      title: "Building a TypeScript Design System",
      url: "https://medium.com/article-123456",
      type: "article",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
      summary: "Comprehensive guide to creating a robust design system with TypeScript",
      tags: ["typescript", "design-system", "frontend"],
    },
    {
      title: "NextJS Server Components Explained",
      url: "https://twitter.com/user/status/9876543210",
      type: "tweet",
      thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&auto=format&fit=crop",
      summary: "Deep dive thread into how NextJS server components work",
      tags: ["nextjs", "react", "server-components"],
    }
  ];
  
  mockResources.forEach(resource => saveResource(resource));
  
  // Create sample collections
  const collections: Collection[] = [
    {
      id: nanoid(),
      name: "React Patterns",
      description: "Best practices and patterns for React development",
      icon: "code",
      resources: [],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    },
    {
      id: nanoid(),
      name: "CSS Techniques",
      description: "Advanced CSS layouts and animations",
      icon: "paintbrush",
      resources: [],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    }
  ];
  
  setToStorage('collections', collections);
  
  // Create user profile
  const profile: UserProfile = {
    name: "Dev User",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
    streak: 5,
    flashcardsMastered: 42,
    activeSessions: 2
  };
  
  setToStorage('profile', profile);
}
