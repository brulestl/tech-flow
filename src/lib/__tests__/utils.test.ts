import { saveResource, getRecentResources, getResourcesByTags, searchResources } from '../utils';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Resource Management Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
  });

  describe('saveResource', () => {
    it('should save a new resource with generated id and date', () => {
      const newResource = {
        title: 'Test Resource',
        url: 'https://example.com',
        type: 'article' as const,
        tags: ['test'],
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));
      
      const savedResource = saveResource(newResource);
      
      expect(savedResource).toHaveProperty('id');
      expect(savedResource).toHaveProperty('dateAdded');
      expect(savedResource.title).toBe(newResource.title);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getRecentResources', () => {
    it('should return resources sorted by date', () => {
      const mockResources = [
        {
          id: '1',
          title: 'Old Resource',
          url: 'https://example.com/1',
          type: 'article' as const,
          tags: ['test'],
          dateAdded: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'New Resource',
          url: 'https://example.com/2',
          type: 'article' as const,
          tags: ['test'],
          dateAdded: '2023-01-02T00:00:00Z',
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockResources));
      
      const recentResources = getRecentResources(1);
      
      expect(recentResources).toHaveLength(1);
      expect(recentResources[0].title).toBe('New Resource');
    });
  });

  describe('getResourcesByTags', () => {
    it('should filter resources by tags', () => {
      const mockResources = [
        {
          id: '1',
          title: 'React Resource',
          url: 'https://example.com/1',
          type: 'article' as const,
          tags: ['react', 'javascript'],
          dateAdded: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Vue Resource',
          url: 'https://example.com/2',
          type: 'article' as const,
          tags: ['vue', 'javascript'],
          dateAdded: '2023-01-02T00:00:00Z',
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockResources));
      
      const reactResources = getResourcesByTags(['react']);
      
      expect(reactResources).toHaveLength(1);
      expect(reactResources[0].title).toBe('React Resource');
    });

    it('should return empty array for no matching tags', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));
      
      const resources = getResourcesByTags(['nonexistent']);
      
      expect(resources).toHaveLength(0);
    });
  });

  describe('searchResources', () => {
    it('should search resources by title, tags, summary, and notes', () => {
      const mockResources = [
        {
          id: '1',
          title: 'React Hooks Guide',
          url: 'https://example.com/1',
          type: 'article' as const,
          tags: ['react', 'hooks'],
          summary: 'Learn about React hooks',
          notes: 'Great tutorial',
          dateAdded: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Vue Components',
          url: 'https://example.com/2',
          type: 'article' as const,
          tags: ['vue'],
          summary: 'Vue component patterns',
          dateAdded: '2023-01-02T00:00:00Z',
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockResources));
      
      const searchResults = searchResources('hooks');
      
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toBe('React Hooks Guide');
    });

    it('should return empty array for no matches', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));
      
      const results = searchResources('nonexistent');
      
      expect(results).toHaveLength(0);
    });
  });
}); 